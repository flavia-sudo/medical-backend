import request from "supertest";
import express from "express";
import * as UserService from "../../src/user/user.service";
import { createUserController, deleteUserController, getUserByIdController, getUsersController, updateUserByIdController } from "../../src/user/user.controller";
jest.mock("../../src/user/user.service");
jest.mock("../../src/email/email.service", () => ({
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
}));
import { sendWelcomeEmail } from "../../src/email/email.service";
import bcrypt from "bcryptjs";
jest.mock("bcryptjs");
(bcrypt.hash as jest.Mock) = jest.fn();

const app = express();
app.use(express.json());
app.post('/user', createUserController as any);
app.get('/user_all', getUsersController as any);
app.get('/user/:userId', getUserByIdController as any);
app.put('/user/:userId', updateUserByIdController as any);
app.delete('/user/:userId', deleteUserController as any);

describe("User Controller - integration tests", () => {
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

    test("POST /user should create a user", async () => {
        (UserService.createUserService as jest.Mock).mockResolvedValue(mockUser);
        const response = await request(app).post("/user").send(mockUser);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "User created successfully",
            data: mockUser
        });
        expect(sendWelcomeEmail).toHaveBeenCalledWith(mockUser.email, mockUser.firstName);
    });

    //Test if create user fails with 400
    test("POST /user should return 400 if user already exists", async () => {
        if ((UserService.createUserService as jest.Mock).mockResolvedValue(null)) {
        const response = await request(app).post("/user").send(mockUser);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Failed to create user" });
        }
    })

    // test should return 500 if an error occurs
    test("POST /user should return 500 if an error occurs", async () => {
        (UserService.createUserService as jest.Mock).mockRejectedValue(new Error("Failed to create user"));
        const response = await request(app).post("/user").send(mockUser);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to create user" });
    });

    // get all users
    test("GET /user_all should return all users", async () => {
        const mockUsers = [
            { userId: 1, firstName: "John", lastName: "Doe", email: "john@example.com" },
            { userId: 2, firstName: "Jane", lastName: "Doe", email: "jane@example.com" },
        ];
        (UserService.getUsersService as jest.Mock).mockResolvedValue(mockUsers);
        const response = await request(app).get("/user_all");
        expect(response.status).toBe(200);
        expect(response.body).toEqual( mockUsers );
    });

    //error 500
    test("GET /user_all should return 500 if an error occurs", async () => {
        (UserService.getUsersService as jest.Mock).mockRejectedValue(new Error("Failed to get users"));
        const response = await request(app).get("/user_all");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to get users" });
    });

    // get user by id
    test("GET /user/:userId should return a user", async () => {
        (UserService.getUserByIdService as jest.Mock).mockResolvedValue(mockUser);
        const response = await request(app).get("/user/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    // error 400
    test("GET /user/:userId should return 400 if user not found", async () => {
        const response = await request(app).get("/user/abc");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid user id" });
    });

    // error 404
    test("GET /user/:userId should return 404 if user not found", async () => {
        (UserService.getUserByIdService as jest.Mock).mockResolvedValue(null);
        const response = await request(app).get("/user/999");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "User not found" });
    });

    // error 500
    test("GET /user/:userId should return 500 if an error occurs", async () => {
        (UserService.getUserByIdService as jest.Mock).mockRejectedValue(new Error("Failed to get user"));
        const response = await request(app).get("/user/1");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to get user" });
    });

    // update
    test("PUT /user/:userId should update a user and hash password", async () => {
        const newPassword = "newpassword";
        const hashedPassword = "hashedPawword123";

         // Mock bcrypt.hash to return a predictable hash
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        (UserService.getUserByIdService as jest.Mock).mockResolvedValue({ ...mockUser, userId: 1 });
        (UserService.updateUserService as jest.Mock).mockImplementation(async (id, updatedUser) => {
            // Check that the password sent to the service is hashed
        expect(updatedUser.password).toBe(hashedPassword);
        return "token123";
    });
        const response = await request(app).put("/user/1").send({
            ...mockUser,
            password: bcrypt.hash(newPassword, 10),
        });
        expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User updated successfully");
        expect(response.body).toHaveProperty("token", response.body.token);
    });

    // error 400
    test("PUT /user/:userId should return 400 if user not found", async () => {
        const response = await request(app).put("/user/abc").send(mockUser);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid user id" });
    });

    // error 500
    test("PUT /user/:userId should return 500 if an error occurs", async () => {
        (UserService.getUserByIdService as jest.Mock).mockResolvedValue({ userId: 1 });
        (UserService.updateUserService as jest.Mock).mockRejectedValue(new Error("Failed to update user"));
        const response = await request(app).put("/user/1").send(mockUser);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to update user" });
    });

    // delete
    test("DELETE /user/:userId should delete a user", async () => {
        (UserService.deleteUserService as jest.Mock).mockResolvedValue(undefined);
        const response = await request(app).delete("/user/1");
        expect(response.status).toBe(204);
    });

    // error 400
    test("DELETE /user/:userId should return 400 if user not found", async () => {
        const response = await request(app).delete("/user/abc");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid user id" });
    });

    // error 404
    test("DELETE /user/:userId should return 404 if user not found", async () => {
        (UserService.getUserByIdService as jest.Mock).mockResolvedValue(null);
        const response = await request(app).delete("/user/999");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "User not found" });
    });

    // error 500
    test("DELETE /user/:userId should return 500 if an error occurs", async () => {
        (UserService.getUserByIdService as jest.Mock).mockResolvedValue({ userId: 1 });
        (UserService.deleteUserService as jest.Mock).mockRejectedValue(new Error("Failed to delete user"));
        const response = await request(app).delete("/user/1");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to delete user" });
    });
})