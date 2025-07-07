import db from "../../src/drizzle/db";
import jest from "jest"

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
            role: 'user',
            verificationCode: '123456',
            verified: false
        }
        const insertedUser = { userId: 1, ...user};
        (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([insertedUser])
                })
            });  
})
})