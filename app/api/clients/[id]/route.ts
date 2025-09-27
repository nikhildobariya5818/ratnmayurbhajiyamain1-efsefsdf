import { type NextRequest, NextResponse } from "next/server"
import { ClientModel } from "@/lib/models/client"

// GET /api/clients/[id] - Get a specific client
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await ClientModel.findById(params.id)

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: client,
    })
  } catch (error) {
    console.error("Error fetching client:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch client",
      },
      { status: 500 },
    )
  }
}

// PUT /api/clients/[id] - Update a specific client
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.phone || !body.address) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, phone, and address are required",
        },
        { status: 400 },
      )
    }

    const updateData = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      address: body.address.trim(),
      reference: body.reference?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
    }

    const client = await ClientModel.update(params.id, updateData)

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: client,
    })
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update client",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/clients/[id] - Delete a specific client
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await ClientModel.delete(params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Client deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete client",
      },
      { status: 500 },
    )
  }
}
