import { eq, and, sql, inArray, desc, gte, lte, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  outdoors, InsertOutdoor, Outdoor,
  biweeks, InsertBiweek, Biweek,
  reservations, InsertReservation, Reservation,
  reservationBiweeks, InsertReservationBiweek,
  reservationArts, InsertReservationArt, ReservationArt,
  favorites, InsertFavorite,
  cartItems, InsertCartItem
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone", "cpfCnpj"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserWithPassword(data: {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  company: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(users).values({
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    phone: data.phone,
    company: data.company,
    loginMethod: 'email',
    role: 'user',
    lastSignedIn: new Date(),
  });

  return result[0].insertId;
}

export async function updateUserLastSignIn(userId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserRole(id: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, id));
}

export async function updateUserProfile(id: number, data: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  cpfCnpj?: string | null;
  company?: string | null;
  address?: string | null;
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, id));
}

// ============ OUTDOOR FUNCTIONS ============

export async function getAllOutdoors(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  
  if (activeOnly) {
    return await db.select().from(outdoors).where(eq(outdoors.isActive, true)).orderBy(asc(outdoors.code));
  }
  return await db.select().from(outdoors).orderBy(asc(outdoors.code));
}

export async function getOutdoorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(outdoors).where(eq(outdoors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOutdoorByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(outdoors).where(eq(outdoors.code, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOutdoor(outdoor: InsertOutdoor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(outdoors).values(outdoor);
  return result[0].insertId;
}

export async function updateOutdoor(id: number, outdoor: Partial<InsertOutdoor>) {
  const db = await getDb();
  if (!db) return;
  await db.update(outdoors).set(outdoor).where(eq(outdoors.id, id));
}

export async function deleteOutdoor(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(outdoors).where(eq(outdoors.id, id));
}

// ============ BIWEEK FUNCTIONS ============

export async function getBiweeksByYear(year: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(biweeks).where(eq(biweeks.year, year)).orderBy(asc(biweeks.biweekNumber));
}

export async function getAllBiweeks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(biweeks).orderBy(asc(biweeks.year), asc(biweeks.biweekNumber));
}

export async function createBiweek(biweek: InsertBiweek) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(biweeks).values(biweek);
  return result[0].insertId;
}

export async function generateBiweeksForYear(year: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if biweeks already exist for this year
  const existing = await getBiweeksByYear(year);
  if (existing.length > 0) {
    return existing;
  }

  // Generate biweeks for the year
  // Biweek 02 starts at the end of December of the previous year
  const biweeksToInsert: InsertBiweek[] = [];
  
  // Start date: last Monday of December of previous year (approximately Dec 29)
  let startDate = new Date(year - 1, 11, 29); // Dec 29 of previous year
  
  for (let biweekNum = 2; biweekNum <= 52; biweekNum += 2) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 13); // 14 days total (0-13)
    
    biweeksToInsert.push({
      year,
      biweekNumber: biweekNum,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    
    // Move to next biweek
    startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() + 1);
  }

  await db.insert(biweeks).values(biweeksToInsert);
  return await getBiweeksByYear(year);
}

// ============ RESERVATION FUNCTIONS ============

export async function createReservation(reservation: InsertReservation, biweekIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reservations).values(reservation);
  const reservationId = result[0].insertId;

  // Create reservation biweeks
  const reservationBiweeksToInsert: InsertReservationBiweek[] = biweekIds.map(biweekId => ({
    reservationId,
    biweekId,
    outdoorId: reservation.outdoorId,
    status: "pending" as const,
  }));

  await db.insert(reservationBiweeks).values(reservationBiweeksToInsert);
  
  return reservationId;
}

export async function getReservationsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const userReservations = await db.select().from(reservations).where(eq(reservations.userId, userId)).orderBy(desc(reservations.createdAt));
  
  // Get biweek numbers for each reservation
  const reservationsWithBiweeks = await Promise.all(
    userReservations.map(async (reservation) => {
      const biweekLinks = await db.select().from(reservationBiweeks).where(eq(reservationBiweeks.reservationId, reservation.id));
      const biweekIds = biweekLinks.map(link => link.biweekId);
      
      // Get biweek numbers from IDs
      let biweekNumbers: number[] = [];
      if (biweekIds.length > 0) {
        const biweeksData = await db.select().from(biweeks).where(inArray(biweeks.id, biweekIds));
        biweekNumbers = biweeksData.map(b => b.biweekNumber);
      }
      
      return {
        ...reservation,
        biweekNumbers,
      };
    })
  );
  
  return reservationsWithBiweeks;
}

