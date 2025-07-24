import { Request, Response } from "express";
import { 
    createAppointmentService,
    deleteAppointmentService,
    getAppointmentByIdService,
    getAppointmentService,
    updateAppointmentService,
    getAppointmentByUserIdService
} from "./appointment.service";

export const createAppointmentController = async(req: Request, res: Response) => {
    try {
        const appointment = req.body;
        //Convert time to Date object if provided
        if (appointment.time) {
            appointment.time = new Date(appointment.time);
        }
        if (appointment.createdAt) {
            appointment.createdAt = new Date(appointment.createdAt);
        }
        if (appointment.updatedAt) {
            appointment.updatedAt = new Date(appointment.updatedAt);
        }
        const newAppointment = await createAppointmentService(appointment);
        // console.log(appointment);
        if (newAppointment) {
            res.status(201).json({
                message: "Appointment created successfully",
                data: newAppointment
            });
        } else {
            res.status(400).json({
                message: "Failed to create appointment"
            });
        }
    } catch (error: any) {
        console.log(error); 
        return res.status(500).json({error: error.message})
    }
}

export const getAppointmentController = async (req: Request, res: Response) => {
    try {
        const appointments = await getAppointmentService();
        res.status(200).json(appointments);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

export const getAppointmentByIdController = async (req: Request, res: Response) => {
    try {
        const appointmentId = parseInt(req.params.appointmentId);
        if (isNaN(appointmentId)) {
            return res.status(400).json({error: "Invalid appointment id"});
        }
        const appointment = await getAppointmentByIdService(appointmentId);
        if (appointment) {
            res.status(200).json(appointment);
        } else {
            res.status(404).json({error: "Appointment not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

export const updateAppointmentController = async (req: Request, res: Response) => {
    try {
        const appointmentId = parseInt(req.params.appointmentId);
        if (isNaN(appointmentId)) {
            return res.status(400).json({error: "Invalid appointment id"});
        }
        const appointment = req.body;
        const updatedAppointment = await updateAppointmentService(appointmentId, appointment);
        if (updatedAppointment) {
            res.status(200).json({
                message: "Appointment updated successfully",
                data: updatedAppointment
            });
        } else {
            res.status(404).json({error: "Appointment not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

export const deleteAppointmentController = async (req: Request, res: Response) => {
    try {
        const appointmentId = parseInt(req.params.appointmentId);
        if (isNaN(appointmentId)) {
            return res.status(400).json({error: "Invalid appointment id"});
        }
        const existingAppointment = await getAppointmentByIdService(appointmentId);
        if (!existingAppointment) {
            return res.status(404).json({error: "Appointment not found"});
        }
        await deleteAppointmentService(appointmentId);
        return res.status(204).json({message: "Appointment deleted successfully"});
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

export const getAppointmentsByPatientIdController = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({error: "Invalid patient id"});
        }
        const appointments = await getAppointmentByUserIdService(userId);
        res.status(200).json(appointments);
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({error: error.message})
    }
}