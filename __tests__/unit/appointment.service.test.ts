import db from "../../src/drizzle/db";
import { AppointmentTable } from "../../src/drizzle/schema";
import { createAppointmentService, getAppointmentService, getAppointmentByIdService, updateAppointmentService, deleteAppointmentService } from '../../src/appointment/appointment.service'
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        AppointmentTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createAppointmentService', () => {
    it('should create a new appointment', async () => {
        const appointment = {
            userId: 3,
            doctorId: 2,
            appointmentDate: "2024-02-02",
            time: new Date("2024-02-02 11:00:00"),
            totalAmount: "300.00",
            status: "confirmed" as "confirmed",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    }
    const insertedAppointment = { appointmentId: 1, ...appointment };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedAppointment])
        })
    })
    const result = await createAppointmentService(appointment);
    expect(db.insert).toHaveBeenCalledWith(AppointmentTable);
    expect(result).toEqual(insertedAppointment);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const appointment = {
            userId: 3,
            doctorId: 2,
            appointmentDate: "2024-02-02",
            time: new Date("2024-02-02 11:00:00"),
            totalAmount: "300.00",
            status: "confirmed" as "confirmed",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    }
        const result = await createAppointmentService(appointment);
        expect(result).toBeNull();
    })
})

describe("getAppointmentService", () => {
    it("should return all Appointments", async () => {
        (db.query.AppointmentTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAppointmentService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no Appointments found", async () => {
        (db.query.AppointmentTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAppointmentService();
        expect(result).toEqual([]);
    })
})

describe("getAppointmentByIdService", () => {
    it("should return appointment with given id", async () => {
        const appointment = {
            userId: 3,
            doctorId: 2,
            appointmentDate: "2024-02-02",
            time: new Date("2024-02-02 11:00:00"),
            totalAmount: "300.00",
            status: "confirmed" as "confirmed",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    };
        (db.query.AppointmentTable.findFirst as jest.Mock).mockReturnValueOnce(appointment);
        const result = await getAppointmentByIdService(1)
        expect(db.query.AppointmentTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(appointment);
    })
    it('should return null if appointment not found', async () => {
        (db.query.AppointmentTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getAppointmentByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updateAppointmentByIdService", () => {
    it("should update an appointment and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ appointmentId: 1 }])
                })
            })
        })
        const result = await updateAppointmentService(1, {
            userId: 3,
            doctorId: 2,
            appointmentDate: "2024-02-02",
            time: new Date("2024-02-02 11:00:00"),
            totalAmount: "300.00",
            status: "confirmed" as "confirmed",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    });
        expect(db.update).toHaveBeenCalledWith(AppointmentTable);
        expect(result).toEqual([{ appointmentId: 1 }]);
    })
})

describe("deleteAppointmentByIdService", () => {
    it("should delete an appointment and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ appointmentId: 1 }])
            })
        })
        const result = await deleteAppointmentService(1);
        expect(db.delete).toHaveBeenCalledWith(AppointmentTable);
        expect(result).toEqual([{ appointmentId: 1 }]);
    })
})