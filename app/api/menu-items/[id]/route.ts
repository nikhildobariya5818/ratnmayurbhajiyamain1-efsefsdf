import { type NextRequest, NextResponse } from "next/server"
import { MenuItemModel } from "@/lib/models/menu-item"
import { IngredientModel } from "@/lib/models/ingredient"

// GET /api/menu-items/[id] - Get a specific menu item
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const populate = searchParams.get("populate") === "true"

    const menuItem = await MenuItemModel.findById(params.id)

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Menu item not found",
        },
        { status: 404 },
      )
    }

    // Populate ingredient details if requested
    if (populate) {
      for (const ingredient of menuItem.ingredients) {
        const ingredientDetails = await IngredientModel.findById(ingredient.ingredientId)
        if (ingredientDetails) {
          ingredient.ingredient = ingredientDetails
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: menuItem,
    })
  } catch (error) {
    console.error("Error fetching menu item:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch menu item",
      },
      { status: 500 },
    )
  }
}

// PUT /api/menu-items/[id] - Update a specific menu item
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.category || !body.type || !body.ingredients || !Array.isArray(body.ingredients)) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, category, type, and ingredients array are required",
        },
        { status: 400 },
      )
    }

    // Validate type
    const validTypes = ["only_dish", "only_dish_with_chart", "dish_without_chart", "dish_with_chart"]
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid type. Must be one of: only_dish, only_dish_with_chart, dish_without_chart, dish_with_chart",
        },
        { status: 400 },
      )
    }

    // Validate ingredients
    if (body.ingredients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one ingredient is required",
        },
        { status: 400 },
      )
    }

    // Validate each ingredient
    for (const ingredient of body.ingredients) {
      if (!ingredient.ingredientId) {
        return NextResponse.json(
          {
            success: false,
            error: "Each ingredient must have an ingredientId",
          },
          { status: 400 },
        )
      }

      // Validate ingredient exists
      const ingredientExists = await IngredientModel.findById(ingredient.ingredientId)
      if (!ingredientExists) {
        return NextResponse.json(
          {
            success: false,
            error: `Ingredient with ID ${ingredient.ingredientId} not found`,
          },
          { status: 400 },
        )
      }

      // Validate quantities
      const requiredQuantities = [
        "onlyDishQuantity",
        "onlyDishWithChartQuantity",
        "dishWithoutChartQuantity",
        "dishWithChartQuantity",
      ]
      for (const qty of requiredQuantities) {
        if (typeof ingredient[qty] !== "number" || ingredient[qty] < 0) {
          return NextResponse.json(
            {
              success: false,
              error: `${qty} must be a non-negative number`,
            },
            { status: 400 },
          )
        }
      }
    }

    const updateData = {
      name: body.name.trim(),
      category: body.category.trim(),
      type: body.type,
      ingredients: body.ingredients,
    }

    const menuItem = await MenuItemModel.update(params.id, updateData)

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Menu item not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: menuItem,
    })
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update menu item",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/menu-items/[id] - Delete a specific menu item
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await MenuItemModel.delete(params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Menu item not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete menu item",
      },
      { status: 500 },
    )
  }
}
