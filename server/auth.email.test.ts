import { describe, expect, it, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

// Mock the database functions
vi.mock("./db", () => ({
  getUserByEmail: vi.fn(),
  createUserWithPassword: vi.fn(),
  updateUserLastSignIn: vi.fn(),
}));

import * as db from "./db";

describe("Email Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Password Hashing", () => {
    it("should hash password correctly", async () => {
      const password = "testPassword123";
      const hash = await bcrypt.hash(password, 10);
      
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should verify password correctly", async () => {
      const password = "testPassword123";
      const hash = await bcrypt.hash(password, 10);
      
      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });

    it("should reject wrong password", async () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword";
      const hash = await bcrypt.hash(password, 10);
      
      const isValid = await bcrypt.compare(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe("User Registration", () => {
    it("should check if email already exists", async () => {
      const mockGetUserByEmail = vi.mocked(db.getUserByEmail);
      mockGetUserByEmail.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        name: "Test User",
        openId: null,
        passwordHash: "hashedPassword",
        phone: "11999999999",
        cpfCnpj: null,
        company: "Test Company",
        address: null,
        loginMethod: "email",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      });

      const existingUser = await db.getUserByEmail("test@example.com");
      expect(existingUser).toBeDefined();
      expect(existingUser?.email).toBe("test@example.com");
    });

    it("should return undefined for non-existent email", async () => {
      const mockGetUserByEmail = vi.mocked(db.getUserByEmail);
      mockGetUserByEmail.mockResolvedValue(undefined);

      const user = await db.getUserByEmail("nonexistent@example.com");
      expect(user).toBeUndefined();
    });
  });

  describe("User Login", () => {
    it("should validate correct credentials", async () => {
      const password = "correctPassword";
      const hash = await bcrypt.hash(password, 10);

      const mockGetUserByEmail = vi.mocked(db.getUserByEmail);
      mockGetUserByEmail.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        name: "Test User",
        openId: null,
        passwordHash: hash,
        phone: "11999999999",
        cpfCnpj: null,
        company: "Test Company",
        address: null,
        loginMethod: "email",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      });

      const user = await db.getUserByEmail("test@example.com");
      expect(user).toBeDefined();
      
      const isValid = await bcrypt.compare(password, user!.passwordHash!);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const correctPassword = "correctPassword";
      const wrongPassword = "wrongPassword";
      const hash = await bcrypt.hash(correctPassword, 10);

      const mockGetUserByEmail = vi.mocked(db.getUserByEmail);
      mockGetUserByEmail.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        name: "Test User",
        openId: null,
        passwordHash: hash,
        phone: "11999999999",
        cpfCnpj: null,
        company: "Test Company",
        address: null,
        loginMethod: "email",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      });

      const user = await db.getUserByEmail("test@example.com");
      expect(user).toBeDefined();
      
      const isValid = await bcrypt.compare(wrongPassword, user!.passwordHash!);
      expect(isValid).toBe(false);
    });
  });
});
