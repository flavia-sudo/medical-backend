import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, text, boolean, date, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";

// Enum
export const RoleEnum = pgEnum("role", ["user","admin","doctor"]);
export const AppointmentEnum = pgEnum("appointment", ["pending","confirmed","cancelled"]);
export const ComplaintEnum = pgEnum("complaint", ["Open","In Progress","Resolved","Closed"]);

// user table
export const UserTable = pgTable("user", {
    userId: serial("userId").primaryKey(),
    firstName: varchar("FirstName", { length: 50 }).notNull(),
    lastName: varchar("LastName", { length: 50 }).notNull(),
    email: varchar("Email", { length: 255 }).notNull().unique(),
    password: varchar("Password", { length: 50 }).notNull(),
    contactPhone: text("Phone Number"),
    address: varchar("Address", { length: 50 }).notNull(),
    role: RoleEnum("Role").notNull(),
    createdAt: date("Created At").notNull(),
    updatedAt: date("Updated At"),
    image_URL: varchar("Image URL", { length: 255 }),
    verificationCode: varchar("Verification Code", { length: 10 }),
    verified: boolean("Verified").default(false),
})

//doctor table
export const DoctorTable = pgTable("doctor", {
    doctorId: serial("doctorId").primaryKey(),
    userId: integer("userId").references(() => UserTable.userId).notNull(),
    firstName: varchar("FirstName", { length: 50 }).notNull(),
    lastName: varchar("LastName", { length: 50 }).notNull(),
    specialization: varchar("Specialization", { length: 50 }),
    contactPhone: text("Phone Number"),
    availableDays: varchar("Available Days", { length: 50 }),
    createdAt: date("Created At").notNull(),
    updatedAt: date("Updated At"),
})

//appointment table
export const AppointmentTable = pgTable("appointment", {
    appointmentId: serial("appointmentId").primaryKey(),
    userId: integer("userId").references(() => UserTable.userId).notNull(),
    doctorId: integer("doctorId").references(() => DoctorTable.doctorId).notNull(),
    appointmentDate: date("Date").notNull(),
    time: timestamp("Time"),
    totalAmount: decimal("Total Amount", { precision: 10, scale: 2 }).notNull(),
    status: AppointmentEnum("Status").notNull(),
    createdAt: date("Created At").notNull(),
    updatedAt: date("Updated At"),
})

// prescription table
export const PrescriptionTable = pgTable("prescription", {
    prescriptionId: serial("prescriptionId").primaryKey(),
    appointmentId: integer("appointmentId").references(() => AppointmentTable.appointmentId).notNull(),
    doctorId: integer("doctorId").references(() => DoctorTable.doctorId).notNull(),
    patientId: integer("patientId").references(() => UserTable.userId).notNull(),
    notes: text("Prescription").notNull(),
    createdAt: date("Created At").notNull(),
    updatedAt: date("Updated At"),
})

// transaction table
export const TransactionTable = pgTable("transaction", {
    transactionId: serial("transactionId").primaryKey(),
    userId: integer("userId").references(() => UserTable.userId).notNull(),
    transactionName: varchar("Transaction Date").notNull(),
    amount: decimal("Amount", { precision: 10, scale: 2 }).notNull(),
    status: boolean("Status").default(true),
})

// payment table
export const PaymentTable = pgTable("payment", {
    paymentId: serial("paymentId").primaryKey(),
    appointmentId: integer("appointmentId").references(() => AppointmentTable.appointmentId).notNull(),
    amount: decimal("Amount", { precision: 10, scale: 2 }).notNull(),
    status: boolean("Status").default(true),
    transactionId: integer("Transaction Id").references(() => TransactionTable.transactionId).notNull(),
    paymentDate: date("Payment Date").notNull(),
    createdAt: date("Created At").notNull(),
    updatedAt: date("Updated At"),
})

// complaints table
export const ComplaintTable = pgTable("complaint", {
    complaintId: serial("complaintId").primaryKey(),
    userId: integer("userId").references(() => UserTable.userId).notNull(),
    AppointmentId: integer("appointmentId").references(() => AppointmentTable.appointmentId).notNull(),
    subject: text("Subject").notNull(),
    description: text("Description").notNull(),
    status: ComplaintEnum("Status").notNull(),
    createdAt: date("Created At").notNull(),
    updatedAt: date("Updated At"),
})

// Relationships
// User table Relationships
export const UserRelations = relations(UserTable as any, ({ many, one }) => ({
    transactions: many(TransactionTable as any),
    appointments: many(AppointmentTable as any),
    complaints: many(ComplaintTable as any),
    doctors: one(DoctorTable as any,{
        fields: [UserTable.userId as any],
        references: [DoctorTable.userId as any]
    }),
}))

// Doctor table Relationships
export const DoctorRelations = relations(DoctorTable as any, ({ many, one }) => ({
    appointments: one(AppointmentTable as any, {
        fields: [DoctorTable.doctorId as any],
        references: [AppointmentTable.doctorId as any]
    }),
    prescriptions: many(PrescriptionTable as any),
}))

// Appointment table relationships
export const AppointmentRelations = relations(AppointmentTable as any, ({ many,one }) => ({
    complaints: many(ComplaintTable as any),
    users: one(UserTable as any, {
        fields: [AppointmentTable.userId as any],
        references: [UserTable.userId as any]
    }),
    doctors: one(DoctorTable as any, {
        fields: [AppointmentTable.doctorId as any],
        references: [DoctorTable.doctorId as any]
    }),
    prescriptions: many(PrescriptionTable as any),
    payment: one(PaymentTable as any, {
        fields: [AppointmentTable.appointmentId as any],
        references: [PaymentTable.appointmentId as any]
    })
}))

//prescription table relationships
export const PrescriptionRelations = relations(PrescriptionTable as any, ({ many, one }) => ({
    appointments: one(AppointmentTable as any, {
        fields: [PrescriptionTable.appointmentId as any],
        references: [AppointmentTable.appointmentId as any]
    }),
    doctor: many(DoctorTable as any),
    user: many(UserTable as any),
}))

// payment table relationships
export const PaymentRelations = relations(PaymentTable as any, ({ one }) => ({
    appointments: one(AppointmentTable as any, {
        fields: [PaymentTable.appointmentId as any],
        references: [AppointmentTable.appointmentId as any]
    }),
    transactions: one(TransactionTable as any, {
        fields: [PaymentTable.transactionId as any],
        references: [TransactionTable.transactionId as any]
    }),
}))

// transaction table relationships
export const TransactionRelations = relations(TransactionTable as any, ({ many, one }) => ({
    users: many(UserTable as any),
    payments: one(PaymentTable as any, {
        fields: [TransactionTable.transactionId as any],
        references: [PaymentTable.transactionId as any]
    }),
}))

// complaints table relationships
export const ComplaintRelations = relations(ComplaintTable as any, ({ one }) => ({
    user: one(UserTable as any  , {
        fields: [ComplaintTable.userId as any],
        references: [UserTable.userId as any]
    }),
    appointment: one(AppointmentTable as any, {
        fields: [ComplaintTable.AppointmentId as any],
        references: [AppointmentTable.appointmentId as any]
    }),
}))

export type TIUser = typeof UserTable.$inferInsert
