import e from "express";
import db from "../drizzle/db";
import { AppointmentTable, TIAppointment } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const createAppointmentService = async (appointment: TIAppointment) => {
    const [ inserted ] = await db.insert(AppointmentTable).values(appointment).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

// get appointments
export const getAppointmentService = async () => {
    const appointments = await db.query.AppointmentTable.findMany();
    return appointments;
}

//get appointment by id
export const getAppointmentByIdService = async (Id: number) => {
    const appointment = await db.query.AppointmentTable.findFirst({
        where: eq(AppointmentTable.appointmentId, Id)
    });
    return appointment;
}

//update appointment by id
export const updateAppointmentService = async (Id: number, appointment: TIAppointment) => {
    const updated = await db.update(AppointmentTable).set(appointment).where(eq(AppointmentTable.appointmentId, Id)).returning();
    return updated;
}

//delete appointment by id
export const deleteAppointmentService = async (Id: number) => {
    const deleted = await db.delete(AppointmentTable).where(eq(AppointmentTable.appointmentId, Id)).returning();
    return deleted;
}

//get appointment by user id
export const getAppointmentByUserIdService = async (userId: number) => {
    const appointments = await db.query.AppointmentTable.findMany({
        where: eq(AppointmentTable.userId, userId)
    });
    return appointments;
}