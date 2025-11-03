import { type NextRequest, NextResponse } from "next/server"
import { MenuItemModel } from "@/lib/models/menu-item"
import { IngredientModel } from "@/lib/models/ingredient"
import type { MenuItem } from "@/lib/types"

// GET /api/menu-items - Get all menu items or search/filter menu items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const populate = searchParams.get("populate") === "true"

    let menuItems: MenuItem[]

    if (search) {
      menuItems = await MenuItemModel.search(search)
    } else if (category) {
      menuItems = await MenuItemModel.findByCategory(category)
    } else if (type) {
      menuItems = await MenuItemModel.findByType(type)
    } else {
      menuItems = await MenuItemModel.findAll()
    }

    // Populate ingredient details if requested
    if (populate) {
      for (const menuItem of menuItems) {
        for (const ingredient of menuItem.ingredients) {
          const ingredientDetails = await IngredientModel.findById(ingredient.ingredientId)
          if (ingredientDetails) {
            ingredient.ingredient = ingredientDetails
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: menuItems,
    })
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch menu items",
      },
      { status: 500 },
    )
  }
}

// POST /api/menu-items - Create a new menu item
export async function POST(request: NextRequest) {
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

    const validTypes = ["only_bhajiya_kg", "dish_with_only_bhajiya", "dish_have_no_chart", "dish_have_chart_bhajiya"]
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid type. Must be one of: only_bhajiya_kg, dish_with_only_bhajiya, dish_have_no_chart, dish_have_chart_bhajiya",
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

      if (!ingredient.quantities || typeof ingredient.quantities !== "object") {
        return NextResponse.json(
          {
            success: false,
            error: "Each ingredient must have a quantities object",
          },
          { status: 400 },
        )
      }

      const requiredQuantities = ["onlyBhajiyaKG", "dishWithOnlyBhajiya", "dishHaveNoChart", "dishHaveChartAndBhajiya"]
      for (const qty of requiredQuantities) {
        if (typeof ingredient.quantities[qty] !== "number" || ingredient.quantities[qty] < 0) {
          return NextResponse.json(
            {
              success: false,
              error: `quantities.${qty} must be a non-negative number`,
            },
            { status: 400 },
          )
        }
      }
    }

    const menuItemData: Omit<MenuItem, "_id" | "createdAt" | "updatedAt"> = {
      name: body.name.trim(),
      category: body.category.trim(),
      type: body.type,
      ingredients: body.ingredients.map((ing: any) => ({
        ingredientId: ing.ingredientId,
        isDefaultIngredient: ing.isDefaultIngredient || false,
        quantities: ing.quantities,
      })),
    }

    const menuItem = await MenuItemModel.create(menuItemData)

    return NextResponse.json(
      {
        success: true,
        data: menuItem,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create menu item",
      },
      { status: 500 },
    )
  }
}
