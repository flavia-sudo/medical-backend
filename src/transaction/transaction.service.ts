import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TransactionTable, TITransaction } from "../drizzle/schema";

export const createTransactionService = async (transaction: TITransaction) => {
    const [ inserted ] = await db.insert(TransactionTable).values(transaction).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get transactions
export const getTransactionService = async () => {
    const transactions = await db.query.TransactionTable.findMany();
    return transactions;
}

//get transaction by id
export const getTransactionByIdService = async (Id: number) => {
    const transaction = await db.query.TransactionTable.findFirst({
        where: eq(TransactionTable.transactionId, Id)
    });
    return transaction;
}

//update transaction by id
export const updateTransactionService = async (Id: number, transaction: TITransaction) => {
    const updated = await db.update(TransactionTable).set(transaction).where(eq(TransactionTable.transactionId, Id)).returning();
    return updated;
}

//delete transaction by id
export const deleteTransactionService = async (Id: number) => {
    const deleted = await db.delete(TransactionTable).where(eq(TransactionTable.transactionId, Id)).returning();
    return deleted;
}