import { type NextRequest, NextResponse } from "next/server"
import { OrderModel } from "@/lib/models/order"
import { ClientModel } from "@/lib/models/client"
import { MenuItemModel } from "@/lib/models/menu-item"

// GET /api/orders/[id] - Get a specific order
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const populate = searchParams.get("populate") === "true"

    const order = await OrderModel.findById(params.id)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    // Populate client and menu item details if requested
    if (populate) {
      // Populate client details
      if (order.clientId) {
        const client = await ClientModel.findById(order.clientId)
        if (client) {
          order.client = client
        }
      }

      // Populate menu item details
      for (const orderMenuItem of order.menuItems) {
        const menuItem = await MenuItemModel.findById(orderMenuItem.menuItemId)
        if (menuItem) {
          orderMenuItem.menuItem = menuItem
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order",
      },
      { status: 500 },
    )
  }
}

// PUT /api/orders/[id] - Update a specific order
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate required fields
    if (
      !body.numberOfPeople ||
      !body.address ||
      !body.orderType ||
      !body.orderDate ||
      !body.orderTime ||
      !body.menuItems ||
      !Array.isArray(body.menuItems)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "numberOfPeople, address, orderType, orderDate, orderTime, and menuItems array are required",
        },
        { status: 400 },
      )
    }

    // Validate numberOfPeople
    if (typeof body.numberOfPeople !== "number" || body.numberOfPeople <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "numberOfPeople must be a positive number",
        },
        { status: 400 },
      )
    }

    // Validate menu items
    if (body.menuItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one menu item is required",
        },
        { status: 400 },
      )
    }

    // If clientId is provided, validate it exists
    if (body.clientId) {
      const client = await ClientModel.findById(body.clientId)
      if (!client) {
        return NextResponse.json(
          {
            success: false,
            error: "Client not found",
          },
          { status: 400 },
        )
      }
    }

    const updateData = {
      clientId: body.clientId || undefined,
      clientSnapshot: body.clientSnapshot || undefined,
      numberOfPeople: body.numberOfPeople,
      address: body.address.trim(),
      orderType: body.orderType.trim(),
      orderDate: new Date(body.orderDate),
      orderTime: body.orderTime.trim(),
      menuItems: body.menuItems,
      vehicleOwnerName: body.vehicleOwnerName?.trim() || undefined,
      phoneNumber: body.phoneNumber?.trim() || undefined,
      vehicleNumberPlaceholder: body.vehicleNumberPlaceholder?.trim() || undefined,
      time: body.time?.trim() || undefined,
      chefName: body.chefName?.trim() || undefined,
      chefPhoneNumber: body.chefPhoneNumber?.trim() || undefined,
      addHelper: body.addHelper?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
    }

    const order = await OrderModel.update(params.id, updateData)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/orders/[id] - Delete a specific order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await OrderModel.delete(params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
      },
      { status: 500 },
    )
  }
}
