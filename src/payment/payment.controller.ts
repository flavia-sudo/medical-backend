import { createPaymentService, deletePaymentService, getPaymentByIdService, getPaymentService, updatePaymentService } from "./payment.service";
import { Request, Response } from "express";

export const createPaymentController = async (req: Request, res: Response) => {
    try {
        const payment = req.body;
        const newPayment = await createPaymentService(payment);
        if (newPayment) {
            res.status(201).json({
                message: "Payment created successfully",
                data: newPayment
            });
        } else {
            res.status(400).json({
                message: "Failed to create payment"
            });
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get all payments
export const getPaymentController = async (req: Request, res: Response) => {
    try {
        const payments = await getPaymentService();
        res.status(200).json(payments);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get payment by id
export const getPaymentByIdController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.paymentId);
        if (isNaN(paymentId)) {
            return res.status(400).json({error: "Invalid payment id"});
        }
        const payment = await getPaymentByIdService(paymentId);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({error: "Payment not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// update payment by id
export const updatePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.paymentId);
        if (isNaN(paymentId)) {
            return res.status(400).json({error: "Invalid payment id"});
        }
        const payment = req.body;
        const updatedPayment = await updatePaymentService(paymentId, payment);
        if (updatedPayment) {
            res.status(200).json({
                message: "Payment updated successfully",
                data: updatedPayment
            });
        } else {
            res.status(404).json({error: "Payment not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// delete payment by id
export const deletePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.paymentId);
        if (isNaN(paymentId)) {
            return res.status(400).json({error: "Invalid payment id"});
        }
        const existingPayment = await getPaymentByIdService(paymentId);
        if (!existingPayment) {
            return res.status(404).json({error: "Payment not found"});
        }
        await deletePaymentService(paymentId);
        return res.status(204).json({message: "Payment deleted successfully"});
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}