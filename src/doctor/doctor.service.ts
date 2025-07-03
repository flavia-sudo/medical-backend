import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { DoctorTable, TIDoctor } from "../drizzle/schema";

export const createDoctorService = async (doctor: TIDoctor) => {
    const [ inserted ] = await db.insert(DoctorTable).values(doctor).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

//get doctors
export const getDoctorsService = async () => {
    const doctors = await db.query.DoctorTable.findMany();
    return doctors;
}

//get doctor by id
export const getDoctorByIdService = async (Id: number) => {
    const doctor = await db.query.DoctorTable.findFirst({
        where: eq(DoctorTable.doctorId, Id)
    });
    return doctor;
}

// update doctor by id
export const updateDoctorService = async (Id: number, doctor: TIDoctor) => {
    const updated = await db.update(DoctorTable).set(doctor).where(eq(DoctorTable.doctorId, Id)).returning();
    return updated;
}

// delete doctor by id
export const deleteDoctorService = async (Id: number) => {
    const deleted = await db.delete(DoctorTable).where(eq(DoctorTable.doctorId, Id)).returning();
    return deleted;
}