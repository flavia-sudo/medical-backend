import { Request, Response } from 'express';
import { createAdminService, createUserService, userLoginService, verifyCodeService } from './auth.service';

export const registerUserController = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const {user, token} = await createUserService(req.body);
        return res.status(201).json({
            message: "User created successfully",
            user,
            token
        });
    } catch (error: any) {
        console.log(error); 
        return res.status(500).json({error: error.message})
    }
}

// create admin controller
export const createAdminController = async (req: Request, res: Response) => {
    try {
        const adminData = req.body;
        if (!adminData.firstName || !adminData.lastName || !adminData.email || !adminData.password || !adminData.role) {
            return res.status(400).json({ error: "Missing required admin fields" });
        }
        const { admin, token } = await createAdminService(adminData);
        return res.status(201).json({
            message: "Admin created successfully",
            admin: {
                userId: admin.userId,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role
            },
            token
        });
    } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
};

// Login user controller (works for users, admins and doctors)
export const loginUserController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }
    try {
        const { user, token }:any = await userLoginService(email, password);
        console.log(email, password);
        return res.status(200).json({
            message: "Login successful",
            user:user, 
            token:token
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// verify
export const verifyCodeController = async (req: Request, res: Response) => {
    try {
        const {email, code} = req.body;
        const result = await verifyCodeService(email, code);
        return res.status(200).json( result );
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};