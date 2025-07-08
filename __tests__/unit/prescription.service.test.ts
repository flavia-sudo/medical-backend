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
    it('should create a new Prescription', async () => {
        const prescription = {
            doctorId: 1,
            patientId: 1,
            notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
            createdAt: "2025-07-08T00:00:00.000Z",
            updatedAt: "2025-07-08T00:00:00.000Z"
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
            doctorId: 1,
            patientId: 1,
            notes: "The medicine name, 500mg, twice a day, 5 days, take after meals",
            createdAt: "2025-07-08T00:00:00.000Z",
            updatedAt: "2025-07-08T00:00:00.000Z"
        }
        const result = await createPrescriptionService(prescription);
        expect(result).toBeNull();
    })
})

describe("getPrescriptionService", () => {
    it("should return all prescriptions", async () => {
        (db.query.PrescriptionTable.findMany as jest.Mock).mockRejectedValueOnce([]);
        const result = await getPrescriptionService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no prescriptions found", async () => {
        (db.query.PrescriptionTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getPrescriptionService();
        expect(result).toEqual([]);
    })
})