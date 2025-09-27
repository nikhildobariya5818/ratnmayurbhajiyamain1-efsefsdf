import { ObjectId } from "mongodb"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { MenuItem } from "@/lib/types"

export class MenuItemModel {
  static async create(menuItemData: Omit<MenuItem, "_id" | "createdAt" | "updatedAt">): Promise<MenuItem> {
    const db = await getDatabase()
    const collection = db.collection<MenuItem>(COLLECTIONS.MENU_ITEMS)

    const now = new Date()
    const menuItem: Omit<MenuItem, "_id"> = {
      ...menuItemData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(menuItem as MenuItem)
    return { ...menuItem, _id: result.insertedId.toString() }
  }

  static async findAll(): Promise<MenuItem[]> {
    const db = await getDatabase()
    const collection = db.collection<MenuItem>(COLLECTIONS.MENU_ITEMS)

    const menuItems = await collection.find({}).sort({ name: 1 }).toArray()
    return menuItems.map((item) => ({
      ...item,
      _id: item._id?.toString(),
    }))
  }

  static async findById(id: string): Promise<MenuItem | null> {
    const db = await getDatabase()
    const collection = db.collection<MenuItem>(COLLECTIONS.MENU_ITEMS)

    const menuItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!menuItem) return null

    return {
      ...menuItem,
      _id: menuItem._id.toString(),
    }
  }

  static async update(id: string, updateData: Partial<Omit<MenuItem, "_id" | "createdAt">>): Promise<MenuItem | null> {
    const db = await getDatabase()
    const collection = db.collection<MenuItem>(COLLECTIONS.MENU_ITEMS)

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
    const collection = db.collection<MenuItem>(COLLECTIONS.MENU_ITEMS)

    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async findByCategory(category: string): Promise<MenuItem[]> {
    const db = await getDatabase()
    const collection = db.collection<MenuItem>(COLLECTIONS.MENU_ITEMS)

    const menuItems = await collection.find({ category }).sort({ name: 1 }).toArray()
    return menuItems.map((item) => ({
      ...item,
      _id: item._id?.toString(),
    }))
  }

  static async findByType(type: string): Promise<MenuItem[]> {
    const db = await getDatabase()
    const collection = db.collection<MenuItem>(COLLECTIONS.MENU_ITEMS)

    const menuItems = await collection.find({ type }).sort({ name: 1 }).toArray()
    return menuItems.map((item) => ({
      ...item,
      _id: item._id?.toString(),
    }))
  }

  static async search(searchTerm: string): Promise<MenuItem[]> {
    const db = await getDatabase()
    const collection = db.collection<MenuItem>(COLLECTIONS.MENU_ITEMS)

    const menuItems = await collection
      .find({
        $or: [{ name: { $regex: searchTerm, $options: "i" } }, { category: { $regex: searchTerm, $options: "i" } }],
      })
      .sort({ name: 1 })
      .toArray()

    return menuItems.map((item) => ({
      ...item,
      _id: item._id?.toString(),
    }))
  }
}
