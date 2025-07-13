// Import dependencies and services to be tested
import db from "../../src/drizzle/db";
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "../../src/user/user.service";
import { UserTable } from "../../src/drizzle/schema";

// Mock the db module and its methods
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

// Clear mock function calls before each test
beforeEach(() => {
  jest.clearAllMocks();
});


// Test: createUserService should create a new user
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
    };

    // Simulate the DB returning the inserted user
    const insertedUser = { userId: 1, ...user };
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([insertedUser])
      })
    });

    // Call the service
    const result = await createUserService(user);

    // Assertions
    expect(db.insert).toHaveBeenCalledWith(UserTable);
    expect(result).toEqual(insertedUser);
  });
});


// Test: createUserService should return null if DB insert fails
describe("return null if insert fails", () => {
  it("should return null if insertion fails", async () => {
    // Simulate empty result from insert
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
    };

    // Call the service
    const result = await createUserService(user);

    // Assert null is returned
    expect(result).toBeNull();
  });
});


// Test: getUsersService should return all users
describe("getUsersService", () => {
  it("should return all users", async () => {
    (db.query.UserTable.findMany as jest.Mock).mockReturnValueOnce([]);
    const result = await getUsersService();
    expect(result).toEqual([]);
  });

  it("should return an empty array if no users found", async () => {
    (db.query.UserTable.findMany as jest.Mock).mockReturnValueOnce([]);
    const result = await getUsersService();
    expect(result).toEqual([]);
  });
});


// Test: getUserByIdService should return a user or null
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
    const result = await getUserByIdService(1);
    expect(db.query.UserTable.findFirst).toHaveBeenCalled();
    expect(result).toEqual(user);
  });

  it('should return null if user not found', async () => {
    (db.query.UserTable.findFirst as jest.Mock).mockReturnValueOnce(null);
    const result = await getUserByIdService(9999);
    expect(result).toBeNull();
  });
});


// Test: updateUserService should update a user
describe("updateUserByIdService", () => {
  it("should update a user and return success message", async () => {
    // Mock update chain to simulate successful update
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValueOnce(null)
      })
    });

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
    expect(result).toBe(null); // updateUserService is expected to return null
  });
});


// Test: deleteUserService should delete a user
describe("deleteUserByIdService", () => {
  it("should delete a user and return success message", async () => {
    // Simulate successful delete returning 1
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValueOnce(1)
    });

    const result = await deleteUserService(1);
    expect(db.delete).toHaveBeenCalledWith(UserTable);
    expect(result).toBe(1);
  });
});
