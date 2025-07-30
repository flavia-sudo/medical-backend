import db from "../drizzle/db";
import { TIUser, UserTable } from "../drizzle/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendWelcomeEmail } from "../email/email.service";
import { and, eq } from "drizzle-orm";

export const createUserService = async (user: Omit<TIUser, "userId">) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const email = user.email.toLowerCase();
        //generates random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser: TIUser = {
        ...user,
        email: email,
        password: hashedPassword,
        role: user.role ?? "user",
        verificationCode: verificationCode,
        verified: false,
    };
    const [createdUser] = await db.insert(UserTable).values(newUser).returning();
    if (!createdUser) {
        throw new Error("Failed to create user");
    }

        const token = jwt.sign({userId: createdUser.userId }, process.env.JWT_SECRET as string, {
        expiresIn: '1d'})
        await sendVerificationEmail(user.email, user.firstName, verificationCode);

        await sendWelcomeEmail(user.email, user.firstName);
    return { user: createdUser, token };
    };

// Service to create an admin user
export const createAdminService = async (adminData: Omit<TIUser, 'userId' | 'role' | 'verified' | 'verificationCode'>) => {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    //generates random 6-digit code for admin verification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const newAdmin: TIUser = {
        ...adminData,
        password: hashedPassword,
        role: "admin", // Set as admin
        verified: false, // Admin needs to verify like regular users
        verificationCode: verificationCode
    };
    
    const [admin] = await db.insert(UserTable).values(newAdmin).returning();
    if (!admin) {
        throw new Error("Failed to create admin");
    }
    
    const token = jwt.sign({ userId: admin.userId }, process.env.JWT_SECRET as string, {
        expiresIn: '1d'
    });
    
    // Send verification email and welcome email to admin
    await sendVerificationEmail(admin.email, admin.firstName, verificationCode);
    await sendWelcomeEmail(admin.email, admin.firstName);
    
    return { admin, token };
};

// Service to login a user (works for both regular users and admins)
export const userLoginService = async (email: string, password: string) => {
  const user = await db.select().from(UserTable).where(eq(UserTable.email, email)).then((rows) => rows[0]);
  if (!user) {
    return new Error("Invalid email or password");
   }
const isPasswordValid = await bcrypt.compare(password, user.password);
console.log("valid password",isPasswordValid);

// console.log(password, user.password, isPasswordValid);
  if (isPasswordValid === false) {
    return new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.userId}, process.env.JWT_SECRET as string, {
    expiresIn: '1d'
    });

    return {user, token};
}

export const verifyCodeService = async (email: string, code: string) => {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(and(eq(UserTable.email, email), eq(UserTable.verificationCode, code)));

  if (!user) {
    throw new Error("Invalid verification code");
  }

  // Mark user as verified
  await db.update(UserTable)
    .set({ verified: true })
    .where(eq(UserTable.userId, user.userId));

  // Get the updated user
  const [updatedUser] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.userId, user.userId));

  // Generate token
  const token = jwt.sign({ userId: updatedUser.userId }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  return { user: updatedUser, token };
};


