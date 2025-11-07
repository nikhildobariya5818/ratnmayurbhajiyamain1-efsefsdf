import { type NextRequest, NextResponse } from "next/server"
import { IngredientModel } from "@/lib/models/ingredient"

// GET /api/ingredients/[id] - Get a specific ingredient
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ingredient = await IngredientModel.findById(params.id)

    if (!ingredient) {
      return NextResponse.json(
        {
          success: false,
          error: "Ingredient not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: ingredient,
    })
  } catch (error) {
    console.error("Error fetching ingredient:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch ingredient",
      },
      { status: 500 },
    )
  }
}

// PUT /api/ingredients/[id] - Update a specific ingredient
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updateData: any = {
      name: body.name.trim(),
      unit: body.unit,
    }

    // Add default ingredient fields if marking as default
    if (body.isDefault !== undefined) {
      updateData.isDefault = body.isDefault
      if (body.isDefault) {
        updateData.defaultValue = body.defaultValue || 12
        updateData.incrementThreshold = body.incrementThreshold || 3
        updateData.incrementAmount = body.incrementAmount || 3
      }
    }

    const ingredient = await IngredientModel.update(params.id, updateData)

    if (!ingredient) {
      return NextResponse.json(
        {
          success: false,
          error: "Ingredient not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: ingredient,
    })
  } catch (error) {
    console.error("Error updating ingredient:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update ingredient",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/ingredients/[id] - Delete a specific ingredient
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await IngredientModel.delete(params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Ingredient not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Ingredient deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting ingredient:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete ingredient",
      },
      { status: 500 },
    )
  }
}
