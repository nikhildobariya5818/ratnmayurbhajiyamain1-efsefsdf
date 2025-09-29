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

    // Validate client or client snapshot
    if (!body.clientId && !body.clientSnapshot) {
      return NextResponse.json(
        {
          success: false,
          error: "Either clientId or clientSnapshot is required",
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

    // Validate and populate menu items
    const processedMenuItems = []
    for (const orderMenuItem of body.menuItems) {
      if (!orderMenuItem.menuItemId || !orderMenuItem.selectedType) {
        return NextResponse.json(
          {
            success: false,
            error: "Each menu item must have menuItemId and selectedType",
          },
          { status: 400 },
        )
      }

      // Validate menu item exists
      const menuItem = await MenuItemModel.findById(orderMenuItem.menuItemId)
      if (!menuItem) {
        return NextResponse.json(
          {
            success: false,
            error: `Menu item with ID ${orderMenuItem.menuItemId} not found`,
          },
          { status: 400 },
        )
      }

      // Validate selectedType
      const validTypes = ["only_dish", "only_dish_with_chart", "dish_without_chart", "dish_with_chart"]
      if (!validTypes.includes(orderMenuItem.selectedType)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid selectedType for menu item",
          },
          { status: 400 },
        )
      }

      const ingredients = []
      for (const ing of menuItem.ingredients) {
        const ingredientDetails = await IngredientModel.findById(ing.ingredientId)

        const singleItems = ing.singleItems || {
          onlyDishQuantity: ing.onlyDishQuantity,
          onlyDishWithChartQuantity: ing.onlyDishWithChartQuantity,
          dishWithoutChartQuantity: ing.dishWithoutChartQuantity,
          dishWithChartQuantity: ing.dishWithChartQuantity,
        }

        const multiItems = ing.multiItems || {
          onlyDishQuantity: ing.onlyDishQuantity * 0.7,
          onlyDishWithChartQuantity: ing.onlyDishWithChartQuantity * 0.7,
          dishWithoutChartQuantity: ing.dishWithoutChartQuantity * 0.7,
          dishWithChartQuantity: ing.dishWithChartQuantity * 0.7,
        }

        ingredients.push({
          ingredientId: ing.ingredientId,
          ingredientName: ingredientDetails?.name || "Unknown Ingredient",
          unit: ingredientDetails?.unit || "piece",
          // Store both single and multi values instead of just quantityPer100
          singleItems,
          multiItems,
          // Keep legacy field for backward compatibility
          quantityPer100: getQuantityForType(singleItems, orderMenuItem.selectedType),
        })
      }

      processedMenuItems.push({
        menuItemId: orderMenuItem.menuItemId,
        selectedType: orderMenuItem.selectedType,
        name: menuItem.name,
        category: menuItem.category,
        type: menuItem.type,
        ingredients,
      })
    }

    const orderData: Omit<Order, "_id" | "createdAt" | "updatedAt"> = {
      clientId: body.clientId || undefined,
      clientSnapshot: body.clientSnapshot || undefined,
      numberOfPeople: body.numberOfPeople,
      address: body.address.trim(),
      orderType: body.orderType.trim(),
      orderDate: new Date(body.orderDate),
      orderTime: body.orderTime.trim(),
      menuItems: processedMenuItems,
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

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500 },
    )
  }
}

// Helper function to get quantity based on selected type
function getQuantityForType(
  ingredient: {
    onlyDishQuantity: number
    onlyDishWithChartQuantity: number
    dishWithoutChartQuantity: number
    dishWithChartQuantity: number
  },
  type: "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart",
): number {
  switch (type) {
    case "only_dish":
      return ingredient.onlyDishQuantity
    case "only_dish_with_chart":
      return ingredient.onlyDishWithChartQuantity
    case "dish_without_chart":
      return ingredient.dishWithoutChartQuantity
    case "dish_with_chart":
      return ingredient.dishWithChartQuantity
    default:
      return ingredient.onlyDishQuantity
  }
}
