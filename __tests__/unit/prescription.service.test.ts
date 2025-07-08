import db from "../../src/drizzle/db";
import { createPrescriptionService, deletePrescriptionService, getPrescriptionByIdService, getPrescriptionService, updatePrescriptionService } from "../../src/prescription/prescription.service";
import { PrescriptionTable } from "../../src/drizzle/schema";

jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        PrescriptionTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createPrescriptionService', () => {
    it('should create a new Prescription', async () => {
        const prescription = {
            appointmentId: 1,
            doctorId: 1,
            patientId: 1,
            notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
        }
        const insertedPrescription = { prescriptionId: 1, ...prescription};
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([insertedPrescription])
            })
        });
        const result = await createPrescriptionService(prescription)
        expect(db.insert).toHaveBeenCalledWith(PrescriptionTable);
        expect(result).toEqual(insertedPrescription)
    })
})

describe("return null if insert fails", () => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const prescription = {
            appointmentId: 1,
            doctorId: 1,
            patientId: 1,
            notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
        }
        const result = await createPrescriptionService(prescription);
        expect(result).toBeNull();
    })
})

describe("getPrescriptionService", () => {
    it("should return all prescriptions", async () => {
        (db.query.PrescriptionTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getPrescriptionService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no prescriptions found", async () => {
        (db.query.PrescriptionTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getPrescriptionService();
        expect(result).toEqual([]);
    })
})

describe("getPrescriptionByIdService", () => {
    it("should return prescription with given id", async () => {
        const prescription = {
            prescriptionId: 1,
            doctorId: 1,
            patientId: 1,
            notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: "2025-07-08T00:00:00.000Z"
        };
        (db.query.PrescriptionTable.findFirst as jest.Mock).mockReturnValueOnce(prescription);
        const result = await getPrescriptionByIdService(1)
        expect(db.query.PrescriptionTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(prescription);
    })
    it('should return null if prescription not found', async () => {
        (db.query.PrescriptionTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getPrescriptionByIdService(9999);
        expect(result).toBeNull();
    })
})

describe('updatePrescriptionByIdService', () => {
    it("should update a prescription and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ prescriptionId: 1 }])
            })
        })
    })
    const result = await updatePrescriptionService(1, {
        doctorId: 1,
        appointmentId: 1,
        patientId: 1,
        notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
        createdAt: new Date("2025-07-08T00:00:00.000Z"),
        updatedAt: new Date("2025-07-08T00:00:00.000Z")
    });
        expect(db.update).toHaveBeenCalledWith(PrescriptionTable);
        expect(result).toEqual([{ prescriptionId: 1 }]);
    })
})

describe("deletePrescriptionByIdService", () => {
    it("should delete a prescription and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ prescriptionId: 1 }])
            })
        })
        const result = await deletePrescriptionService(1);
        expect(db.delete).toHaveBeenCalledWith(PrescriptionTable);
        expect(result).toEqual([{ prescriptionId: 1 }]);
    })
})