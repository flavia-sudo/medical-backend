import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { PrescriptionTable, TIPrescription } from "../drizzle/schema";

export const createPrescriptionService = async (prescription: TIPrescription) => {
    const [ inserted ] = await db.insert(PrescriptionTable).values(prescription).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get prescriptions
export const getPrescriptionService = async () => {
    const prescriptions = await db.query.PrescriptionTable.findMany();
    return prescriptions;
}

//get prescription by id
export const getPrescriptionByIdService = async (Id: number) => {
    const prescription = await db.query.PrescriptionTable.findFirst({
        where: eq(PrescriptionTable.prescriptionId, Id)
    });
    return prescription;
}

//update prescription by id
export const updatePrescriptionService = async (Id: number, prescription: TIPrescription) => {
    const updated = await db.update(PrescriptionTable).set(prescription).where(eq(PrescriptionTable.prescriptionId, Id)).returning();
    return updated;
}

//delete prescription by id
export const deletePrescriptionService = async (Id: number) => {
    const deleted = await db.delete(PrescriptionTable).where(eq(PrescriptionTable.prescriptionId, Id)).returning();
    return deleted;
}