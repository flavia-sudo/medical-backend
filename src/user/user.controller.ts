import { Request, Response } from "express";
import { createUserService, deleteUserService, getUserByIdService, getUsersService, updateUserService, getDoctorsService } from "./user.service";
import { sendWelcomeEmail } from "../email/email.service";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const createUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const newUser = await createUserService(user);
        if (newUser) {
            await sendWelcomeEmail(newUser.email, newUser.firstName);
            res.status(201).json({
                message: "User created successfully",
                data: newUser
            });
        } else {
            res.status(400).json({
                message: "Failed to create user"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get all users controller
export const getUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getUsersService();
        res.status(200).json(users);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// get user by id
export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({error: "Invalid user id"});
        }
        const user = await getUserByIdService(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({error: "User not found"});
        }
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

// update user by id
export const updateUserByIdController = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        const updates = { ...req.body };

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
            console.log("Password after hashing", updates.password);
        }

        await updateUserService(userId, updates);

        const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
            expiresIn: '1d',
        });

        return res.status(200).json({
            message: "User updated successfully",
            token,
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};


// delete user by id
export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({error: "Invalid user id"});
        }
        const existingUser = await getUserByIdService(userId);
        if (!existingUser) {
            return res.status(404).json({error: "User not found"});
        }
        await deleteUserService(userId);
            return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}

export const getDoctorsController = async (req: Request, res: Response) => {
    try {
        const doctors = await getDoctorsService();
        console.log(doctors);
        res.status(200).json(doctors);
    } catch (error: any) {
        return res.status(500).json({error: error.message})
    }
}