import { Request, Response } from "express";
import {
    createPrescriptionService,
    deletePrescriptionService,
    getPrescriptionByIdService,
    getPrescriptionService,
    updatePrescriptionService, 
    getPrescriptionByUserIdService

 } from "./prescription.service";

export const createPrescriptionController = async (req: Request, res: Response) => {
    try {
        const prescription = req.body;
        if (prescription.createdAt) {
            prescription.createdAt = new Date(prescription.createdAt);
        }
        if (prescription.updatedAt) {
            prescription.updatedAt = new Date(prescription.updatedAt);
        }
        const newPrescription = await createPrescriptionService(prescription);
        if (newPrescription) {
            res.status(201).json({
                message: "Prescription created successfully",
                data: newPrescription
            });
        } else {
            res.status(400).json({
                message: "Failed to create prescription"
            });
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get all prescriptions
export const getPrescriptionController = async (req: Request, res: Response) => {
    try {
        const prescriptions = await getPrescriptionService();
        res.status(200).json(prescriptions);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get prescription by id
export const getPrescriptionByIdController = async (req: Request, res: Response) => {
    try {
        const prescriptionId = parseInt(req.params.prescriptionId);
        if (isNaN(prescriptionId)) {
            return res.status(400).json({error: "Invalid prescription id"});
        }
        const prescription = await getPrescriptionByIdService(prescriptionId);
        if (prescription) {
            res.status(200).json(prescription);
        } else {
            res.status(404).json({error: "Prescription not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// update prescription by id
export const updatePrescriptionController = async (req: Request, res: Response) => {
    try {
        const prescriptionId = parseInt(req.params.prescriptionId);
        if (isNaN(prescriptionId)) {
            return res.status(400).json({error: "Invalid prescription id"});
        }
        const prescription = req.body;
        const updatedPrescription = await updatePrescriptionService(prescriptionId, prescription);
        if (updatedPrescription) {
            res.status(200).json({
                message: "Prescription updated successfully",
                data: updatedPrescription
            });
        } else {
            res.status(404).json({error: "Prescription not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// delete prescription by id
export const deletePrescriptionController = async (req: Request, res: Response) => {
    try {
        const prescriptionId = parseInt(req.params.prescriptionId);
        if (isNaN(prescriptionId)) {
            return res.status(400).json({error: "Invalid prescription id"});
        }
        const existingPrescription = await getPrescriptionByIdService(prescriptionId);
        if (!existingPrescription) {
            return res.status(404).json({error: "Prescription not found"});
        }
        await deletePrescriptionService(prescriptionId);
        return res.status(204).json({message: "Prescription deleted successfully"});
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get prescription by user id
export const getPrescriptionByUserIdController = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({error: "Invalid user id"});
        }
        const prescriptions = await getPrescriptionByUserIdService(userId);
        res.status(200).json(prescriptions);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}