import {
  pgTable,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const expenseStatus = pgEnum('expense_status', [
  'draft',
  'submitted',
  'pending_manager',
  'manager_approved',
  'pending_admin',
  'admin_approved',
  'rejected',
  'clarification_needed',
  'paid',
])

export const approverRole = pgEnum('approver_role', ['manager', 'admin'])

export const approvalStatus = pgEnum('approval_status', ['pending', 'approved', 'rejected', 'clarification_requested'])

export const paymentStatus = pgEnum('payment_status', ['approved', 'pending', 'paid', 'cancelled'])

export const notificationType = pgEnum('notification_type', [
  'submission_confirmed',
  'approval_granted',
  'approval_rejected',
  'clarification_needed',
  'payment_completed',
  'late_upload_warning',
  'pending_approval_reminder',
  'system_alert',
])

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified'),
  image: text('image'),
  role: text('role').notNull().default('employee'), // employee, manager, admin
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
})

// Application tables
export const employeeProfile = pgTable('employee_profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  employeeId: varchar('employeeId', { length: 50 }).notNull().unique(),
  department: varchar('department', { length: 100 }),
  designation: varchar('designation', { length: 100 }),
  managerId: text('managerId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const expenseCategory = pgTable('expense_category', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const expenseRequest = pgTable('expense_request', {
  id: text('id').primaryKey(),
  employeeId: text('employeeId').notNull(),
  categoryId: text('categoryId').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('INR'),
  vendor: varchar('vendor', { length: 255 }),
  projectCode: varchar('projectCode', { length: 50 }),
  remarks: text('remarks'),
  billPath: text('billPath'),
  uploadedAt: timestamp('uploadedAt'),
  paymentDate: timestamp('paymentDate'),
  status: expenseStatus('status').notNull().default('draft'),
  isLateSubmission: boolean('isLateSubmission').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const expenseApproval = pgTable('expense_approval', {
  id: text('id').primaryKey(),
  expenseRequestId: text('expenseRequestId').notNull(),
  approverUserId: text('approverUserId').notNull(),
  approverRole: approverRole('approverRole').notNull(),
  status: approvalStatus('status').notNull(),
  remarks: text('remarks'),
  approvedAt: timestamp('approvedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const paymentLedger = pgTable('payment_ledger', {
  id: text('id').primaryKey(),
  expenseRequestId: text('expenseRequestId').notNull().unique(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('INR'),
  status: paymentStatus('status').notNull().default('pending'),
  transactionReference: varchar('transactionReference', { length: 100 }),
  paidAt: timestamp('paidAt'),
  paymentMethod: varchar('paymentMethod', { length: 50 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const notification = pgTable('notification', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: notificationType('type').notNull(),
  relatedEntityId: text('relatedEntityId'),
  isRead: boolean('isRead').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entityType', { length: 50 }).notNull(),
  entityId: text('entityId').notNull(),
  changes: text('changes'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Relations
export const userRelations = relations(user, ({ many, one }) => ({
  employeeProfile: one(employeeProfile, {
    fields: [user.id],
    references: [employeeProfile.userId],
  }),
  expenseRequests: many(expenseRequest),
  approvals: many(expenseApproval),
  notifications: many(notification),
  sessions: many(session),
}))

export const employeeProfileRelations = relations(employeeProfile, ({ one, many }) => ({
  user: one(user, {
    fields: [employeeProfile.userId],
    references: [user.id],
  }),
  manager: one(user, {
    fields: [employeeProfile.managerId],
    references: [user.id],
  }),
  expenseRequests: many(expenseRequest),
}))

export const expenseRequestRelations = relations(expenseRequest, ({ one, many }) => ({
  employee: one(user, {
    fields: [expenseRequest.employeeId],
    references: [user.id],
  }),
  category: one(expenseCategory, {
    fields: [expenseRequest.categoryId],
    references: [expenseCategory.id],
  }),
  approvals: many(expenseApproval),
  paymentLedger: one(paymentLedger, {
    fields: [expenseRequest.id],
    references: [paymentLedger.expenseRequestId],
  }),
}))

export const expenseApprovalRelations = relations(expenseApproval, ({ one }) => ({
  expenseRequest: one(expenseRequest, {
    fields: [expenseApproval.expenseRequestId],
    references: [expenseRequest.id],
  }),
  approver: one(user, {
    fields: [expenseApproval.approverUserId],
    references: [user.id],
  }),
}))

export const paymentLedgerRelations = relations(paymentLedger, ({ one }) => ({
  expenseRequest: one(expenseRequest, {
    fields: [paymentLedger.expenseRequestId],
    references: [expenseRequest.id],
  }),
}))

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.userId],
    references: [user.id],
  }),
}))
