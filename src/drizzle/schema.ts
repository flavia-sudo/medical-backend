import { relations } from "drizzle-orm";
import {
  pgEnum, pgTable, serial, text, boolean, date, varchar,
  integer, timestamp, decimal
} from "drizzle-orm/pg-core";

// Enums
export const RoleEnum = pgEnum("role", ["user", "admin", "doctor"]);

// User table
export const UserTable = pgTable("user", {
  userId: serial("userId").primaryKey(),

  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 500 }).notNull(),
  phoneNumber: text("phone_number"),
  address: varchar("address", { length: 50 }).notNull(),
  role: RoleEnum("role").notNull(),

  createdAt: date("created_at").defaultNow(),
  updatedAt: date("updated_at").defaultNow(),

  image_URL: varchar("image_url", { length: 255 }).default("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"),
  verificationCode: varchar("verification_code", { length: 10 }),
  verified: boolean("verified").default(false),

  specialization: varchar("specialization", { length: 50 }),
  availableDays: varchar("available_days", { length: 50 }),
});


// Appointment table
export const AppointmentTable = pgTable("appointment", {
  appointmentId: serial("appointment_id").primaryKey(),
  userId: integer("user_id").references(() => UserTable.userId).notNull(),
  doctorId: integer("doctor_id").references(() => UserTable.userId, { onDelete: "set null" }).notNull(),
  appointmentDate: date("appointment_date").notNull(),
  time: timestamp("Time", { withTimezone: true }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Prescription table
export const PrescriptionTable = pgTable("prescription", {
  prescriptionId: serial("prescription_id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => AppointmentTable.appointmentId, { onDelete: "cascade" }).notNull(),
  doctorId: integer("doctor_id").references(() => UserTable.userId).notNull(),
  patientId: integer("patient_id").references(() => UserTable.userId).notNull(),
  prescription: text("prescription").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction table
export const TransactionTable = pgTable("transaction", {
  transactionId: serial("transaction_id").primaryKey(),
  userId: integer("user_id").references(() => UserTable.userId).notNull(),
  transactionName: varchar("transactiont_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: boolean("status").default(true),
});

// Payment table
export const PaymentTable = pgTable("payment", {
  paymentId: serial("payment_id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => AppointmentTable.appointmentId, { onDelete: "cascade" }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: boolean("status").default(true),
  transactionId: integer("transaction_id").references(() => TransactionTable.transactionId, { onDelete: "set null" }).notNull(),
  paymentDate: date("payment_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Complaint table
export const ComplaintTable = pgTable("complaint", {
  complaintId: serial("complaint_id").primaryKey(),
  userId: integer("user_id").references(() => UserTable.userId).notNull(),
  appointmentId: integer("appointment_id").references(() => AppointmentTable.appointmentId, { onDelete: "set null" }).notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  isPending: boolean("is_pending").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ================== RELATIONS ==================

// User table relations
export const UserRelations = relations(UserTable, ({ many }) => ({
  transactions: many(TransactionTable),
  appointments: many(AppointmentTable),
  complaints: many(ComplaintTable),
  prescriptionsAsDoctor: many(PrescriptionTable, {
    relationName: "prescriptionsAsDoctor"
  }),
  prescriptionsAsPatient: many(PrescriptionTable, {
    relationName: "prescriptionsAsPatient"
  }),
}));

// Appointment relations
export const AppointmentRelations = relations(AppointmentTable, ({ one, many }) => ({
  complaints: many(ComplaintTable),
  users: one(UserTable, {
    fields: [AppointmentTable.userId],
    references: [UserTable.userId]
  }),
  doctors: one(UserTable, {
    fields: [AppointmentTable.doctorId],
    references: [UserTable.userId]
  }),
  prescriptions: many(PrescriptionTable),
  payment: one(PaymentTable, {
    fields: [AppointmentTable.appointmentId],
    references: [PaymentTable.appointmentId]
  }),
}));

// Prescription relations
export const PrescriptionRelations = relations(PrescriptionTable, ({ one }) => ({
  appointment: one(AppointmentTable, {
    fields: [PrescriptionTable.appointmentId],
    references: [AppointmentTable.appointmentId]
  }),
  doctor: one(UserTable, {
    fields: [PrescriptionTable.doctorId],
    references: [UserTable.userId]
  }),
  patient: one(UserTable, {
    fields: [PrescriptionTable.patientId],
    references: [UserTable.userId]
  }),
}));

// Payment relations
export const PaymentRelations = relations(PaymentTable, ({ one }) => ({
  appointment: one(AppointmentTable, {
    fields: [PaymentTable.appointmentId],
    references: [AppointmentTable.appointmentId]
  }),
  transaction: one(TransactionTable, {
    fields: [PaymentTable.transactionId],
    references: [TransactionTable.transactionId]
  }),
}));

// Transaction relations
export const TransactionRelations = relations(TransactionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [TransactionTable.userId],
    references: [UserTable.userId]
  }),
  payment: one(PaymentTable, {
    fields: [TransactionTable.transactionId],
    references: [PaymentTable.transactionId]
  }),
}));

// Complaint relations
export const ComplaintRelations = relations(ComplaintTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [ComplaintTable.userId],
    references: [UserTable.userId]
  }),
  appointment: one(AppointmentTable, {
    fields: [ComplaintTable.appointmentId],
    references: [AppointmentTable.appointmentId]
  }),
}));

// ================== TYPES ==================
export type TIUser = typeof UserTable.$inferInsert;
export type TSUser = typeof UserTable.$inferSelect;

export type TIAppointment = typeof AppointmentTable.$inferInsert;
export type TSAppointment = typeof AppointmentTable.$inferSelect;

export type TIPrescription = typeof PrescriptionTable.$inferInsert;
export type TSPrescription = typeof PrescriptionTable.$inferSelect;

export type TIPayment = typeof PaymentTable.$inferInsert;
export type TSPayment = typeof PaymentTable.$inferSelect;

export type TITransaction = typeof TransactionTable.$inferInsert;
export type TSTransaction = typeof TransactionTable.$inferSelect;

export type TIComplaint = typeof ComplaintTable.$inferInsert;
export type TSComplaint = typeof ComplaintTable.$inferSelect;
