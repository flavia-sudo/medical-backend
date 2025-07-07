import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, text, boolean, date, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";

// Enum
export const RoleEnum = pgEnum("role", ["user","admin","doctor"]);
export const AppointmentEnum = pgEnum("appointment_status", ["pending","confirmed","cancelled"]);
export const ComplaintEnum = pgEnum("complaint_status", ["Open","In Progress","Resolved","Closed"]);

// user table
export const UserTable = pgTable("user", {
    userId: serial("userId").primaryKey(),
    firstName: varchar("FirstName", { length: 50 }).notNull(),
    lastName: varchar("LastName", { length: 50 }).notNull(),
    email: varchar("Email", { length: 255 }).notNull().unique(),
    password: varchar("Password", { length: 50 }).notNull(),
    phoneNumber: text("Phone Number"),
    address: varchar("Address", { length: 50 }).notNull(),
    role: RoleEnum("Role").notNull(),
    createdAt: date("Created At").notNull(),
    updatedAt: date("Updated At"),
    image_URL: varchar("Image URL", { length: 255 }).default("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"),
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
    transactionName: varchar("Transaction Name").notNull(),
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
    appointmentId: integer("appointmentId").references(() => AppointmentTable.appointmentId).notNull(),
    subject: text("Subject").notNull(),
    description: text("Description").notNull(),
    status: ComplaintEnum("Status").notNull(),
    createdAt: date("Created At").notNull(),
    updatedAt: date("Updated At"),
})

// Relationships
// User table Relationships
export const UserRelations = relations(UserTable, ({ many, one }) => ({
    transactions: many(TransactionTable),
    appointments: many(AppointmentTable),
    complaints: many(ComplaintTable),
    doctors: one(DoctorTable,{
        fields: [UserTable.userId],
        references: [DoctorTable.userId]
    }),
}))

// Doctor table Relationships
export const DoctorRelations = relations(DoctorTable, ({ many }) => ({
    appointments: many(AppointmentTable),
    prescriptions: many(PrescriptionTable),
}))

// Appointment table relationships
export const AppointmentRelations = relations(AppointmentTable, ({ many,one }) => ({
    complaints: many(ComplaintTable),
    users: one(UserTable, {
        fields: [AppointmentTable.userId],
        references: [UserTable.userId]
    }),
    doctors: one(DoctorTable, {
        fields: [AppointmentTable.doctorId],
        references: [DoctorTable.doctorId]
    }),
    prescriptions: many(PrescriptionTable),
    payment: one(PaymentTable, {
        fields: [AppointmentTable.appointmentId],
        references: [PaymentTable.appointmentId]
    })
}))

//prescription table relationships
export const PrescriptionRelations = relations(PrescriptionTable, ({ many, one }) => ({
    appointments: one(AppointmentTable, {
        fields: [PrescriptionTable.appointmentId],
        references: [AppointmentTable.appointmentId]
    }),
    doctor: many(DoctorTable),
    user: many(UserTable),
}))

// payment table relationships
export const PaymentRelations = relations(PaymentTable, ({ many, one }) => ({
    appointments: one(AppointmentTable, {
        fields: [PaymentTable.appointmentId],
        references: [AppointmentTable.appointmentId]
    }),
    transactions: many(TransactionTable),
}))

// transaction table relationships
export const TransactionRelations = relations(TransactionTable, ({ one }) => ({
    users: one(UserTable, {
        fields: [TransactionTable.userId],
        references: [UserTable.userId]
    }),
    payments: one(PaymentTable, {
        fields: [TransactionTable.transactionId],
        references: [PaymentTable.transactionId]
    }),
}))

// complaints table relationships
export const ComplaintRelations = relations(ComplaintTable, ({ many, one }) => ({
    user: many(UserTable),
    appointment: one(AppointmentTable, {
        fields: [ComplaintTable.appointmentId],
        references: [AppointmentTable.appointmentId]
    }),
}))

export type TIUser = typeof UserTable.$inferInsert
export type TSUser = typeof UserTable.$inferSelect
export type TIDoctor = typeof DoctorTable.$inferInsert
export type TSDoctor = typeof DoctorTable.$inferSelect
export type TIAppointment = typeof AppointmentTable.$inferInsert
export type TSAppointment = typeof AppointmentTable.$inferSelect
export type TIPrescription = typeof PrescriptionTable.$inferInsert
export type TSPrescription = typeof PrescriptionTable.$inferSelect
export type TIPayment = typeof PaymentTable.$inferInsert
export type TSPayment = typeof PaymentTable.$inferSelect
export type TITransaction = typeof TransactionTable.$inferInsert
export type TSTransaction = typeof TransactionTable.$inferSelect
export type TIComplaint = typeof ComplaintTable.$inferInsert
export type TSComplaint = typeof ComplaintTable.$inferSelect
