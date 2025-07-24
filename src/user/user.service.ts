import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUser, UserTable } from "../drizzle/schema";

// create user service
export const createUserService = async (user: TIUser) => {
    const [ inserted ] = await db.insert(UserTable).values(user).returning();
    if (inserted) {
        return inserted;
    }
    return null;
}

// get users
export const getUsersService = async () => {
    const users = await db.query.UserTable.findMany();
    return users;
}

// get user by id
export const getUserByIdService = async (Id: number) => {
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.userId, Id)
    });
    return user;
}

// update user by id
export const updateUserService = async (Id: number, user: TIUser) => {
    const updated = await db.update(UserTable).set(user).where(eq(UserTable.userId, Id));
    return updated;
}

// delete user by id
export const deleteUserService = async (Id: number) => {
    const deleted = await db.delete(UserTable).where(eq(UserTable.userId, Id));
    return deleted;
}

// get user with role doctor
export const getDoctorsService = async () => {
    const doctors = await db.query.UserTable.findMany({
        where: eq(UserTable.role, "doctor")
    });
    return doctors;
}
