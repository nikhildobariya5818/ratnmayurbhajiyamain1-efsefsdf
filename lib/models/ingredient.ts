import { ObjectId } from "mongodb"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Ingredient } from "@/lib/types"

export class IngredientModel {
  static async create(ingredientData: Omit<Ingredient, "_id" | "createdAt" | "updatedAt">): Promise<Ingredient> {
    const db = await getDatabase()
    const collection = db.collection<Ingredient>(COLLECTIONS.INGREDIENTS)

    const now = new Date()
    const ingredient: Omit<Ingredient, "_id"> = {
      ...ingredientData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(ingredient as Ingredient)
    return { ...ingredient, _id: result.insertedId.toString() }
  }

  static async findAll(): Promise<Ingredient[]> {
    const db = await getDatabase()
    const collection = db.collection<Ingredient>(COLLECTIONS.INGREDIENTS)

    const ingredients = await collection.find({}).sort({ name: 1 }).toArray()
    return ingredients.map((ingredient) => ({
      ...ingredient,
      _id: ingredient._id?.toString(),
    }))
  }

  static async findById(id: string): Promise<Ingredient | null> {
    const db = await getDatabase()
    const collection = db.collection<Ingredient>(COLLECTIONS.INGREDIENTS)

    const ingredient = await collection.findOne({ _id: new ObjectId(id) })
    if (!ingredient) return null

    return {
      ...ingredient,
      _id: ingredient._id.toString(),
    }
  }

  static async update(
    id: string,
    updateData: Partial<Omit<Ingredient, "_id" | "createdAt">>,
  ): Promise<Ingredient | null> {
    const db = await getDatabase()
    const collection = db.collection<Ingredient>(COLLECTIONS.INGREDIENTS)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) return null

    return {
      ...result,
      _id: result._id.toString(),
    }
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase()
    const collection = db.collection<Ingredient>(COLLECTIONS.INGREDIENTS)

    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async findByUnit(unit: string): Promise<Ingredient[]> {
    const db = await getDatabase()
    const collection = db.collection<Ingredient>(COLLECTIONS.INGREDIENTS)

    const ingredients = await collection.find({ unit }).sort({ name: 1 }).toArray()
    return ingredients.map((ingredient) => ({
      ...ingredient,
      _id: ingredient._id?.toString(),
    }))
  }

  static async search(searchTerm: string): Promise<Ingredient[]> {
    const db = await getDatabase()
    const collection = db.collection<Ingredient>(COLLECTIONS.INGREDIENTS)

    const ingredients = await collection
      .find({
        name: { $regex: searchTerm, $options: "i" },
      })
      .sort({ name: 1 })
      .toArray()

    return ingredients.map((ingredient) => ({
      ...ingredient,
      _id: ingredient._id?.toString(),
    }))
  }
}
