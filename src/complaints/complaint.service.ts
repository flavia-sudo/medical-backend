import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { ComplaintTable, TIComplaint } from "../drizzle/schema";

export const createComplaintService = async (complaint: TIComplaint) => {
    const [ inserted ] = await db.insert(ComplaintTable).values(complaint).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

export const getComplaintService = async () => {
    const complaints = await db.query.ComplaintTable.findMany();
    return complaints;
}

export const getComplaintByIdService = async (Id: number) => {
    const complaint = await db.query.ComplaintTable.findFirst({
        where: eq(ComplaintTable.complaintId, Id)
    });
    return complaint;
}

export const updateComplaintService = async (Id: number, complaint: TIComplaint) => {
    const updated = await db.update(ComplaintTable).set(complaint).where(eq(ComplaintTable.complaintId, Id)).returning();
    return updated;
}

export const deleteComplaintService = async (Id: number) => {
    const deleted = await db.delete(ComplaintTable).where(eq(ComplaintTable.complaintId, Id)).returning();
    return deleted;
}

export const getComplaintByUserIdService = async (userId: number) => {
    const complaints = await db.query.ComplaintTable.findMany({
        where: eq(ComplaintTable.userId, userId)
    });
    return complaints;
}

