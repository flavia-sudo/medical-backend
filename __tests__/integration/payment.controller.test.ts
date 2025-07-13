import request from "supertest";
import express from "express";
import * as PaymentController from "../../src/payment/payment.controller";
import * as PaymentService from "../../src/payment/payment.service";

const app = express();
app.use(express.json());

app.post("/payment", PaymentController.createPaymentController as any);
app.get("/payment_all", PaymentController.getPaymentController as any);
app.get("/payment/:paymentId", PaymentController.getPaymentByIdController as any);
app.put("/payment/:paymentId", PaymentController.updatePaymentController as any);
app.delete("/payment/:paymentId", PaymentController.deletePaymentController as any);
jest.mock('../../src/Drizzle/db', () => ({
        client: {
        connect: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
        query: jest.fn(),
    },
}));

jest.mock("../../src/payment/payment.service");

describe("Payment Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /payment", () => {
        it("should create a new payment", async () => {
            (PaymentService.createPaymentService as jest.Mock).mockResolvedValue({ paymentId: 1 });
            const response = await request(app).post("/payment").send({
                appointmentId: 1,
                amount: "300.00",
                status: false,
                transactionId: 1,
                paymentDate: "2025-07-08",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Payment created successfully");
        });
        it("should return 400 if appointment not found", async () => {
            (PaymentService.createPaymentService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/payment").send({
                appointmentId: 1,
                amount: "300.00",
                status: false,
                transactionId: 1,
                paymentDate: "2025-07-08",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message:"Failed to create payment" });
        })
        it("should return 500 if an error occurs", async () => {
            (PaymentService.createPaymentService as jest.Mock).mockRejectedValue(new Error("Failed to create payment"));
            const response = await request(app).post("/payment").send({
                appointmentId: 1,
                amount: "300.00",
                status: false,
                transactionId: 1,
                paymentDate: "2025-07-08",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create payment" });
        });
    })

    describe("GET /payment_all", () => {
        it("should return all payments", async () => {
            (PaymentService.getPaymentService as jest.Mock).mockResolvedValue([]);
            const response = await request(app).get("/payment_all");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it("should return 500 if an error occurs", async () => {
            (PaymentService.getPaymentService as jest.Mock).mockRejectedValue(new Error("Failed to get payments"));
            const response = await request(app).get("/payment_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to get payments" });
        });
    })

    describe("GET /payment/:paymentId", () => {
        it("should return payment", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue({ paymentId: 1 });
            const response = await request(app).get("/payment/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ paymentId: 1 });
        });
        it("should return 400 invalid payment id", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).get("/payment/abc");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid payment id" });
        });
        it("should return 404 if payment not found", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).get("/payment/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Payment not found" });
        });
        it("should return 500 if an error occurs", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockRejectedValue(new Error("Failed to get payment"));
            const response = await request(app).get("/payment/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to get payment" });
        });
    })

    describe("PUT /payment/:paymentId", () => {
        it("should update a payment", async () => {
            (PaymentService.updatePaymentService as jest.Mock).mockResolvedValue({ paymentId: 1 });
            const response = await request(app).put("/payment/1").send({
                status: true,
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Payment updated successfully");
        });
        it("should return 400 for invalid ID", async () => {
            (PaymentService.updatePaymentService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).put("/payment/abc")
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid payment id");
        });
        it("should return 404 if payment not found", async () => {
            (PaymentService.updatePaymentService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).put("/payment/999").send({
                status: true,
            });
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Payment not found");
        });
        it("should return 500 if an error occurs", async () => {
            (PaymentService.updatePaymentService as jest.Mock).mockRejectedValue(new Error("Failed to update payment"));
            const response = await request(app).put("/payment/1").send({
                status: true,
            });
            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Failed to update payment");
        });
    })

    describe("DELETE /payment/:paymentId", () => {
        it("should delete a payment", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue({ paymentId: 1 });
            (PaymentService.deletePaymentService as jest.Mock).mockResolvedValue(true);
            const response = await request(app).delete("/payment/1");
            expect(response.status).toBe(204);
        });
        it("should return 400 for invalid ID", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);
            (PaymentService.deletePaymentService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/payment/abc");
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid payment id");
        });
        it("should return 404 if payment not found", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);
            (PaymentService.deletePaymentService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/payment/999");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Payment not found");
        });
        it("should return 500 if an error occurs", async () => {
            (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue({ paymentId: 1 });
            (PaymentService.deletePaymentService as jest.Mock).mockRejectedValue(new Error("Failed to delete payment"));
            const response = await request(app).delete("/payment/1");
            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Failed to delete payment");
        });
    })
})