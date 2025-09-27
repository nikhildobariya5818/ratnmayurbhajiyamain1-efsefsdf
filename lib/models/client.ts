import { ObjectId } from "mongodb"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Client } from "@/lib/types"

export class ClientModel {
  static async create(clientData: Omit<Client, "_id" | "createdAt" | "updatedAt">): Promise<Client> {
    const db = await getDatabase()
    const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

    const now = new Date()
    const client: Omit<Client, "_id"> = {
      ...clientData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(client as Client)
    return { ...client, _id: result.insertedId.toString() }
  }

  static async findAll(): Promise<Client[]> {
    const db = await getDatabase()
    const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

    const clients = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return clients.map((client) => ({
      ...client,
      _id: client._id?.toString(),
    }))
  }

  static async findById(id: string): Promise<Client | null> {
    const db = await getDatabase()
    const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

    const client = await collection.findOne({ _id: new ObjectId(id) })
    if (!client) return null

    return {
      ...client,
      _id: client._id.toString(),
    }
  }

  static async update(id: string, updateData: Partial<Omit<Client, "_id" | "createdAt">>): Promise<Client | null> {
    const db = await getDatabase()
    const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

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
    const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async search(searchTerm: string): Promise<Client[]> {
    const db = await getDatabase()
    const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

    const clients = await collection
      .find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
          { address: { $regex: searchTerm, $options: "i" } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray()

    return clients.map((client) => ({
      ...client,
      _id: client._id?.toString(),
    }))
  }
}
