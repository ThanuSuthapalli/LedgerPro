import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { expenseRequest, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/requests/[id] — get single request
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const results = await db
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
      .where(eq(expenseRequest.id, params.id))
      .limit(1)

    if (results.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    return NextResponse.json({ request: results[0] })
  } catch (error) {
    console.error('GET /api/requests/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 })
  }
}

// PATCH /api/requests/[id] — update status or upload receipt
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { status, billPath, remarks } = body

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (status) {
      updateData.status = status
    }

    if (billPath) {
      updateData.billPath = billPath
      updateData.uploadedAt = new Date()

      // Check if late (more than 48 hours after creation)
      const existing = await db
        .select({ createdAt: expenseRequest.createdAt })
        .from(expenseRequest)
        .where(eq(expenseRequest.id, params.id))
        .limit(1)

      if (existing.length > 0) {
        const hoursDiff =
          (new Date().getTime() - new Date(existing[0].createdAt).getTime()) /
          (1000 * 60 * 60)
        updateData.isLateSubmission = hoursDiff > 48
      }
    }

    if (remarks !== undefined) {
      updateData.remarks = remarks
    }

    await db
      .update(expenseRequest)
      .set(updateData)
      .where(eq(expenseRequest.id, params.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/requests/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 })
  }
}
