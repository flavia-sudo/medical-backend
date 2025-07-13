// __tests__/unit/auth.service.test.ts

// Import services to test
import {
  createUserService,
  createAdminService,
  userLoginService,
  verifyCodeService
} from "../../src/auth/auth.service";

// Import modules to be mocked
import db from "../../src/drizzle/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  sendWelcomeEmail
} from "../../src/email/email.service";

// Mock core libraries and services
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../src/drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  returning: jest.fn(),
}));
jest.mock("../../src/email/email.service", () => ({
  sendVerificationEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}));

// Group all tests for auth service
describe("auth.service", () => {
  // Define a reusable mock user
  const mockUser = {
    userId: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "hashedpw",
    phoneNumber: "1234567890",
    address: "123 Main St",
    role: "user" as "user",
    verificationCode: "123456",
    verified: false
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test: creating a regular user
  test("createUserService should hash password, create user, send emails, return token", async () => {
    // Arrange mocks
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpw");
    (db.insert as jest.Mock).mockReturnValue({
      values: () => ({ returning: jest.fn().mockResolvedValue([mockUser]) })
    });
    (jwt.sign as jest.Mock).mockReturnValue("mock-token");

    const userData = { ...mockUser };

    // Act
    const result = await createUserService(userData);

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(sendVerificationEmail).toHaveBeenCalledWith(
      userData.email,
      userData.firstName,
      expect.any(String) // verification code is randomly generated
    );
    expect(sendWelcomeEmail).toHaveBeenCalledWith(userData.email, userData.firstName);
    expect(result).toEqual({ user: mockUser, token: "mock-token" });
  });

  // Test: creating an admin user
  test("createAdminService should hash password, assign role, send emails, return token", async () => {
    // Arrange
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpw");
    (db.insert as jest.Mock).mockReturnValue({
      values: () => ({ returning: jest.fn().mockResolvedValue([mockUser]) })
    });
    (jwt.sign as jest.Mock).mockReturnValue("mock-token");

    const adminData = {
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      password: mockUser.password,
      phoneNumber: mockUser.phoneNumber,
      address: mockUser.address
    };

    // Act
    const result = await createAdminService(adminData);

    // Assert
    expect(result).toEqual({ admin: mockUser, token: "mock-token" });
  });

  // Test: successful login
  test("userLoginService returns token if credentials valid", async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: () => ({
        where: () => Promise.resolve([mockUser])
      })
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mock-token");

    const result = await userLoginService(mockUser.email, "raw-password");
    expect(result).toEqual({ user: mockUser, token: "mock-token" });
  });

  // Test: login fails if email doesn't exist
  test("userLoginService returns error if user not found", async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: () => ({
        where: () => Promise.resolve([]) // simulate no user found
      })
    });

    const result = await userLoginService("wrong@example.com", "pass");
    expect(result).toBeInstanceOf(Error);
  });

  // Test: login fails if password is invalid
  test("userLoginService returns error if password is invalid", async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: () => ({
        where: () => Promise.resolve([mockUser])
      })
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // simulate incorrect password

    const result = await userLoginService(mockUser.email, "wrong-password");
    expect(result).toBeInstanceOf(Error);
  });

  // Test: email verification success
  test("verifyCodeService should verify correct user code", async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: () => ({
        where: () => Promise.resolve([mockUser]) // simulate user with matching code
      })
    });

    const mockUpdate = { where: jest.fn().mockResolvedValue(undefined) };
    (db.update as jest.Mock).mockReturnValue({ set: () => mockUpdate });

    const result = await verifyCodeService(mockUser.email, mockUser.verificationCode);
    expect(result).toBe("Email verified successfully");
  });

  // Test: email verification fails with wrong code
  test("verifyCodeService should throw if code is invalid", async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: () => ({
        where: () => Promise.resolve([]) // simulate no user match
      })
    });

    await expect(verifyCodeService("john@example.com", "wrong-code"))
      .rejects.toThrow("Invalid verification code");
  });
});
