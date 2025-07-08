import db from "../../src/drizzle/db";
import { createUserService, deleteUserService, getUserByIdService, getUsersService, updateUserService } from "../../src/user/user.service";
import { UserTable } from "../../src/drizzle/schema";

jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        UserTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createUserService', () => {
    it('should create a new user', async () => {
        const user = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@gmail.com',
            password: "mypassword123",
            phoneNumber: '0123456789',
            address: '123 Main St',
            role: "user" as "user",
            verificationCode: '123456',
            verified: false
        }
        const insertedUser = { userId: 1, ...user};
        (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([insertedUser])
                })
            });  
            const result = await createUserService(user)
            expect(db.insert).toHaveBeenCalledWith(UserTable);
            expect(result).toEqual(insertedUser);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const user = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@gmail.com',
            password: "mypassword123",
            phoneNumber: '0123456789',
            address: '123 Main St',
            role: "user" as "user",
            verificationCode: '123456',
            verified: false
        }
        const result = await createUserService(user);
        expect(result).toBeNull();
    })
})

describe("getUsersService", () => {
    it("should return all users", async () => {
        (db.query.UserTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getUsersService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no users found", async () => {
        (db.query.UserTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getUsersService();
        expect(result).toEqual([]);
    })
})

describe("getUserByIdService", () => {
    it("should return user with given id", async () => {
        const user = {
            userId: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@gmail.com',
            password: "mypassword123",
            phoneNumber: '0123456789',
            address: '123 Main St',
            role: "user",
            verificationCode: '123456',
            verified: false
        };
        (db.query.UserTable.findFirst as jest.Mock).mockReturnValueOnce(user);
        const result = await getUserByIdService(1)
        expect(db.query.UserTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(user);
    })
    it('should return null if user not found', async () => {
        (db.query.UserTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getUserByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updateUserByIdService", () => {
    it("should update a user and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValueOnce(null)
            })
        })
        const result = await updateUserService(1, {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@gmail.com',
            password: "mypassword123",
            phoneNumber: '0123456789',
            address: '123 Main St',
            role: "user" as "user",
            verificationCode: '123456',
            verified: false
        });
        expect(db.update).toHaveBeenCalledWith(UserTable);
        expect(result).toBe(null);
    })
})

describe("deleteUserByIdService", () => {
    it("should delete a user and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValueOnce(1)
        })
        const result = await deleteUserService(1);
        expect(db.delete).toHaveBeenCalledWith(UserTable);
        expect(result).toBe(1);
    })
})