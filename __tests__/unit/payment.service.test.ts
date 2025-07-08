import db from "../../src/drizzle/db";
import { PaymentTable } from "../../src/drizzle/schema";
import { createPaymentService, getPaymentService, getPaymentByIdService, updatePaymentService, deletePaymentService } from '../../src/payment/payment.service'
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        PaymentTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createPaymentService', () => {
    it('should create a new payment', async () => {
        const payment = {
            appointmentId: 1,
            amount: "300.00",
            status: false,
            transactionId: 1,
            paymentDate: "2025-07-08",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    }
    const insertedPayment = { paymentId: 1, ...payment };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedPayment])
        })
    })
    const result = await createPaymentService(payment);
    expect(db.insert).toHaveBeenCalledWith(PaymentTable);
    expect(result).toEqual(insertedPayment);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const payment = {
            appointmentId: 1,
            amount: "300.00",
            status: false,
            transactionId: 1,
            paymentDate: "2025-07-08",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    }
        const result = await createPaymentService(payment);
        expect(result).toBeNull();
    })
})

describe("getPaymentService", () => {
    it("should return all Payments", async () => {
        (db.query.PaymentTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getPaymentService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no Payments found", async () => {
        (db.query.PaymentTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getPaymentService();
        expect(result).toEqual([]);
    })
})

describe("getPaymentByIdService", () => {
    it("should return payment with given id", async () => {
        const payment = {
            appointmentId: 1,
            amount: "300.00",
            status: false,
            transactionId: 1,
            paymentDate: "2025-07-08",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    };
        (db.query.PaymentTable.findFirst as jest.Mock).mockReturnValueOnce(payment);
        const result = await getPaymentByIdService(1)
        expect(db.query.PaymentTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(payment);
    })
    it('should return null if payment not found', async () => {
        (db.query.PaymentTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getPaymentByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updatePaymentByIdService", () => {
    it("should update a payment and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ paymentId: 1 }])
                })
            })
        })
        const result = await updatePaymentService(1, {
            appointmentId: 1,
            amount: "300.00",
            status: false,
            transactionId: 1,
            paymentDate: "2025-07-08",
            createdAt: new Date("2025-07-08T00:00:00.000Z"),
            updatedAt: new Date("2025-07-08T00:00:00.000Z")
    });
        expect(db.update).toHaveBeenCalledWith(PaymentTable);
        expect(result).toEqual([{ paymentId: 1 }]);
    })
})

describe("deletePaymentByIdService", () => {
    it("should delete a payment and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ paymentId: 1 }])
            })
        })
        const result = await deletePaymentService(1);
        expect(db.delete).toHaveBeenCalledWith(PaymentTable);
        expect(result).toEqual([{ paymentId: 1 }]);
    })
})