export async function getAllReservations() {
  const db = await getDb();
  if (!db) return [];
  
  const allReservations = await db.select().from(reservations).orderBy(desc(reservations.createdAt));
  
  // Get biweek IDs for each reservation
  const reservationsWithBiweeks = await Promise.all(
    allReservations.map(async (reservation) => {
      const biweekLinks = await db.select().from(reservationBiweeks).where(eq(reservationBiweeks.reservationId, reservation.id));
      const biweekIds = biweekLinks.map(link => link.biweekId);
      return {
        ...reservation,
        biweekIds: JSON.stringify(biweekIds),
      };
    })
  );
  
  return reservationsWithBiweeks;
}

export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reservations).where(eq(reservations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateReservationStatus(id: number, status: "pending" | "approved" | "denied" | "cancelled") {
  const db = await getDb();
  if (!db) return;
  
  await db.update(reservations).set({ status }).where(eq(reservations.id, id));
  
  // Update biweek statuses accordingly
  if (status === "approved") {
    await db.update(reservationBiweeks)
      .set({ status: "blocked" })
      .where(eq(reservationBiweeks.reservationId, id));
  } else if (status === "denied" || status === "cancelled") {
    await db.update(reservationBiweeks)
      .set({ status: "available" })
      .where(eq(reservationBiweeks.reservationId, id));
  }
}

export async function getReservationBiweeks(reservationId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reservationBiweeks).where(eq(reservationBiweeks.reservationId, reservationId));
}

export async function getBiweekStatusForOutdoor(outdoorId: number, year: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all biweeks for the year with their reservation status
  const yearBiweeks = await getBiweeksByYear(year);
  const reservedBiweeks = await db.select()
    .from(reservationBiweeks)
    .where(eq(reservationBiweeks.outdoorId, outdoorId));
  
  return yearBiweeks.map(biweek => {
    const reserved = reservedBiweeks.find(rb => rb.biweekId === biweek.id);
    return {
      ...biweek,
      reservationStatus: reserved?.status || "available",
    };
  });
}

// ============ FAVORITES FUNCTIONS ============

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(favorites).where(eq(favorites.userId, userId));
}

export async function addFavorite(userId: number, outdoorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already favorited
  const existing = await db.select().from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.outdoorId, outdoorId)))
    .limit(1);
  
  if (existing.length > 0) return existing[0].id;
  
  const result = await db.insert(favorites).values({ userId, outdoorId });
  return result[0].insertId;
}

export async function removeFavorite(userId: number, outdoorId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.outdoorId, outdoorId)));
}

export async function isFavorite(userId: number, outdoorId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.outdoorId, outdoorId)))
    .limit(1);
  return result.length > 0;
}

// ============ CART FUNCTIONS ============

export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(item: InsertCartItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cartItems).values(item);
  return result[0].insertId;
}

export async function updateCartItem(id: number, item: Partial<InsertCartItem>) {
  const db = await getDb();
  if (!db) return;
  await db.update(cartItems).set(item).where(eq(cartItems.id, id));
}

export async function removeFromCart(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// ============ STATS FUNCTIONS ============

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { 
    pendingReservations: 0, 
    activeOutdoors: 0, 
    totalUsers: 0,
    monthlyRevenue: 0,
    activeClients: 0,
    pendingOver24h: [],
    recentReservations: []
  };
  
  // Reservas pendentes
  const pendingResult = await db.select({ count: sql<number>`count(*)` })
    .from(reservations)
    .where(eq(reservations.status, "pending"));
  
  // Outdoors ativos
  const outdoorsResult = await db.select({ count: sql<number>`count(*)` })
    .from(outdoors)
    .where(eq(outdoors.isActive, true));
  
  // Total de usuários
  const usersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
  
  // Faturamento mensal (reservas aprovadas no mês atual)
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenueResult = await db.select({ total: sql<number>`COALESCE(SUM(totalValue), 0)` })
    .from(reservations)
    .where(
      and(
        eq(reservations.status, "approved"),
        gte(reservations.createdAt, firstDayOfMonth)
      )
    );
  
  // Clientes ativos (usuários com pelo menos uma reserva)
  const activeClientsResult = await db.select({ count: sql<number>`COUNT(DISTINCT userId)` })
    .from(reservations);
  
  // Reservas pendentes há mais de 24 horas
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const pendingOver24hResult = await db.select({
    id: reservations.id,
    totalValue: reservations.totalValue,
    createdAt: reservations.createdAt,
    userId: reservations.userId,
    userName: users.name,
    userEmail: users.email,
    userPhone: users.phone,
  })
    .from(reservations)
    .leftJoin(users, eq(reservations.userId, users.id))
    .where(
      and(
        eq(reservations.status, "pending"),
        lte(reservations.createdAt, twentyFourHoursAgo)
      )
    )
    .orderBy(reservations.createdAt);
  
  // Reservas recentes (últimas 10)
  const recentReservationsResult = await db.select({
    id: reservations.id,
    totalValue: reservations.totalValue,
    status: reservations.status,
    createdAt: reservations.createdAt,
    userId: reservations.userId,
    userName: users.name,
    userEmail: users.email,
    userPhone: users.phone,
  })
    .from(reservations)
    .leftJoin(users, eq(reservations.userId, users.id))
    .orderBy(desc(reservations.createdAt))
    .limit(10);
  
  return {
    pendingReservations: Number(pendingResult[0]?.count || 0),
    activeOutdoors: Number(outdoorsResult[0]?.count || 0),
    totalUsers: Number(usersResult[0]?.count || 0),
    monthlyRevenue: Number(monthlyRevenueResult[0]?.total || 0),
    activeClients: Number(activeClientsResult[0]?.count || 0),
    pendingOver24h: pendingOver24hResult,
    recentReservations: recentReservationsResult,
  };
}


