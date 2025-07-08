import db from "../../src/drizzle/db";
import { DoctorTable } from "../../src/drizzle/schema";
import { createDoctorService, getDoctorsService, getDoctorByIdService, updateDoctorService, deleteDoctorService } from '../../src/doctor/doctor.service'
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        DoctorTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createDoctorService', () => {
    it('should create a new doctor', async () => {
        const doctor = {
            userId: 3,
            firstName: "Jane",
            lastName: "Smith",
            specialization: "Psychiatrist",
            contactPhone: '0711223344',
            availableDays: "Weekdays",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    }
    const insertedDoctor = { doctorId: 1, ...doctor };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedDoctor])
        })
    })
    const result = await createDoctorService(doctor);
    expect(db.insert).toHaveBeenCalledWith(DoctorTable);
    expect(result).toEqual(insertedDoctor);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const doctor = {
            userId: 3,
            firstName: "Jane",
            lastName: "Smith",
            specialization: "Psychiatrist",
            contactPhone: '0711223344',
            availableDays: "Weekdays",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    }
        const result = await createDoctorService(doctor);
        expect(result).toBeNull();
    })
})

describe("getDoctorService", () => {
    it("should return all Doctors", async () => {
        (db.query.DoctorTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getDoctorsService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no Doctors found", async () => {
        (db.query.DoctorTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getDoctorsService();
        expect(result).toEqual([]);
    })
})

describe("getPaymentByIdService", () => {
    it("should return payment with given id", async () => {
        const doctor = {
            userId: 3,
            firstName: "Jane",
            lastName: "Smith",
            specialization: "Psychiatrist",
            contactPhone: '0711223344',
            availableDays: "Weekdays",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    };
        (db.query.DoctorTable.findFirst as jest.Mock).mockReturnValueOnce(doctor);
        const result = await getDoctorByIdService(1)
        expect(db.query.DoctorTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(doctor);
    })
    it('should return null if doctor not found', async () => {
        (db.query.DoctorTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getDoctorByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updateDoctorByIdService", () => {
    it("should update a doctor and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ doctorId: 1 }])
                })
            })
        })
        const result = await updateDoctorService(1, {
            userId: 3,
            firstName: "Jane",
            lastName: "Smith",
            specialization: "Psychiatrist",
            contactPhone: '0711223344',
            availableDays: "Weekdays",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    });
        expect(db.update).toHaveBeenCalledWith(DoctorTable);
        expect(result).toEqual([{ doctorId: 1 }]);
    })
})

describe("deleteDoctorByIdService", () => {
    it("should delete a doctor and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ doctorId: 1 }])
            })
        })
        const result = await deleteDoctorService(1);
        expect(db.delete).toHaveBeenCalledWith(DoctorTable);
        expect(result).toEqual([{ doctorId: 1 }]);
    })
})