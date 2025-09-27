import { type NextRequest, NextResponse } from "next/server"
import { IngredientModel } from "@/lib/models/ingredient"
import type { Ingredient } from "@/lib/types"

// GET /api/ingredients - Get all ingredients or search/filter ingredients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const unit = searchParams.get("unit")

    let ingredients: Ingredient[]

    if (search) {
      ingredients = await IngredientModel.search(search)
    } else if (unit) {
      ingredients = await IngredientModel.findByUnit(unit)
    } else {
      ingredients = await IngredientModel.findAll()
    }

    return NextResponse.json({
      success: true,
      data: ingredients,
    })
  } catch (error) {
    console.error("Error fetching ingredients:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch ingredients",
      },
      { status: 500 },
    )
  }
}

// POST /api/ingredients - Create a new ingredient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.unit) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and unit are required",
        },
        { status: 400 },
      )
    }

    // Validate unit
    const validUnits = ["gram", "kg", "ml", "L", "piece", "જબલા"]
    if (!validUnits.includes(body.unit)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid unit. Must be one of: gram, kg, ml, L, piece, જબલા",
        },
        { status: 400 },
      )
    }

    const ingredientData: Omit<Ingredient, "_id" | "createdAt" | "updatedAt"> = {
      name: body.name.trim(),
      unit: body.unit,
    }

    const ingredient = await IngredientModel.create(ingredientData)

    return NextResponse.json(
      {
        success: true,
        data: ingredient,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating ingredient:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create ingredient",
      },
      { status: 500 },
    )
  }
}