// ============ RESERVATION MANAGEMENT FUNCTIONS ============

export async function getReservationDetails(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Get reservation with user and outdoor info
  const result = await db.select({
    id: reservations.id,
    userId: reservations.userId,
    outdoorId: reservations.outdoorId,
    status: reservations.status,
    includePaperGlue: reservations.includePaperGlue,
    includeCanvasInstall: reservations.includeCanvasInstall,
    totalValue: reservations.totalValue,
    saleNumber: reservations.saleNumber,
    artStatus: reservations.artStatus,
    adminNotes: reservations.adminNotes,
    clientNotes: reservations.clientNotes,
    scheduledInstallDate: reservations.scheduledInstallDate,
    approvedAt: reservations.approvedAt,
    approvedBy: reservations.approvedBy,
    createdAt: reservations.createdAt,
    updatedAt: reservations.updatedAt,
    userName: users.name,
    userEmail: users.email,
    userPhone: users.phone,
    userCompany: users.company,
    outdoorCode: outdoors.code,
    outdoorStreet: outdoors.street,
    outdoorNumber: outdoors.number,
    outdoorNeighborhood: outdoors.neighborhood,
    outdoorCity: outdoors.city,
    outdoorState: outdoors.state,
    outdoorPhotoUrl: outdoors.photoUrl,
    outdoorWidth: outdoors.width,
    outdoorHeight: outdoors.height,
    outdoorPricePerBiweek: outdoors.pricePerBiweek,
  })
    .from(reservations)
    .leftJoin(users, eq(reservations.userId, users.id))
    .leftJoin(outdoors, eq(reservations.outdoorId, outdoors.id))
    .where(eq(reservations.id, id))
    .limit(1);
  
  if (result.length === 0) return null;
  
  // Get biweeks for this reservation
  const biweekLinks = await db.select({
    biweekId: reservationBiweeks.biweekId,
    biweekNumber: biweeks.biweekNumber,
    startDate: biweeks.startDate,
    endDate: biweeks.endDate,
    year: biweeks.year,
  })
    .from(reservationBiweeks)
    .leftJoin(biweeks, eq(reservationBiweeks.biweekId, biweeks.id))
    .where(eq(reservationBiweeks.reservationId, id));
  
  // Get arts for this reservation
  const arts = await db.select()
    .from(reservationArts)
    .where(eq(reservationArts.reservationId, id))
    .orderBy(desc(reservationArts.createdAt));
  
  return {
    ...result[0],
    biweeks: biweekLinks,
    arts,
  };
}

export async function updateReservationProduction(id: number, data: {
  saleNumber?: string | null;
  artStatus?: "waiting" | "received" | "approved" | "in_production";
  adminNotes?: string | null;
  clientNotes?: string | null;
  scheduledInstallDate?: string | null;
}) {
  const db = await getDb();
  if (!db) return;
  
  const updateData: Record<string, unknown> = {};
  if (data.saleNumber !== undefined) updateData.saleNumber = data.saleNumber;
  if (data.artStatus !== undefined) updateData.artStatus = data.artStatus;
  if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;
  if (data.clientNotes !== undefined) updateData.clientNotes = data.clientNotes;
  if (data.scheduledInstallDate !== undefined) {
    updateData.scheduledInstallDate = data.scheduledInstallDate ? new Date(data.scheduledInstallDate) : null;
  }
  
  await db.update(reservations).set(updateData).where(eq(reservations.id, id));
}

