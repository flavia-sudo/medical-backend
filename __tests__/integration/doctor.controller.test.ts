import request from "supertest";
import express from "express";
import * as DoctorController from "../../src/doctor/doctor.controller";
import * as DoctorService from "../../src/doctor/doctor.service";

const app = express();
app.use(express.json());

app.post("/doctor", DoctorController.createDoctorController as any);
app.get("/doctor_all", DoctorController.getDoctorsController as any);
app.get("/doctor/:doctorId", DoctorController.getDoctorByIdController as any);
app.put("/doctor/:doctorId", DoctorController.updateDoctorByIdController as any);
app.delete("/doctor/:doctorId", DoctorController.deleteDoctorController as any);
jest.mock('../../src/Drizzle/db', () => ({
        client: {
        connect: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
        query: jest.fn(),
    },
}));

jest.mock("../../src/doctor/doctor.service");

describe("Doctor Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /doctor", () => {
        it("should create a new doctor", async () => {
            (DoctorService.createDoctorService as jest.Mock).mockResolvedValue({ doctorId: 1 });
            const response = await request(app).post("/doctor").send({
                userId: 1,
                firstName: "Jane",
                lastName: "Smith",
                specialization: "Psychiatrist",
                contactPhone: '0711223344',
                availableDays: "Weekdays",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Doctor created successfully");
        });
        it("should return 400 if user not found", async () => {
            (DoctorService.createDoctorService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/doctor").send({
                userId: 1,
                firstName: "Jane",
                lastName: "Smith",
                specialization: "Psychiatrist",
                contactPhone: '0711223344',
                availableDays: "Weekdays",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message:"Failed to create doctor" });
        })
        it("should return 500 if an error occurs", async () => {
            (DoctorService.createDoctorService as jest.Mock).mockRejectedValue(new Error("Failed to create doctor"));
            const response = await request(app).post("/doctor").send({
                userId: 1,
                firstName: "Jane",
                lastName: "Smith",
                specialization: "Psychiatrist",
                contactPhone: '0711223344',
                availableDays: "Weekdays",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create doctor" });
        })
    });

    describe("GET /doctor_all", () => {
        it("should return all doctors", async () => {
            (DoctorService.getDoctorsService as jest.Mock).mockResolvedValue([]);
            const response = await request(app).get("/doctor_all");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it("should return 500 if an error occurs", async () => {
            (DoctorService.getDoctorsService as jest.Mock).mockRejectedValue(new Error("Failed to get doctors"));
            const response = await request(app).get("/doctor_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to get doctors" });
        });
    })

    describe("GET /doctor/:doctorId", () => {
        it("should return a doctor by id", async () => {
            (DoctorService.getDoctorByIdService as jest.Mock).mockResolvedValue({ doctorId: 1 });
            const response = await request(app).get("/doctor/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ doctorId: 1 });
        });
        it("should return 400 if invalid doctor id", async () => {
            (DoctorService.getDoctorByIdService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).get("/doctor/abc");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid doctor id" });
        });
        it("should return 404 if doctor not found", async () => {
          (DoctorService.getDoctorByIdService as jest.Mock).mockResolvedValue(null);
          const response = await request(app).get("/doctor/999");
          expect(response.status).toBe(404);
          expect(response.body).toEqual({ error: "Doctor not found" });  
        })
        it("should return 500 if an error occurs", async () => {
            (DoctorService.getDoctorByIdService as jest.Mock).mockRejectedValue(new Error("Failed to get doctor"));
            const response = await request(app).get("/doctor/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to get doctor" });
        });
    })

    describe("PUT /doctor/:doctorId", () => {
        it("should update a doctor by id", async () => {
            (DoctorService.updateDoctorService as jest.Mock).mockResolvedValue({ doctorId: 1 });
            const response = await request(app).put("/doctor/1").send({
                specialization: "Pediatrician",
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Doctor updated successfully");
        });
        it("should return 400 if invalid doctor id", async () => {
            (DoctorService.updateDoctorService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).put("/doctor/abc").send({
                specialization: "Pediatrician",
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid doctor id" });
        });
        it("should return 404 if doctor not found", async () => {
          (DoctorService.updateDoctorService as jest.Mock).mockResolvedValue(null);
          const response = await request(app).put("/doctor/999").send({
            specialization: "Pediatrician",
          });
          expect(response.status).toBe(404);
          expect(response.body).toEqual({ error: "Doctor not found" });  
        })
        it("should return 500 if an error occurs", async () => {
            (DoctorService.updateDoctorService as jest.Mock).mockRejectedValue(new Error("Failed to update doctor"));
            const response = await request(app).put("/doctor/1").send({
                specialization: "Pediatrician",
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update doctor" });
        });
    })

    describe("DELETE /doctor/:doctorId", () => {
        it("should delete a doctor", async () => {
            (DoctorService.getDoctorByIdService as jest.Mock).mockResolvedValue({ doctorId: 1 });
            (DoctorService.deleteDoctorService as jest.Mock).mockResolvedValue(true);
            const response = await request(app).delete("/doctor/1");
            expect(response.status).toBe(204);
        });
        it("should return 400 if invalid doctor id", async () => {
            (DoctorService.getDoctorByIdService as jest.Mock).mockResolvedValue({ doctorId: 1 });
            (DoctorService.deleteDoctorService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/doctor/abc");
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid doctor id");
        });
        it("should return 404 if doctor not found", async () => {
          (DoctorService.getDoctorByIdService as jest.Mock).mockResolvedValue(null);
          (DoctorService.deleteDoctorService as jest.Mock).mockResolvedValue(null);
          const response = await request(app).delete("/doctor/999");
          expect(response.status).toBe(404);
          expect(response.body.error).toBe("Doctor not found");  
        })
        it("should return 500 if an error occurs", async () => {
            (DoctorService.getDoctorByIdService as jest.Mock).mockResolvedValue({ doctorId: 1 });
            (DoctorService.deleteDoctorService as jest.Mock).mockRejectedValue(new Error("Failed to delete doctor"));
            const response = await request(app).delete("/doctor/1");
            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Failed to delete doctor");
        });
    })
})