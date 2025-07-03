import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { PaymentTable, TIPayment } from "../drizzle/schema";

export const createPaymentService = async (payment: TIPayment) => {
    const [ inserted ] = await db.insert(PaymentTable).values(payment).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get payments
export const getPaymentService = async () => {
    const payments = await db.query.PaymentTable.findMany();
    return payments;
}

//get payment by id
export const getPaymentByIdService = async (Id: number) => {
    const payment = await db.query.PaymentTable.findFirst({
        where: eq(PaymentTable.paymentId, Id)
    });
    return payment;
}

//update payment by id
export const updatePaymentService = async (Id: number, payment: TIPayment) => {
    const updated = await db.update(PaymentTable).set(payment).where(eq(PaymentTable.paymentId, Id)).returning();
    return updated;
}

//delete payment by id
export const deletePaymentService = async (Id: number) => {
    const deleted = await db.delete(PaymentTable).where(eq(PaymentTable.paymentId, Id)).returning();
    return deleted;
}