export async function approveReservationWithSaleNumber(id: number, saleNumber: string, adminId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(reservations).set({ 
    status: "approved",
    saleNumber,
    approvedAt: new Date(),
    approvedBy: adminId,
  }).where(eq(reservations.id, id));
  
  // Update biweek statuses to blocked
  await db.update(reservationBiweeks)
    .set({ status: "blocked" })
    .where(eq(reservationBiweeks.reservationId, id));
}

// ============ RESERVATION ARTS FUNCTIONS ============

export async function getReservationArts(reservationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(reservationArts)
    .where(eq(reservationArts.reservationId, reservationId))
    .orderBy(desc(reservationArts.createdAt));
}

export async function addReservationArt(art: InsertReservationArt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get current max version for this reservation
  const existing = await db.select({ maxVersion: sql<number>`MAX(version)` })
    .from(reservationArts)
    .where(eq(reservationArts.reservationId, art.reservationId));
  
  const nextVersion = (existing[0]?.maxVersion || 0) + 1;
  
  // Set all previous arts as inactive
  await db.update(reservationArts)
    .set({ isActive: false })
    .where(eq(reservationArts.reservationId, art.reservationId));
  
  // Insert new art
  const result = await db.insert(reservationArts).values({
    ...art,
    version: nextVersion,
    isActive: true,
  });
  
  // Update reservation art status to received
  await db.update(reservations)
    .set({ artStatus: "received" })
    .where(eq(reservations.id, art.reservationId));
  
  return result[0].insertId;
}

export async function deleteReservationArt(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(reservationArts).where(eq(reservationArts.id, id));
}

// ============ CLIENT HISTORY FUNCTIONS ============

export async function getClientDetails(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Get user info
  const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (userResult.length === 0) return null;
  
  // Get all reservations for this user with outdoor info
  const userReservations = await db.select({
    id: reservations.id,
    outdoorId: reservations.outdoorId,
    status: reservations.status,
    includePaperGlue: reservations.includePaperGlue,
    includeCanvasInstall: reservations.includeCanvasInstall,
    totalValue: reservations.totalValue,
    saleNumber: reservations.saleNumber,
    artStatus: reservations.artStatus,
    createdAt: reservations.createdAt,
    outdoorCode: outdoors.code,
    outdoorCity: outdoors.city,
  })
    .from(reservations)
    .leftJoin(outdoors, eq(reservations.outdoorId, outdoors.id))
    .where(eq(reservations.userId, userId))
    .orderBy(desc(reservations.createdAt));
  
  // Calculate stats
  const totalReservations = userReservations.length;
  const approvedReservations = userReservations.filter(r => r.status === "approved").length;
  const pendingReservations = userReservations.filter(r => r.status === "pending").length;
  const totalSpent = userReservations
    .filter(r => r.status === "approved")
    .reduce((sum, r) => sum + Number(r.totalValue || 0), 0);
  
  return {
    user: userResult[0],
    reservations: userReservations,
    stats: {
      totalReservations,
      approvedReservations,
      pendingReservations,
      totalSpent,
    },
  };
}

export async function getReservationsWithFilters(filters: {
  userId?: number;
  status?: string;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select({
    id: reservations.id,
    userId: reservations.userId,
    outdoorId: reservations.outdoorId,
    status: reservations.status,
    includePaperGlue: reservations.includePaperGlue,
    includeCanvasInstall: reservations.includeCanvasInstall,
    totalValue: reservations.totalValue,
    saleNumber: reservations.saleNumber,
    artStatus: reservations.artStatus,
    createdAt: reservations.createdAt,
    userName: users.name,
    userEmail: users.email,
    userPhone: users.phone,
    userCompany: users.company,
    outdoorCode: outdoors.code,
    outdoorCity: outdoors.city,
  })
    .from(reservations)
    .leftJoin(users, eq(reservations.userId, users.id))
    .leftJoin(outdoors, eq(reservations.outdoorId, outdoors.id))
    .orderBy(desc(reservations.createdAt));
  
  const conditions = [];
  
  if (filters.userId) {
    conditions.push(eq(reservations.userId, filters.userId));
  }
  
  if (filters.status && filters.status !== "all") {
    conditions.push(eq(reservations.status, filters.status as "pending" | "approved" | "denied" | "cancelled"));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }
  
  const results = await query;
  
  // If search filter, apply it in memory (for name/email/code search)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    return results.filter(r => 
      r.userName?.toLowerCase().includes(searchLower) ||
      r.userEmail?.toLowerCase().includes(searchLower) ||
      r.outdoorCode?.toLowerCase().includes(searchLower) ||
      r.saleNumber?.toLowerCase().includes(searchLower)
    );
  }
  
  return results;
}
