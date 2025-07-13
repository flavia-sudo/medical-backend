import request from "supertest";
import express from "express";
import * as AppointmentController from "../../src/appointment/appointment.controller";
import * as AppointmentService from "../../src/appointment/appointment.service";

const app = express();
app.use(express.json());

app.post("/appointment", AppointmentController.createAppointmentController as any);
app.get("/appointment_all", AppointmentController.getAppointmentController as any);
app.get("/appointment/:appointmentId", AppointmentController.getAppointmentByIdController as any);
app.put("/appointment/:appointmentId", AppointmentController.updateAppointmentController as any);
app.delete("/appointment/:appointmentId", AppointmentController.deleteAppointmentController as any);
jest.mock('../../src/Drizzle/db', () => ({
    client: {
    connect: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
    query: jest.fn(),
  },
}));

jest.mock("../../src/appointment/appointment.service");

describe("Appointment Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /appointment", () => {
      it("should create a new appointment", async () => {
        (AppointmentService.createAppointmentService as jest.Mock).mockResolvedValue({ appointmentId: 1 });
          
          const response = await request(app).post("/appointment").send({
            userId: 1,
            doctorId: 2,
            appointmentDate: "2025-07-10",
            time: "2024-02-02 11:00:00",
            totalAmount: "300.00",
            status: "confirmed",
            createdAt: "2025-07-08T00:00:00.000Z",
            updatedAt: "2025-07-08T00:00:00.000Z"
          });
          expect(response.status).toBe(201);
          expect(response.body.message).toBe("Appointment created successfully");
        });
        it("should return 400 if user not found", async () => {
          (AppointmentService.createAppointmentService as jest.Mock).mockResolvedValue(null);
          const response = await request(app).post("/appointment").send({
            userId: 1,
            doctorId: 2,
            appointmentDate: "2025-07-10",
            time: "2024-02-02 11:00:00",
            totalAmount: "300.00",
            status: "confirmed",
            createdAt: "2025-07-08T00:00:00.000Z",
            updatedAt: "2025-07-08T00:00:00.000Z"
          });
          expect(response.status).toBe(400);
          expect(response.body).toEqual({ message:"Failed to create appointment" });
        })
        it("should return 500 if an error occurs", async () => {
          (AppointmentService.createAppointmentService as jest.Mock).mockRejectedValue(new Error("Failed to create appointment"));
          const response = await request(app).post("/appointment").send({
            userId: 1,
            doctorId: 2,
            appointmentDate: "2025-07-10",
            time: "2024-02-02 11:00:00",
            totalAmount: "300.00",
            status: "confirmed",
            createdAt: "2025-07-08T00:00:00.000Z",
            updatedAt: "2025-07-08T00:00:00.000Z"
          });
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ error: "Failed to create appointment" });
        });
      });

      describe("GET /appointment_all", () => {
        it("should return all appointments", async () => {
          (AppointmentService.getAppointmentService as jest.Mock).mockResolvedValue([]);
          const response = await request(app).get("/appointment_all");
          expect(response.status).toBe(200);
          expect(response.body).toEqual([]);
        });
        it("should return 500 if an error occurs", async () => {
          (AppointmentService.getAppointmentService as jest.Mock).mockRejectedValue(new Error("Failed to get appointments"));
          const response = await request(app).get("/appointment_all");
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ error: "Failed to get appointments" });
        });
      });

      describe("GET /appointment/:appointmentId", () => {
        it("should return an appointment", async () => {
          (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue({ appointmentId: 1 });
          const response = await request(app).get("/appointment/1");
          expect(response.status).toBe(200);
          expect(response.body).toEqual({ appointmentId: 1 });
        });
        it("should return 400 if invalid appointment id", async () => {
          (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue(null);
          const response = await request(app).get("/appointment/abc");
          expect(response.status).toBe(400);
          expect(response.body).toEqual({ error: "Invalid appointment id" });
        });
        it("should return 404 if appointment not found", async () => {
          (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue(null);
          const response = await request(app).get("/appointment/999");
          expect(response.status).toBe(404);
          expect(response.body).toEqual({ error: "Appointment not found" });
        })
        it("should return 500 if an error occurs", async () => {
          (AppointmentService.getAppointmentByIdService as jest.Mock).mockRejectedValue(new Error("Failed to get appointment"));
          const response = await request(app).get("/appointment/1");
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ error: "Failed to get appointment" });
        });
      });

      describe("PUT /appointment/:appointmentId", () => {
        it("should update a appointment", async () => {
          (AppointmentService.updateAppointmentService as jest.Mock).mockResolvedValue(true);
          const response = await request(app)
            .put("/appointment/1")
            .send({
              appointmentDate: "2025-07-11",
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Appointment updated successfully");
        });
        it("should return 400 for invalid ID", async () => {
          (AppointmentService.updateAppointmentService as jest.Mock).mockResolvedValue(null);
          const response = await request(app)
            .put("/appointment/abc")
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid appointment id");
        });
        it("should return 404 if appointment is not found", async () => {
          (AppointmentService.updateAppointmentService as jest.Mock).mockResolvedValue(null);
          const response = await request(app)
            .put("/appointment/999")
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Appointment not found");
        });
        it("should return 500 if an error occurs", async () => {
          (AppointmentService.updateAppointmentService as jest.Mock).mockRejectedValue(new Error("Failed to update appointment"));
          const response = await request(app)
            .put("/appointment/1")
            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Failed to update appointment");
        })
      });

      describe("DELETE /appointment/:appointmentId", () => {
        it("should delete a appointment", async () => {
          (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue({ appointmentId: 1 });
          (AppointmentService.deleteAppointmentService as jest.Mock).mockResolvedValue(true);
          const response = await request(app).delete("/appointment/1");
          expect(response.status).toBe(204);
        });
        it("should return 400 for invalid ID", async () => {
          (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue({ appointmentId: 1 });
          (AppointmentService.deleteAppointmentService as jest.Mock).mockResolvedValue(null);
          const response = await request(app).delete("/appointment/abc");
          expect(response.status).toBe(400);
          expect(response.body.error).toBe("Invalid appointment id");
        });
        it("should return 404 if appointment is not found", async () => {
          (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue(null);
          (AppointmentService.deleteAppointmentService as jest.Mock).mockResolvedValue(null);
          const response = await request(app).delete("/appointment/999");
          expect(response.status).toBe(404);
          expect(response.body.error).toBe("Appointment not found");
        });
        it("should return 500 if an error occurs", async () => {
          (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue({ appointmentId: 1 });
          (AppointmentService.deleteAppointmentService as jest.Mock).mockRejectedValue(new Error("Failed to delete appointment"));
          const response = await request(app).delete("/appointment/1");
          expect(response.status).toBe(500);
          expect(response.body.error).toBe("Failed to delete appointment");
        });
      });
    })