import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db functions
vi.mock("./db", () => ({
  getAllOutdoors: vi.fn().mockResolvedValue([
    {
      id: 1,
      code: "OUT-001",
      city: "São Paulo",
      neighborhood: "Centro",
      hasLighting: true,
      pricePerBiweek: "1500.00",
      isActive: true,
      photoUrl: null,
      width: "9.00",
      height: "3.00",
    },
    {
      id: 2,
      code: "OUT-002",
      city: "Rio de Janeiro",
      neighborhood: "Copacabana",
      hasLighting: false,
      pricePerBiweek: "2000.00",
      isActive: true,
      photoUrl: null,
      width: "12.00",
      height: "4.00",
    },
  ]),
  getOutdoorById: vi.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        code: "OUT-001",
        city: "São Paulo",
        neighborhood: "Centro",
        street: "Av. Paulista",
        number: "1000",
        state: "SP",
        hasLighting: true,
        pricePerBiweek: "1500.00",
        isActive: true,
        photoUrl: null,
        width: "9.00",
        height: "3.00",
        latitude: "-23.5505",
        longitude: "-46.6333",
      });
    }
    return Promise.resolve(null);
  }),
  createOutdoor: vi.fn().mockResolvedValue(3),
  updateOutdoor: vi.fn().mockResolvedValue(undefined),
  deleteOutdoor: vi.fn().mockResolvedValue(undefined),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "user-123",
    email: "user@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-123",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("outdoor.list", () => {
  it("returns list of outdoors for public users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.outdoor.list({ activeOnly: true });

    expect(result).toHaveLength(2);
    expect(result[0].code).toBe("OUT-001");
    expect(result[1].code).toBe("OUT-002");
  });
});

describe("outdoor.getById", () => {
  it("returns outdoor details by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.outdoor.getById({ id: 1 });

    expect(result).not.toBeNull();
    expect(result?.code).toBe("OUT-001");
    expect(result?.city).toBe("São Paulo");
  });

  it("returns null for non-existent outdoor", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.outdoor.getById({ id: 999 });

    expect(result).toBeNull();
  });
});

describe("outdoor.create", () => {
  it("allows admin to create outdoor", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.outdoor.create({
      code: "OUT-003",
      city: "Curitiba",
      pricePerBiweek: "1200.00",
      hasLighting: true,
      isActive: true,
    });

    expect(result.id).toBe(3);
  });

  it("denies non-admin users from creating outdoor", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.outdoor.create({
        code: "OUT-003",
        city: "Curitiba",
        pricePerBiweek: "1200.00",
      })
    ).rejects.toThrow("Admin access required");
  });
});

describe("outdoor.update", () => {
  it("allows admin to update outdoor", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.outdoor.update({
      id: 1,
      pricePerBiweek: "1800.00",
    });

    expect(result.success).toBe(true);
  });
});

describe("outdoor.delete", () => {
  it("allows admin to delete outdoor", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.outdoor.delete({ id: 1 });

    expect(result.success).toBe(true);
  });
});
