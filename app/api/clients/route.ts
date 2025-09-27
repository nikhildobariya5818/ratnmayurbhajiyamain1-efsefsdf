import { type NextRequest, NextResponse } from "next/server"
import { ClientModel } from "@/lib/models/client"
import type { Client } from "@/lib/types"

// GET /api/clients - Get all clients or search clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let clients: Client[]

    if (search) {
      clients = await ClientModel.search(search)
    } else {
      clients = await ClientModel.findAll()
    }

    return NextResponse.json({
      success: true,
      data: clients,
    })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch clients",
      },
      { status: 500 },
    )
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
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

    const clientData: Omit<Client, "_id" | "createdAt" | "updatedAt"> = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      address: body.address.trim(),
      reference: body.reference?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
    }

    const client = await ClientModel.create(clientData)

    return NextResponse.json(
      {
        success: true,
        data: client,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create client",
      },
      { status: 500 },
    )
  }
}
