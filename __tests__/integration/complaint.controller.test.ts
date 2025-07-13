import request from "supertest";
import express from "express";
import * as ComplaintController from "../../src/complaints/complaint.controller";
import * as ComplaintService from "../../src/complaints/complaint.service";

const app = express();
app.use(express.json());

app.post("/complaint", ComplaintController.createComplaintController as any);
app.get("/complaint_all", ComplaintController.getComplaintController as any); 
app.get("/complaint/:complaintId", ComplaintController.getComplaintByIdController as any);
app.put("/complaint/:complaintId", ComplaintController.updateComplaintController as any);
app.delete("/complaint/:complaintId", ComplaintController.deleteComplaintController as any);
jest.mock('../../src/Drizzle/db', () => ({
        client: {
        connect: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined), // Important to prevent open handle warning
        query: jest.fn(),
    },
}));

jest.mock("../../src/complaints/complaint.service");

describe("Complaint Controller", () => {
    afterEach(() => jest.clearAllMocks());

    describe("POST /complaint", () => {
        it("should create a new complaint", async () => {
            (ComplaintService.createComplaintService as jest.Mock).mockResolvedValue({ complaintId: 1 });
            const response = await request(app).post("/complaint").send({
                userId: 1,
                appointmentId: 1,
                subject: "Doctor Delay",
                description: "The doctor arrived 30 minutes late for the scheduled appointment.",
                status: "Open",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Complaint created successfully");
        });
        it("should return 400 if user not found", async () => {
            (ComplaintService.createComplaintService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).post("/complaint").send({
                userId: 1,
                appointmentId: 1,
                subject: "Doctor Delay",
                description: "The doctor arrived 30 minutes late for the scheduled appointment.",
                status: "Open",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message:"Failed to create complaint" });
        })
        it("should return 500 if an error occurs", async () => {
            (ComplaintService.createComplaintService as jest.Mock).mockRejectedValue(new Error("Failed to create complaint"));
            const response = await request(app).post("/complaint").send({
                userId: 1,
                appointmentId: 1,
                subject: "Doctor Delay",
                description: "The doctor arrived 30 minutes late for the scheduled appointment.",
                status: "Open",
                createdAt: new Date("2025-07-08T00:00:00.000Z"),
                updatedAt: new Date("2025-07-08T00:00:00.000Z")
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to create complaint" });
        })
    });

    describe("GET /complaint_all", () => {
        it("should return all complaints", async () => {
            (ComplaintService.getComplaintService as jest.Mock).mockResolvedValue([]);
            const response = await request(app).get("/complaint_all");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it("should return 500 if an error occurs", async () => {
            (ComplaintService.getComplaintService as jest.Mock).mockRejectedValue(new Error("Failed to get complaints"));
            const response = await request(app).get("/complaint_all");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to get complaints" });
        });
    })

    describe("GET /complaint/:complaintId", () => {
        it("should return a complaint", async () => {
            (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue({ complaintId: 1 });
            const response = await request(app).get("/complaint/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ complaintId: 1 });
        });
        it("should return 400 if user not found", async () => {
            (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).get("/complaint/abc");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Invalid complaint id" });
        });
        it("should return 404 if complaint not found", async () => {
            (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).get("/complaint/999");
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Complaint not found" });
        });
        it("should return 500 if an error occurs", async () => {
            (ComplaintService.getComplaintByIdService as jest.Mock).mockRejectedValue(new Error("Failed to get complaint"));
            const response = await request(app).get("/complaint/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to get complaint" });
        });
    });

    describe("PUT /complaint/:complaintId", () => {
        it("should update a complaint and return success message", async () => {
            (ComplaintService.updateComplaintService as jest.Mock).mockResolvedValue(true);
            const response = await request(app).put("/complaint/1").send({
                status: "Resolved"
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Complaint updated successfully");
        })
        it("should return 400 for invalid ID", async () => {
            (ComplaintService.updateComplaintService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).put("/complaint/abc")
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid complaint id");
        });
        it("should return 404 if complaint is not found", async () => {
            (ComplaintService.updateComplaintService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).put("/complaint/999")
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Complaint not found");
        });
        it("should return 500 if an error occurs", async () => {
            (ComplaintService.updateComplaintService as jest.Mock).mockRejectedValue(new Error("Failed to update complaint"));
            const response = await request(app).put("/complaint/1").send({
                status: "Resolved"
            });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Failed to update complaint" });
        });
    })

    describe("DELETE /complaint/:complaintId", () => {
        it("should delete a complaint", async () => {
            (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue({ complaintId: 1 });
            (ComplaintService.deleteComplaintService as jest.Mock).mockResolvedValue(true);
            const response = await request(app).delete("/complaint/1");
            expect(response.status).toBe(204);
        });
        it("should return 400 for invalid ID", async () => {
            (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue({ complaintId: 1 });
            (ComplaintService.deleteComplaintService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/complaint/abc");
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid complaint id");
        });
        it("should return 404 if complaint is not found", async () => {
            (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue(null);
            (ComplaintService.deleteComplaintService as jest.Mock).mockResolvedValue(null);
            const response = await request(app).delete("/complaint/999");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Complaint not found");
        })
        it("should return 500 if an error occurs", async () => {
            (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue({ complaintId: 1 });
            (ComplaintService.deleteComplaintService as jest.Mock).mockRejectedValue(new Error("Failed to delete complaint"));
            const response = await request(app).delete("/complaint/1");
            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Failed to delete complaint");
        });
    })
})