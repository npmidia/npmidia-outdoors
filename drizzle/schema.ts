import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  cpfCnpj: varchar("cpfCnpj", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Outdoors table - stores all billboard information
 */
export const outdoors = mysqlTable("outdoors", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  street: varchar("street", { length: 255 }),
  number: varchar("number", { length: 20 }),
  neighborhood: varchar("neighborhood", { length: 100 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zipCode", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  width: decimal("width", { precision: 5, scale: 2 }),
  height: decimal("height", { precision: 5, scale: 2 }),
  pricePerBiweek: decimal("pricePerBiweek", { precision: 10, scale: 2 }).notNull(),
  hasLighting: boolean("hasLighting").default(false).notNull(),
  activationDate: date("activationDate"),
  isActive: boolean("isActive").default(true).notNull(),
  photoUrl: text("photoUrl"),
  photoUrl2: text("photoUrl2"),
  photoUrl3: text("photoUrl3"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Outdoor = typeof outdoors.$inferSelect;
export type InsertOutdoor = typeof outdoors.$inferInsert;

/**
 * Bi-weeks table - stores the bi-weekly periods for each year
 */
export const biweeks = mysqlTable("biweeks", {
  id: int("id").autoincrement().primaryKey(),
  year: int("year").notNull(),
  biweekNumber: int("biweekNumber").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
});

export type Biweek = typeof biweeks.$inferSelect;
export type InsertBiweek = typeof biweeks.$inferInsert;

/**
 * Reservations table - stores all booking requests
 */
export const reservations = mysqlTable("reservations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  outdoorId: int("outdoorId").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "denied", "cancelled"]).default("pending").notNull(),
  includePaperGlue: boolean("includePaperGlue").default(false).notNull(),
  includeCanvasInstall: boolean("includeCanvasInstall").default(false).notNull(),
  totalValue: decimal("totalValue", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;

/**
 * Reservation bi-weeks - links reservations to specific bi-weeks
 */
export const reservationBiweeks = mysqlTable("reservation_biweeks", {
  id: int("id").autoincrement().primaryKey(),
  reservationId: int("reservationId").notNull(),
  biweekId: int("biweekId").notNull(),
  outdoorId: int("outdoorId").notNull(),
  status: mysqlEnum("status", ["pending", "blocked", "available"]).default("pending").notNull(),
});

export type ReservationBiweek = typeof reservationBiweeks.$inferSelect;
export type InsertReservationBiweek = typeof reservationBiweeks.$inferInsert;

/**
 * Favorites table - stores user's favorite outdoors
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  outdoorId: int("outdoorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Cart items table - stores items in user's shopping cart
 */
export const cartItems = mysqlTable("cart_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  outdoorId: int("outdoorId").notNull(),
  biweekIds: text("biweekIds").notNull(),
  includePaperGlue: boolean("includePaperGlue").default(false).notNull(),
  includeCanvasInstall: boolean("includeCanvasInstall").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
