import express from "express";
import { 
    registerUserController as register,
    loginUserController as login, 
    verifyCodeController as verify,
    createAdminController as registerAdmin
 } from "../../src/auth/auth.controller";
import request from "supertest";
import * as AuthService from "../../src/auth/auth.service";
import e from "express";

const app = express ();
app.use(express.json());
app.post('/auth/register', register as any);
app.post('/auth/admin/create', registerAdmin as any);
app.post('/auth/login', login as any);
app.post('/auth/verify', verify as any);

// Mock the authService
jest.mock("../../src/auth/auth.service");

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
});

jest.spyOn(console, "error").mockImplementation(() => {});

describe("Auth controller - integration tests", () => {
    const mockUser = {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        phoneNumber: "1234567890",
        address: "123 Main St",
        role: "user",
        verificationCode: "123456",
        verified: false
    };

    const mockToken = "mock.jwt.token";

    test("POST /auth/register should register a user and return token", async () => {
        (AuthService.createUserService as jest.Mock).mockResolvedValue({
            user: { ...mockUser, verificationCode: "123456" },
            token: mockToken,
        });

        const response = await request(app).post("/auth/register").send({
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            password: mockUser.password,
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "User created successfully",
            user: expect.objectContaining({ email: mockUser.email }),
            token: mockToken,
        });
    });

    // testing if error occurred
    test("POST /auth/register should return 500 if an error occurs", async () => {
        (AuthService.createUserService as jest.Mock).mockRejectedValue(new Error("Failed to create user"));
        const response = await request(app).post("/auth/register").send({
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            password: mockUser.password,
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to create user" });
    });

// login
    test("POST /auth/login should return a token", async () => {
        (AuthService.userLoginService as jest.Mock).mockResolvedValue({
            user: mockUser,
            token: mockToken,
        });
        const response = await request(app).post("/auth/login").send({
            email: mockUser.email,
            password: mockUser.password,
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Login successful",
            user: expect.objectContaining({ email: mockUser.email }),
            token: mockToken,
        });
    });

    test("POST /auth/login should return 400 if email or password is missing", async () => {
        // missing email
        let response = await request(app).post("/auth/login").send({
            password: mockUser.password,
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Missing email or password" });

        // missing password
        response = await request(app).post("/auth/login").send({
            email: mockUser.email,
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Missing email or password" });

        // missing both
        response = await request(app).post("/auth/login").send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Missing email or password" });
    });

    // testing if an error occurred
    test("POST /auth/login should return 500 if an error occurs", async () => {
        (AuthService.userLoginService as jest.Mock).mockRejectedValue(new Error("Failed to login user"));
        const response = await request(app).post("/auth/login").send({
            email: mockUser.email,
            password: mockUser.password,
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to login user" });
    });

// verify
    test("POST /auth/verify should verify a user", async () => {
        (AuthService.verifyCodeService as jest.Mock).mockResolvedValue({
            message: "Account verified successfully",
        });
        const response = await request(app).post("/auth/verify").send({
            email: mockUser.email,
            code: mockUser.verificationCode,
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            "message": "Account verified successfully",
        });
    });

    // testing if an error occurred
    test("POST /auth/verify should return 500 if an error occurs", async () => {
        if ((AuthService.verifyCodeService as jest.Mock).mockRejectedValue(new Error("Failed to verify user"))) {
        const response = await request(app).post("/auth/verify").send({
            email: mockUser.email,
            code: mockUser.verificationCode,
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to verify user" });
    }
    });

    // create admin
    test("POST /auth/admin/create should create an admin and return token", async () => {
        const mockAdmin = {
            userId: 1,
            firstName: "Flavia",
            lastName: "Kihahu",
            email: "flkihahu@example",
            password: "12345678",
            role: "admin"
        };
        const mockToken = "mock.jwt.token";

        (AuthService.createAdminService as jest.Mock).mockResolvedValue({
            admin: mockAdmin,
            token: mockToken,
        });

        const response = await request(app).post("/auth/admin/create").send({
            firstName: "Flavia",
            lastName: "Kihahu",
            email: "flkihahu@example",
            password: "12345678",
            role: "admin"
        });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Admin created successfully",
            admin: {
                userId: mockAdmin.userId,
                firstName: mockAdmin.firstName,
                lastName: mockAdmin.lastName,
                email: mockAdmin.email,
                role: mockAdmin.role,
            },
            token: mockToken,
        });
    });

    // test input validation
    test("POST /auth/admin/create should return 400 if required fields are missing", async () => {
        const response = await request(app).post("/auth/admin/create").send({
            email: "flkihahu@gmail.com",
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Missing required admin fields" });
    });

    // test error handling
    test("POST /auth/admin/create should return 500 if an error occurs", async () => {
        (AuthService.createAdminService as jest.Mock).mockRejectedValue(new Error("Failed to create admin"));
        const response = await request(app).post("/auth/admin/create").send({
            firstName: "Flavia",
            lastName: "Kihahu",
            email: "flkihahu@example",
            password: "12345678",
            role: "admin"
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to create admin" });
    })
})