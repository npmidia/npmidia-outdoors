import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { sdk } from "./_core/sdk";
import { getSessionCookieOptions } from "./_core/cookies";

// Admin procedure - only allows admin users
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("E-mail inválido"),
        password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
        phone: z.string().min(10, "Telefone inválido"),
        company: z.string().min(2, "Nome da empresa é obrigatório"),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if email already exists
        const existingUser = await db.getUserByEmail(input.email);
        if (existingUser) {
          throw new TRPCError({ code: 'CONFLICT', message: 'E-mail já cadastrado' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(input.password, 10);

        // Create user
        const userId = await db.createUserWithPassword({
          name: input.name,
          email: input.email,
          passwordHash,
          phone: input.phone,
          company: input.company,
        });

        // Create session token
        const sessionToken = await sdk.createSessionToken(`email:${input.email}`, {
          name: input.name,
        });

        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        return { success: true, userId };
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email("E-mail inválido"),
        password: z.string().min(1, "Senha é obrigatória"),
      }))
      .mutation(async ({ ctx, input }) => {
        // Find user by email
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'E-mail ou senha incorretos' });
        }

        // Verify password
        const isValid = await bcrypt.compare(input.password, user.passwordHash);
        if (!isValid) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'E-mail ou senha incorretos' });
        }

        // Create session token
        const sessionToken = await sdk.createSessionToken(`email:${user.email}`, {
          name: user.name || '',
        });

        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        // Update last sign in
        await db.updateUserLastSignIn(user.id);

        return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ UPLOAD ROUTES ============
  upload: router({
    image: adminProcedure
      .input(z.object({
        base64: z.string(),
        filename: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64, 'base64');
        const ext = input.filename.split('.').pop() || 'jpg';
        const key = `outdoors/${nanoid()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url };
      }),
  }),

  // ============ OUTDOOR ROUTES ============
  outdoor: router({
    list: publicProcedure
      .input(z.object({ activeOnly: z.boolean().optional().default(true) }).optional())
      .query(async ({ input }) => {
        return await db.getAllOutdoors(input?.activeOnly ?? true);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getOutdoorById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        code: z.string().min(1),
        street: z.string().optional(),
        number: z.string().optional(),
        neighborhood: z.string().optional(),
        city: z.string().min(1),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        width: z.string().optional(),
        height: z.string().optional(),
        pricePerBiweek: z.string(),
        hasLighting: z.boolean().default(false),
        activationDate: z.string().optional(),
        isActive: z.boolean().default(true),
        photoUrl: z.string().optional(),
        photoUrl2: z.string().optional(),
        photoUrl3: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createOutdoor({
          ...input,
          activationDate: input.activationDate ? new Date(input.activationDate) : undefined,
        });
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().optional(),
        street: z.string().optional(),
        number: z.string().optional(),
        neighborhood: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        width: z.string().optional(),
        height: z.string().optional(),
        pricePerBiweek: z.string().optional(),
        hasLighting: z.boolean().optional(),
        activationDate: z.string().optional(),
        isActive: z.boolean().optional(),
        photoUrl: z.string().optional(),
        photoUrl2: z.string().optional(),
        photoUrl3: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateOutdoor(id, {
          ...data,
          activationDate: data.activationDate ? new Date(data.activationDate) : undefined,
        });
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteOutdoor(input.id);
        return { success: true };
      }),
  }),

  // ============ BIWEEK ROUTES ============
  biweek: router({
    getByYear: publicProcedure
      .input(z.object({ year: z.number() }))
      .query(async ({ input }) => {
        return await db.getBiweeksByYear(input.year);
      }),
    
    generate: adminProcedure
      .input(z.object({ year: z.number() }))
      .mutation(async ({ input }) => {
        return await db.generateBiweeksForYear(input.year);
      }),
    
    getStatusForOutdoor: publicProcedure
      .input(z.object({ outdoorId: z.number(), year: z.number() }))
      .query(async ({ input }) => {
        return await db.getBiweekStatusForOutdoor(input.outdoorId, input.year);
      }),
  }),

  // ============ RESERVATION ROUTES ============
  reservation: router({
    create: protectedProcedure
      .input(z.object({
        outdoorId: z.number(),
        biweekIds: z.array(z.number()),
        includePaperGlue: z.boolean().default(false),
        includeCanvasInstall: z.boolean().default(false),
        totalValue: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createReservation({
          userId: ctx.user.id,
          outdoorId: input.outdoorId,
          includePaperGlue: input.includePaperGlue,
          includeCanvasInstall: input.includeCanvasInstall,
          totalValue: input.totalValue,
          status: "pending",
        }, input.biweekIds);
        
        // Notify admin about new reservation
        await notifyOwner({
          title: "Nova Reserva de Outdoor",
          content: `O usuário ${ctx.user.name || ctx.user.email} criou uma nova reserva no valor de R$ ${input.totalValue}. Acesse o painel administrativo para aprovar ou negar.`,
        });
        
        return { id };
      }),
    
    myReservations: protectedProcedure.query(async ({ ctx }) => {
      return await db.getReservationsByUser(ctx.user.id);
    }),
    
    // Public route to get all reservations for availability check
    list: publicProcedure.query(async () => {
      return await db.getAllReservations();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getReservationById(input.id);
      }),
    
    getBiweeks: protectedProcedure
      .input(z.object({ reservationId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReservationBiweeks(input.reservationId);
      }),
    
    // Admin routes
    listAll: adminProcedure.query(async () => {
      return await db.getAllReservations();
    }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "denied", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateReservationStatus(input.id, input.status);
        return { success: true };
      }),

    
  }),

  // ============ FAVORITES ROUTES ============
  favorite: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFavorites(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({ outdoorId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.addFavorite(ctx.user.id, input.outdoorId);
        return { id };
      }),
    
    remove: protectedProcedure
      .input(z.object({ outdoorId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFavorite(ctx.user.id, input.outdoorId);
        return { success: true };
      }),
    
    check: protectedProcedure
      .input(z.object({ outdoorId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.isFavorite(ctx.user.id, input.outdoorId);
      }),
  }),

  // ============ CART ROUTES ============
  cart: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCartItems(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({
        outdoorId: z.number(),
        biweekIds: z.array(z.number()),
        includePaperGlue: z.boolean().default(false),
        includeCanvasInstall: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.addToCart({
          userId: ctx.user.id,
          outdoorId: input.outdoorId,
          biweekIds: JSON.stringify(input.biweekIds),
          includePaperGlue: input.includePaperGlue,
          includeCanvasInstall: input.includeCanvasInstall,
        });
        return { id };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        biweekIds: z.array(z.number()).optional(),
        includePaperGlue: z.boolean().optional(),
        includeCanvasInstall: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, biweekIds, ...rest } = input;
        await db.updateCartItem(id, {
          ...rest,
          biweekIds: biweekIds ? JSON.stringify(biweekIds) : undefined,
        });
        return { success: true };
      }),
    
    remove: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.removeFromCart(input.id);
        return { success: true };
      }),
    
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
    
    checkout: protectedProcedure.mutation(async ({ ctx }) => {
      const cartItems = await db.getCartItems(ctx.user.id);
      
      if (cartItems.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Carrinho vazio' });
      }
      
      const reservationIds: number[] = [];
      
      for (const item of cartItems) {
        const outdoor = await db.getOutdoorById(item.outdoorId);
        if (!outdoor) continue;
        
        const biweekIds = JSON.parse(item.biweekIds) as number[];
        const biweekCount = biweekIds.length;
        const pricePerBiweek = parseFloat(outdoor.pricePerBiweek);
        
        let totalValue = pricePerBiweek * biweekCount;
        if (item.includePaperGlue) totalValue += 350;
        if (item.includeCanvasInstall) totalValue += 1500;
        
        const id = await db.createReservation({
          userId: ctx.user.id,
          outdoorId: item.outdoorId,
          includePaperGlue: item.includePaperGlue,
          includeCanvasInstall: item.includeCanvasInstall,
          totalValue: totalValue.toFixed(2),
          status: "pending",
        }, biweekIds);
        
        reservationIds.push(id);
      }
      
      // Clear cart after checkout
      await db.clearCart(ctx.user.id);
      
      // Notify admin
      await notifyOwner({
        title: "Novo Pedido de Reserva",
        content: `O usuário ${ctx.user.name || ctx.user.email} finalizou um pedido com ${reservationIds.length} reserva(s). Acesse o painel administrativo para revisar.`,
      });
      
      return { success: true, reservationIds };
    }),
  }),

  // ============ USER MANAGEMENT (ADMIN) ============
  user: router({
    list: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getUserById(input.id);
      }),
    
    updateRole: adminProcedure
      .input(z.object({
        id: z.number(),
        role: z.enum(["user", "admin"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateUserRole(input.id, input.role);
        return { success: true };
      }),
  }),

  // ============ PROFILE (USER) ============
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserById(ctx.user.id);
    }),
    
    update: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        cpfCnpj: z.string().optional(),
        company: z.string().optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // ============ ADMIN STATS ============
  admin: router({
    stats: adminProcedure.query(async () => {
      return await db.getAdminStats();
    }),
    
    // Reservation details with full info
    getReservationDetails: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getReservationDetails(input.id);
      }),
    
    // Update reservation production fields
    updateReservationProduction: adminProcedure
      .input(z.object({
        id: z.number(),
        saleNumber: z.string().optional().nullable(),
        artStatus: z.enum(["waiting", "received", "approved", "in_production"]).optional(),
        adminNotes: z.string().optional().nullable(),
        clientNotes: z.string().optional().nullable(),
        scheduledInstallDate: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateReservationProduction(id, data);
        return { success: true };
      }),
    
    // Approve reservation with sale number (required)
    approveWithSaleNumber: adminProcedure
      .input(z.object({
        id: z.number(),
        saleNumber: z.string().min(1, "Número da venda é obrigatório"),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.approveReservationWithSaleNumber(input.id, input.saleNumber, ctx.user.id);
        return { success: true };
      }),
    
    // Get client details with history
    getClientDetails: adminProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getClientDetails(input.userId);
      }),
    
    // Get reservations with filters
    getReservationsFiltered: adminProcedure
      .input(z.object({
        userId: z.number().optional(),
        status: z.string().optional(),
        search: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getReservationsWithFilters(input);
      }),
  }),
  
  // ============ RESERVATION ARTS ============
  reservationArt: router({
    // Get arts for a reservation
    list: protectedProcedure
      .input(z.object({ reservationId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReservationArts(input.reservationId);
      }),
    
    // Upload art (client or admin)
    upload: protectedProcedure
      .input(z.object({
        reservationId: z.number(),
        base64: z.string(),
        fileName: z.string(),
        contentType: z.string(),
        fileSize: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Upload file to S3
        const buffer = Buffer.from(input.base64, 'base64');
        const ext = input.fileName.split('.').pop() || 'pdf';
        const fileKey = `arts/${input.reservationId}/${nanoid()}.${ext}`;
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        // Save to database
        const id = await db.addReservationArt({
          reservationId: input.reservationId,
          fileUrl: url,
          fileKey,
          fileName: input.fileName,
          fileSize: input.fileSize,
          mimeType: input.contentType,
          uploadedBy: ctx.user.id,
          uploadedByRole: ctx.user.role === 'admin' ? 'admin' : 'client',
          notes: input.notes,
        });
        
        return { id, url };
      }),
    
    // Delete art (admin only)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteReservationArt(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
