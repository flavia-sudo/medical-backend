import { Request, Response } from "express";
import { createComplaintService, deleteComplaintService, getComplaintByIdService, getComplaintService, updateComplaintService, getComplaintByUserIdService } from "./complaint.service";

export const createComplaintController = async (req: Request, res: Response) => {
    try {
        const complaint = req.body;
        if (complaint.createdAt) {
            complaint.createdAt = new Date(complaint.createdAt);
        }
        if (complaint.updatedAt) {
            complaint.updatedAt = new Date(complaint.updatedAt);
        }
        const newComplaint = await createComplaintService(complaint);
        if (newComplaint) {
            res.status(201).json({
                message: "Complaint created successfully",
                data: newComplaint
            });
        } else {
            res.status(400).json({
                message: "Failed to create complaint"
            });
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get all complaints
export const getComplaintController = async (req: Request, res: Response) => {
    try {
        const complaints = await getComplaintService();
        res.status(200).json(complaints);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get complaint by id
export const getComplaintByIdController = async (req: Request, res: Response) => {
    try {
        const complaintId = parseInt(req.params.complaintId);
        if (isNaN(complaintId)) {
            return res.status(400).json({error: "Invalid complaint id"});
        }
        const complaint = await getComplaintByIdService(complaintId);
        if (complaint) {
            res.status(200).json(complaint);
        } else {
            res.status(404).json({error: "Complaint not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// update complaint by id
export const updateComplaintController = async (req: Request, res: Response) => {
    try {
        const complaintId = parseInt(req.params.complaintId);
        if (isNaN(complaintId)) {
            return res.status(400).json({error: "Invalid complaint id"});
        }
        const complaint = req.body;
        const updatedComplaint = await updateComplaintService(complaintId, complaint);
        if (updatedComplaint) {
            res.status(200).json({
                message: "Complaint updated successfully",
                data: updatedComplaint
            });
        } else {
            res.status(404).json({error: "Complaint not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// delete complaint by id
export const deleteComplaintController = async (req: Request, res: Response) => {
    try {
        const complaintId = parseInt(req.params.complaintId);
        if (isNaN(complaintId)) {
            return res.status(400).json({error: "Invalid complaint id"});
        }
        const existingComplaint = await getComplaintByIdService(complaintId);
        if (!existingComplaint) {
            return res.status(404).json({error: "Complaint not found"});
        }
        await deleteComplaintService(complaintId);
        return res.status(204).json({message: "Complaint deleted successfully"});
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

export const getComplaintsByUserIdController = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({error: "Invalid user id"});
        }
        const complaints = await getComplaintByUserIdService(userId);
        res.status(200).json(complaints);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}