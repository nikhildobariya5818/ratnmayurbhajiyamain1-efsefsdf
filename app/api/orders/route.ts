import { type NextRequest, NextResponse } from "next/server"
import { OrderModel } from "@/lib/models/order"
import { ClientModel } from "@/lib/models/client"
import { MenuItemModel } from "@/lib/models/menu-item"
import { IngredientModel } from "@/lib/models/ingredient"
import type { Order } from "@/lib/types"

// GET /api/orders - Get all orders or search/filter orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const clientId = searchParams.get("clientId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const populate = searchParams.get("populate") === "true"

    let orders: Order[]

    if (search) {
      orders = await OrderModel.search(search)
    } else if (clientId) {
      orders = await OrderModel.findByClient(clientId)
    } else if (startDate && endDate) {
      orders = await OrderModel.findByDateRange(new Date(startDate), new Date(endDate))
    } else {
      orders = await OrderModel.findAll()
    }

    // Populate client and menu item details if requested
    if (populate) {
      for (const order of orders) {
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
    }

    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 },
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
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
          error:
            "numberOfPeople, address, orderType, orderDate, orderTime, and menuItems array are required",
        },
        { status: 400 },
      )
    }

    // Validate numberOfPeople
    if (typeof body.numberOfPeople !== "number" || body.numberOfPeople <= 0) {
      return NextResponse.json(
        { success: false, error: "numberOfPeople must be a positive number" },
        { status: 400 },
      )
    }

    // Validate menu items
    if (body.menuItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one menu item is required" },
        { status: 400 },
      )
    }

    // Validate client
    if (!body.clientId && !body.clientSnapshot) {
      return NextResponse.json(
        { success: false, error: "Either clientId or clientSnapshot is required" },
        { status: 400 },
      )
    }

    if (body.clientId) {
      const client = await ClientModel.findById(body.clientId)
      if (!client) {
        return NextResponse.json(
          { success: false, error: "Client not found" },
          { status: 400 },
        )
      }
    }

    // 🔥 NEW LOGIC — same as UPDATE: directly save menuItems
    const orderData = {
      clientId: body.clientId || undefined,
      clientSnapshot: body.clientSnapshot || undefined,
      numberOfPeople: body.numberOfPeople,
      address: body.address.trim(),
      orderType: body.orderType.trim(),
      orderDate: new Date(body.orderDate),
      orderTime: body.orderTime.trim(),
      menuItems: body.menuItems, // ✔ Use data as-is

      vehicleOwnerName: body.vehicleOwnerName?.trim() || undefined,
      phoneNumber: body.phoneNumber?.trim() || undefined,
      vehicleNumberPlaceholder: body.vehicleNumberPlaceholder?.trim() || undefined,
      time: body.time?.trim() || undefined,
      chefName: body.chefName?.trim() || undefined,
      chefPhoneNumber: body.chefPhoneNumber?.trim() || undefined,
      addHelper: body.addHelper?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
    }

    const order = await OrderModel.create(orderData)

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 },
    )
  }
}


function getQuantityForTypeNew(
  quantities:
    | {
        onlyBhajiyaKG: number
        dishWithOnlyBhajiya: number
        dishHaveNoChart: number
        dishHaveChartAndBhajiya: number
      }
    | undefined,
  type: "only_bhajiya_kg" | "dish_with_only_bhajiya" | "dish_have_no_chart" | "dish_have_chart_bhajiya",
): number {
  if (!quantities) return 0

  switch (type) {
    case "only_bhajiya_kg":
      return quantities.onlyBhajiyaKG
    case "dish_with_only_bhajiya":
      return quantities.dishWithOnlyBhajiya
    case "dish_have_no_chart":
      return quantities.dishHaveNoChart
    case "dish_have_chart_bhajiya":
      return quantities.dishHaveChartAndBhajiya
    default:
      return 0
  }
}
