import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../drizzle/db';
import { UserTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

// Middleware to check if the request is authenticated
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized access' });
        return;
    }

    // Extract the token part from the header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        // Look up the user in the database using the ID from the decoded token
        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.userId, decoded.userId)
        });

        // If the user does not exist in the database
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Attach the user object to the request for downstream middleware/controllers
        (req as any).user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Token is invalid or expired
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check if the authenticated user is an admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    // Check if user exists and has the role of 'admin'
    if (!user || user.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
        return;
    }

    // Proceed if the user is an admin
    next();
};
