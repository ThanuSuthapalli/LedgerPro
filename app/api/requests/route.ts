import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { expenseRequest, user } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
// use built-in crypto for UUID generation

// GET /api/requests — list requests
// Query params: userId (filter by employee), role (manager|admin for all or team requests)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const role = searchParams.get('role')

  try {
    let query = db
      .select({
        id: expenseRequest.id,
        title: expenseRequest.title,
        description: expenseRequest.description,
        amount: expenseRequest.amount,
        currency: expenseRequest.currency,
        category: expenseRequest.categoryId,
        status: expenseRequest.status,
        billPath: expenseRequest.billPath,
        uploadedAt: expenseRequest.uploadedAt,
        paymentDate: expenseRequest.paymentDate,
        isLateSubmission: expenseRequest.isLateSubmission,
        createdAt: expenseRequest.createdAt,
        updatedAt: expenseRequest.updatedAt,
        employeeId: expenseRequest.employeeId,
        employeeName: user.name,
        employeeEmail: user.email,
      })
      .from(expenseRequest)
      .leftJoin(user, eq(expenseRequest.employeeId, user.id))
      .orderBy(desc(expenseRequest.createdAt))

    let results

    if (userId) {
      // Employee view: only their own requests
      results = await db
        .select({
          id: expenseRequest.id,
          title: expenseRequest.title,
          description: expenseRequest.description,
          amount: expenseRequest.amount,
          currency: expenseRequest.currency,
          category: expenseRequest.categoryId,
          status: expenseRequest.status,
          billPath: expenseRequest.billPath,
          uploadedAt: expenseRequest.uploadedAt,
          paymentDate: expenseRequest.paymentDate,
          isLateSubmission: expenseRequest.isLateSubmission,
          createdAt: expenseRequest.createdAt,
          updatedAt: expenseRequest.updatedAt,
          employeeId: expenseRequest.employeeId,
          employeeName: user.name,
          employeeEmail: user.email,
        })
        .from(expenseRequest)
        .leftJoin(user, eq(expenseRequest.employeeId, user.id))
        .where(eq(expenseRequest.employeeId, userId))
        .orderBy(desc(expenseRequest.createdAt))
    } else {
      // Manager/Admin view: all requests
      results = await db
        .select({
          id: expenseRequest.id,
          title: expenseRequest.title,
          description: expenseRequest.description,
          amount: expenseRequest.amount,
          currency: expenseRequest.currency,
          category: expenseRequest.categoryId,
          status: expenseRequest.status,
          billPath: expenseRequest.billPath,
          uploadedAt: expenseRequest.uploadedAt,
          paymentDate: expenseRequest.paymentDate,
          isLateSubmission: expenseRequest.isLateSubmission,
          createdAt: expenseRequest.createdAt,
          updatedAt: expenseRequest.updatedAt,
          employeeId: expenseRequest.employeeId,
          employeeName: user.name,
          employeeEmail: user.email,
        })
        .from(expenseRequest)
        .leftJoin(user, eq(expenseRequest.employeeId, user.id))
        .orderBy(desc(expenseRequest.createdAt))
    }

    return NextResponse.json({ requests: results })
  } catch (error) {
    console.error('GET /api/requests error:', error)
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  }
}

// POST /api/requests — create a new expense request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      employeeId,
      title,
      description,
      categoryId,
      amount,
      currency = 'INR',
      paymentDate,
      vendor,
      projectCode,
      remarks,
    } = body

    if (!employeeId || !title || !amount || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: employeeId, title, amount, categoryId' },
        { status: 400 }
      )
    }

    const newRequest = {
      id: crypto.randomUUID(),
      employeeId,
      title,
      description: description || null,
      categoryId,
      amount: String(amount),
      currency,
      status: 'submitted' as const,
      vendor: vendor || null,
      projectCode: projectCode || null,
      remarks: remarks || null,
      billPath: null,
      uploadedAt: null,
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      isLateSubmission: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(expenseRequest).values(newRequest)

    return NextResponse.json({ request: newRequest }, { status: 201 })
  } catch (error) {
    console.error('POST /api/requests error:', error)
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
  }
}
