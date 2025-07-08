import { Request, Response } from "express";
import { createDoctorService, deleteDoctorService, getDoctorByIdService, getDoctorsService, updateDoctorService } from "./doctor.service";
export const createDoctorController = async (req: Request, res: Response) => {
    try {
        const doctor = req.body;
        if (doctor.createdAt) {
            doctor.createdAt = new Date(doctor.createdAt);
        }
        if (doctor.updatedAt) {
            doctor.updatedAt = new Date(doctor.updatedAt);
        }
        const newDoctor = await createDoctorService(doctor);
        if (newDoctor) {
            res.status(201).json({
                message: "Doctor created successfully",
                data: newDoctor
            });
        } else {
            res.status(400).json({
                message: "Failed to create doctor"
            });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

// get all doctors
export const getDoctorsController = async (req: Request, res: Response) => {
    try {
        const doctors = await getDoctorsService();
        res.status(200).json(doctors);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get doctor by id
export const getDoctorByIdController = async (req: Request, res: Response) => {
    try {
        const doctorId = parseInt(req.params.doctorId);
        if (isNaN(doctorId)) {
            return res.status(400).json({error: "Invalid doctor id"});
        }
        const doctor = await getDoctorByIdService(doctorId);
        if (doctor) {
            res.status(200).json(doctor);
        } else {
            res.status(404).json({error: "Doctor not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

//update doctor by id
export const updateDoctorByIdController = async (req: Request, res: Response) => {
    try {
        const doctorId = parseInt(req.params.doctorId);
        if (isNaN(doctorId)) {
            return res.status(400).json({error: "Invalid doctor id"});
        }
        const doctor = req.body;
        const updatedDoctor = await updateDoctorService(doctorId, doctor);
        if (updatedDoctor) {
            res.status(200).json({
                message: "Doctor updated successfully",
                data: updatedDoctor
            });
        } else {
            res.status(404).json({error: "Doctor not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

//delete doctor by id
export const deleteDoctorController = async (req: Request, res: Response) => {
    try {
        const doctorId = parseInt(req.params.doctorId);
        if (isNaN(doctorId)) {
            return res.status(400).json({error: "Invalid doctor id"});
        }
        const existingDoctor = await getDoctorByIdService(doctorId);
        if (!existingDoctor) {
            return res.status(404).json({error: "Doctor not found"});
        }
        await deleteDoctorService(doctorId);
        return res.status(204).json({message: "Doctor deleted successfully"});
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}