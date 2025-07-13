import request from "supertest";
import express from "express";
import * as PrescriptionController from "../../src/prescription/prescription.controller";
import * as PrescriptionService from "../../src/prescription/prescription.service";

const app = express();
app.use(express.json());

app.post("/prescription", PrescriptionController.createPrescriptionController as any);
app.get("/prescription_all", PrescriptionController.getPrescriptionController as any);
app.get("/prescription/:prescriptionId", PrescriptionController.getPrescriptionByIdController as any);
app.put("/prescription/:prescriptionId", PrescriptionController.updatePrescriptionController as any);
app.delete("/prescription/:prescriptionId", PrescriptionController.deletePrescriptionController as any);
jest.mock('../../src/Drizzle/db', () => ({
        client: {
        connect: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
        query: jest.fn(),
    },
}));

jest.mock("../../src/prescription/prescription.service");

describe("Prescription Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe ("POST /prescription", () => {
        it("should create a prescription", async () => {
            (PrescriptionService.createPrescriptionService as jest.Mock).mockResolvedValueOnce({ prescriptionId: 1 });

            const response = await request(app).post("/prescription").send({
                appointmentId: 1,
                doctorId: 1,
                patientId: 1,
                notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Prescription created successfully");
        });
        it("should return 400 if appointment not found", async () => {
            (PrescriptionService.createPrescriptionService as jest.Mock).mockResolvedValueOnce(null);
            const response = await request(app).post("/prescription").send({
                appointmentId: 1,
                doctorId: 1,
                patientId: 1,
                notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message:"Failed to create prescription" });
        })
        it("should return 500 if an error occurs", async () => {
            (PrescriptionService.createPrescriptionService as jest.Mock).mockRejectedValueOnce(new Error("Failed to create prescription"));
            const response = await request(app).post("/prescription").send({
                appointmentId: 1,
                doctorId: 1,
                patientId: 1,
                notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create prescription" });
        });
    });

    describe("GET /prescription_all", () => {
        it("should return all prescriptions", async () => {
            (PrescriptionService.getPrescriptionService as jest.Mock).mockResolvedValue([]);
            const response = await request(app).get("/prescription_all");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it("should return 500 if an error occurs", async () => {
            (PrescriptionService.getPrescriptionService as jest.Mock).mockRejectedValue(new Error("Failed to get prescriptions"));
            const response = await request(app).get("/prescription_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to get prescriptions" });
        });
    });

    describe("GET /prescription/:prescriptionId", () => {
        it("should return a prescription", async () => {
            (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue({ prescriptionId: 1 });
            const response = await request(app).get("/prescription/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ prescriptionId: 1 });
        });
        it("should return 400 if prescription not found", async () => {
            (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).get("/prescription/abc");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid prescription id" });
        });
        it("should return 404 if prescription not found", async () => {
            (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).get("/prescription/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Prescription not found" });
        });
        it("should return 500 if an error occurs", async () => {
            (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockRejectedValue(new Error("Failed to get prescription"));
            const response = await request(app).get("/prescription/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to get prescription" });
        });
    });

    describe("PUT /prescription/:prescriptionId", () => {
        it("should update a prescription", async () => {
            (PrescriptionService.updatePrescriptionService as jest.Mock).mockResolvedValue(true);
            const response = await request(app).put("/prescription/1").send({
                patientId: 2,
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Prescription updated successfully");
        });
        it("should return 400 if prescription not found", async () => {
            (PrescriptionService.updatePrescriptionService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).put("/prescription/abc").send({
                patientId: 2,
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid prescription id" });
        });
        it("should return 404 if prescription not found", async () => {
            (PrescriptionService.updatePrescriptionService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).put("/prescription/999").send({
                patientId: 2,
            });
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Prescription not found" });
        });
        it("should return 500 if an error occurs", async () => {
            (PrescriptionService.updatePrescriptionService as jest.Mock).mockRejectedValue(new Error("Failed to update prescription"));
            const response = await request(app).put("/prescription/1").send({
                patientId: 2,
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update prescription" });
        });
    });

    describe("DELETE /prescription/:prescriptionId", () => {
        it("should delete a prescription", async () => {
            (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue({ prescriptionId: 1 });
            (PrescriptionService.deletePrescriptionService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/prescription/1");
            expect(response.status).toBe(204);
        });
        it("should return 400 if prescription not found", async () => {
            (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue({ prescriptionId: 1 });
            (PrescriptionService.deletePrescriptionService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/prescription/abc");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid prescription id" });
        });
        it("should return 404 if prescription not found", async () => {
            (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue(null);
            (PrescriptionService.deletePrescriptionService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/prescription/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Prescription not found" });
        });
        it("should return 500 if an error occurs", async () => {
            (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue({ prescriptionId: 1 });
            (PrescriptionService.deletePrescriptionService as jest.Mock).mockRejectedValue(new Error("Failed to delete prescription"));
            const response = await request(app).delete("/prescription/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to delete prescription" });
        });
    });
})