import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import bcrypt from "bcryptjs";

process.env.JWT_SECRET = "test-secret";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

const mockFindUserByEmail =
  jest.fn<(email: string) => Promise<AuthUser | null>>();
const mockCreateUser =
  jest.fn<
    (name: string, email: string, password: string) => Promise<AuthUser>
  >();

jest.unstable_mockModule("../repositories/auth.repository.js", () => ({
  findUserByEmail: mockFindUserByEmail,
  createUser: mockCreateUser,
}));

const { register, login } = await import("../services/auth.service.js");

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should throw error if email already exists", async () => {
      mockFindUserByEmail.mockResolvedValue({
        id: 1,
        name: "Thinh",
        email: "thinh@test.com",
        password: "hashed",
        createdAt: new Date(),
      });

      await expect(
        register("Thinh", "thinh@test.com", "123456"),
      ).rejects.toThrow("Email already exists");
    });
  });

  describe("login", () => {
    it("should return token if credentials are valid", async () => {
      const hashed = await bcrypt.hash("123456", 10);

      mockFindUserByEmail.mockResolvedValue({
        id: 1,
        name: "Thinh",
        email: "thinh@test.com",
        password: hashed,
        createdAt: new Date(),
      });

      const result = await login("thinh@test.com", "123456");

      expect(result).toHaveProperty("token");
    });
  });
});
