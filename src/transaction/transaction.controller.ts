import { Request, Response } from "express";
import { createTransactionService, deleteTransactionService, getTransactionByIdService, getTransactionService, updateTransactionService } from "./transaction.service";

export const createTransactionController = async (req: Request, res: Response) => {
    try {
        const transaction = req.body;
        const newTransaction = await createTransactionService(transaction);
        if (newTransaction) {
            res.status(201).json({
                message: "Transaction created successfully",
                data: newTransaction
            });
        } else {
            res.status(400).json({
                message: "Failed to create transaction"
            });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

export const getTransactionController = async (req: Request, res: Response) => {
    try {
        const transactions = await getTransactionService();
        res.status(200).json(transactions);
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

export const getTransactionByIdController = async (req: Request, res: Response) => {
    try {
        const transactionId = parseInt(req.params.transactionId);
        if (isNaN(transactionId)) {
            return res.status(400).json({ error: "Invalid transaction id" });
        }
        const transaction = await getTransactionByIdService(transactionId);
        if (transaction) {
            res.status(200).json(transaction);
        } else {
            res.status(404).json({ error: "Transaction not found" });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export const updateTransactionController = async (req: Request, res: Response) => {
    try {
        const transactionId = parseInt(req.params.transactionId);
        if (isNaN(transactionId)) {
            return res.status(400).json({ error: "Invalid transaction id" });
        }
        const transaction = req.body;
        const updatedTransaction = await updateTransactionService(transactionId, transaction);
        if (updatedTransaction) {
            res.status(200).json({
                message: "Transaction updated successfully",
                data: updatedTransaction
            });
        } else {
            res.status(404).json({ error: "Transaction not found" });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteTransactionController = async (req: Request, res: Response) => {
    try {
        const transactionId = parseInt(req.params.transactionId);
        if (isNaN(transactionId)) {
            return res.status(400).json({ error: "Invalid transaction id" });
        }
        const existingTransaction = await getTransactionByIdService(transactionId);
        if (!existingTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        await deleteTransactionService(transactionId);
        return res.status(204).json({ message: "Transaction deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}