import db from "../../src/drizzle/db";
import { TransactionTable } from "../../src/drizzle/schema";
import { createTransactionService, getTransactionService, getTransactionByIdService, updateTransactionService, deleteTransactionService } from "../../src/transaction/transaction.service";
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        TransactionTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('cretaeTransactionService', () => {
    it('should create a new transaction', async () => {
        const transaction = {
            userId: 1,
            transactionName: "consultation fee",
            amount: 150.00,
            status: true,
    }
    const insertedTransacton = { transactionId: 1, ...transaction };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedTransacton])
        })
    })
    const result = await createTransactionService(transaction);
    expect(db.insert).toHaveBeenCalledWith(TransactionTable);
    expect(result).toEqual(insertedTransacton);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const transaction = {
            userId: 1,
            transactionName: "consultation fee",
            amount: 150.00,
            status: true,
    }
        const result = await createTransactionService(transaction);
        expect(result).toBeNull();
    })
})

describe("getTransactionService", () => {
    it("should return all transactions", async () => {
        (db.query.TransactionTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getTransactionService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no transactions found", async () => {
        (db.query.TransactionTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getTransactionService();
        expect(result).toEqual([]);
    })
})

describe("getTransactionByIdService", () => {
    it("should return transaction with given id", async () => {
        const transaction = {
            transactionId: 1,
            userId: 1,
            transactionName: "consultation fee",
            amount: 150.00,
            status: true,
    };
        (db.query.TransactionTable.findFirst as jest.Mock).mockReturnValueOnce(transaction);
        const result = await getTransactionByIdService(1)
        expect(db.query.TransactionTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(transaction);
    })
    it('should return null if transaction not found', async () => {
        (db.query.TransactionTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getTransactionByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updateTransactionByIdService", () => {
    it("should update a transaction and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValueOnce(null)
            })
        })
        const result = await updateTransactionService(1, {
            userId: 1,
            transactionName: "consultation fee",
            amount: "150.00",
            status: true,
    });
        expect(db.update).toHaveBeenCalledWith(TransactionTable);
        expect(result).toBe(null);
    })
})

describe("deleteTransactionByIdService", () => {
    it("should delete a transaction and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValueOnce(1)
        })
        const result = await deleteTransactionService(1);
        expect(db.delete).toHaveBeenCalledWith(TransactionTable);
        expect(result).toBe(1);
    })
})