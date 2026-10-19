import { db } from '../lib/db'
import * as schema from '../lib/db/schema'
import { loadEnvConfig } from '@next/env'
import * as path from 'path'

// Load environment variables from .env
loadEnvConfig(path.resolve(__dirname, '..'))

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // 1. Seed Expense Categories
    const categories = [
      { id: 'cat-001', name: 'Travel', description: 'Business travel, flights, and local transit', isActive: true },
      { id: 'cat-002', name: 'Food & Beverages', description: 'Meals and refreshments during business events', isActive: true },
      { id: 'cat-003', name: 'Accommodation', description: 'Hotel and lodging expenses', isActive: true },
      { id: 'cat-004', name: 'Equipment', description: 'Workplace equipment, software, and hardware', isActive: true },
      { id: 'cat-005', name: 'Other', description: 'Miscellaneous business expenses', isActive: true },
    ]

    console.log('Inserting expense categories...')
    for (const category of categories) {
      await db.insert(schema.expenseCategory).values({
        id: category.id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoNothing()
    }

    // 2. Seed Users
    const users = [
      {
        id: 'emp-001',
        name: 'John Employee',
        email: 'employee@demo.com',
        role: 'employee',
        emailVerified: true,
      },
      {
        id: 'mgr-001',
        name: 'Jane Manager',
        email: 'manager@demo.com',
        role: 'manager',
        emailVerified: true,
      },
      {
        id: 'adm-001',
        name: 'Admin User',
        email: 'admin@demo.com',
        role: 'admin',
        emailVerified: true,
      },
    ]

    console.log('Inserting users...')
    for (const u of users) {
      await db.insert(schema.user).values({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoNothing()
    }

    // 3. Seed Employee Profiles
    const profiles = [
      {
        id: 'prof-001',
        userId: 'emp-001',
        employeeId: 'EMP-0001',
        department: 'Engineering',
        designation: 'Software Engineer',
        managerId: 'mgr-001',
      },
      {
        id: 'prof-002',
        userId: 'mgr-001',
        employeeId: 'EMP-0002',
        department: 'Engineering',
        designation: 'Engineering Manager',
        managerId: 'adm-001',
      },
    ]

    console.log('Inserting employee profiles...')
    for (const profile of profiles) {
      await db.insert(schema.employeeProfile).values({
        id: profile.id,
        userId: profile.userId,
        employeeId: profile.employeeId,
        department: profile.department,
        designation: profile.designation,
        managerId: profile.managerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoNothing()
    }

    // 4. Seed Sample Expense Requests
    const sampleRequests = [
      {
        id: 'req-001',
        employeeId: 'emp-001',
        categoryId: 'cat-001',
        title: 'Client Meeting Travel – Mumbai',
        description: 'Flight and local cab for client meeting in Mumbai',
        amount: '4500.00',
        currency: 'INR',
        vendor: 'Air India',
        status: 'submitted' as const,
        billPath: null,
        isLateSubmission: false,
      },
      {
        id: 'req-002',
        employeeId: 'emp-001',
        categoryId: 'cat-002',
        title: 'Team Lunch – Q2 Planning',
        description: 'Quarterly planning lunch with engineering team',
        amount: '2800.00',
        currency: 'INR',
        vendor: 'Barbeque Nation',
        status: 'submitted' as const,
        billPath: '/receipts/req-002/lunch-receipt.pdf',
        isLateSubmission: false,
      },
      {
        id: 'req-003',
        employeeId: 'mgr-001',
        categoryId: 'cat-004',
        title: 'Laptop Stand & Keyboard',
        description: 'Ergonomic peripherals for home office setup',
        amount: '3200.00',
        currency: 'INR',
        vendor: 'Amazon Business',
        status: 'manager_approved' as const,
        billPath: '/receipts/req-003/amazon-invoice.pdf',
        isLateSubmission: false,
      },
      {
        id: 'req-004',
        employeeId: 'emp-001',
        categoryId: 'cat-005',
        title: 'Annual Conference Registration',
        description: 'React India 2024 conference registration fee',
        amount: '12000.00',
        currency: 'INR',
        vendor: 'Hasgeek',
        status: 'admin_approved' as const,
        billPath: '/receipts/req-004/conf-receipt.pdf',
        isLateSubmission: false,
      },
    ]

    console.log('Inserting sample expense requests...')
    for (const req of sampleRequests) {
      await db.insert(schema.expenseRequest).values({
        ...req,
        paymentDate: null,
        uploadedAt: req.billPath ? new Date() : null,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }).onConflictDoNothing()
    }

    console.log('🌱 Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
