import db from "../../src/drizzle/db";
import { ComplaintTable } from "../../src/drizzle/schema";
import { createComplaintService, getComplaintService, getComplaintByIdService, updateComplaintService, deleteComplaintService } from '../../src/complaints/complaint.service'
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        ComplaintTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createComplaintService', () => {
    it('should create a new complaint', async () => {
        const complaint = {
            userId: 3,
            appointmentId: 1,
            subject: "Doctor Delay",
            description: "The doctor arrived 30 minutes late for the scheduled appointment.",
            status: "Open" as "Open",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    }
    const insertedComplaint = { complaintId: 1, ...complaint };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedComplaint])
        })
    })
    const result = await createComplaintService(complaint);
    expect(db.insert).toHaveBeenCalledWith(ComplaintTable);
    expect(result).toEqual(insertedComplaint);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const complaint = {
            userId: 3,
            appointmentId: 1,
            subject: "Doctor Delay",
            description: "The doctor arrived 30 minutes late for the scheduled appointment.",
            status: "Open" as "Open",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    }
        const result = await createComplaintService(complaint);
        expect(result).toBeNull();
    })
})

describe("getComplaintService", () => {
    it("should return all Complaints", async () => {
        (db.query.ComplaintTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getComplaintService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no Complaints found", async () => {
        (db.query.ComplaintTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getComplaintService();
        expect(result).toEqual([]);
    })
})

describe("getComplaintByIdService", () => {
    it("should return complaint with given id", async () => {
        const complaint = {
            userId: 3,
            appointmentId: 1,
            subject: "Doctor Delay",
            description: "The doctor arrived 30 minutes late for the scheduled appointment.",
            status: "Open" as "Open",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    };
        (db.query.ComplaintTable.findFirst as jest.Mock).mockReturnValueOnce(complaint);
        const result = await getComplaintByIdService(1)
        expect(db.query.ComplaintTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(complaint);
    })
    it('should return null if complaint not found', async () => {
        (db.query.ComplaintTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getComplaintByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updateComplaintByIdService", () => {
    it("should update a complaint and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ complaintId: 1 }])
                })
            })
        })
        const result = await updateComplaintService(1, {
            userId: 3,
            appointmentId: 1,
            subject: "Doctor Delay",
            description: "The doctor arrived 30 minutes late for the scheduled appointment.",
            status: "Open",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    });
        expect(db.update).toHaveBeenCalledWith(ComplaintTable);
        expect(result).toEqual([{ complaintId: 1 }]);
    })
})

describe("deleteComplaintByIdService", () => {
    it("should delete a complaint and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ complaintId: 1 }])
            })
        })
        const result = await deleteComplaintService(1);
        expect(db.delete).toHaveBeenCalledWith(ComplaintTable);
        expect(result).toEqual([{ complaintId: 1 }]);
    })
})