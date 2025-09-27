import { ObjectId } from "mongodb"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Order } from "@/lib/types"

export class OrderModel {
  static async create(orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">): Promise<Order> {
    const db = await getDatabase()
    const collection = db.collection<Order>(COLLECTIONS.ORDERS)

    const now = new Date()
    const order: Omit<Order, "_id"> = {
      ...orderData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(order as Order)
    return { ...order, _id: result.insertedId.toString() }
  }

  static async findAll(): Promise<Order[]> {
    const db = await getDatabase()
    const collection = db.collection<Order>(COLLECTIONS.ORDERS)

    const orders = await collection.find({}).sort({ orderDate: -1, createdAt: -1 }).toArray()
    return orders.map((order) => ({
      ...order,
      _id: order._id?.toString(),
    }))
  }

  static async findById(id: string): Promise<Order | null> {
    const db = await getDatabase()
    const collection = db.collection<Order>(COLLECTIONS.ORDERS)

    const order = await collection.findOne({ _id: new ObjectId(id) })
    if (!order) return null

    return {
      ...order,
      _id: order._id.toString(),
    }
  }

  static async update(id: string, updateData: Partial<Omit<Order, "_id" | "createdAt">>): Promise<Order | null> {
    const db = await getDatabase()
    const collection = db.collection<Order>(COLLECTIONS.ORDERS)

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
    const collection = db.collection<Order>(COLLECTIONS.ORDERS)

    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const db = await getDatabase()
    const collection = db.collection<Order>(COLLECTIONS.ORDERS)

    const orders = await collection
      .find({
        orderDate: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ orderDate: -1 })
      .toArray()

    return orders.map((order) => ({
      ...order,
      _id: order._id?.toString(),
    }))
  }

  static async findByClient(clientId: string): Promise<Order[]> {
    const db = await getDatabase()
    const collection = db.collection<Order>(COLLECTIONS.ORDERS)

    const orders = await collection.find({ clientId }).sort({ orderDate: -1 }).toArray()
    return orders.map((order) => ({
      ...order,
      _id: order._id?.toString(),
    }))
  }

  static async search(searchTerm: string): Promise<Order[]> {
    const db = await getDatabase()
    const collection = db.collection<Order>(COLLECTIONS.ORDERS)

    const orders = await collection
      .find({
        $or: [
          { orderType: { $regex: searchTerm, $options: "i" } },
          { address: { $regex: searchTerm, $options: "i" } },
          { "clientSnapshot.name": { $regex: searchTerm, $options: "i" } },
        ],
      })
      .sort({ orderDate: -1 })
      .toArray()

    return orders.map((order) => ({
      ...order,
      _id: order._id?.toString(),
    }))
  }
}
