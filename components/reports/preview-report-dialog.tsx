"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Calendar, ChefHat, Truck, FileText, Download } from "lucide-react"
import type { Order } from "@/lib/types"
import { scaleIngredients } from "@/lib/database"

interface PreviewReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onGenerate: (order: Order) => void
}

// Mock clients for display
const mockClients = [
  {
    _id: "1",
    name: "Rajesh Patel",
    phone: "+91 98765 43210",
    address: "123 Gandhi Road, Ahmedabad, Gujarat 380001",
  },
  {
    _id: "2",
    name: "Priya Shah",
    phone: "+91 87654 32109",
    address: "456 Nehru Street, Surat, Gujarat 395001",
  },
]

export function PreviewReportDialog({ open, onOpenChange, order, onGenerate }: PreviewReportDialogProps) {
  if (!order) return null

  const client = order.clientId ? mockClients.find((c) => c._id === order.clientId) : order.clientSnapshot
  const scaledIngredients = scaleIngredients(order.menuItems, order.numberOfPeople)

  const handleGenerate = () => {
    onGenerate(order)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>PDF Report Preview</DialogTitle>
          <DialogDescription>Preview of the PDF report that will be generated</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 bg-white p-6 rounded-lg border">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Catering Order Report</h1>
            <p className="text-gray-600 mt-1">Professional Bhajiya Catering Services</p>
          </div>

          {/* Client Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <p className="text-gray-900">{client?.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-900">{client?.phone}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Address:</span>
                <p className="text-gray-900">{client?.address}</p>
              </div>
              {client && "reference" in client && client.reference && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Reference:</span>
                  <p className="text-gray-900">{client.reference}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Order Type:</span>
                <p className="text-gray-900">{order.orderType}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Number of People:</span>
                <p className="text-gray-900 font-bold">{order.numberOfPeople}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p className="text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Time:</span>
                <p className="text-gray-900">{order.orderTime}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Event Address:</span>
                <p className="text-gray-900">{order.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Menu Items ({order.menuItems.length})
            </h2>
            <div className="space-y-2">
              {order.menuItems.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.ingredients.length} ingredients • {item.type.replace(/_/g, " ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Ingredient Calculations */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Ingredient Requirements (for {order.numberOfPeople} people)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">
                      Ingredient Name
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-right font-medium text-gray-700">
                      Required Quantity
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {scaledIngredients.map((ingredient) => (
                    <tr key={ingredient.ingredientId} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-gray-900">{ingredient.ingredientName}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                        {ingredient.totalQuantity}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{ingredient.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          {(order.vehicleOwnerName || order.chefName || order.notes) && (
            <>
              <Separator />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h2>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {order.vehicleOwnerName && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-700">Vehicle Owner:</span>
                      <span className="text-gray-900">{order.vehicleOwnerName}</span>
                      {order.phoneNumber && <span className="text-gray-600">({order.phoneNumber})</span>}
                    </div>
                  )}
                  {order.vehicleNumberPlaceholder && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Vehicle Number:</span>
                      <span className="text-gray-900 font-mono">{order.vehicleNumberPlaceholder}</span>
                    </div>
                  )}
                  {order.chefName && (
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-700">Chef:</span>
                      <span className="text-gray-900">{order.chefName}</span>
                      {order.chefPhoneNumber && <span className="text-gray-600">({order.chefPhoneNumber})</span>}
                    </div>
                  )}
                  {order.addHelper && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Helper:</span>
                      <span className="text-gray-900">{order.addHelper}</span>
                    </div>
                  )}
                  {order.notes && (
                    <div>
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="text-gray-900 mt-1">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
            <p>Catering Management System - Professional Bhajiya Services</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close Preview
          </Button>
          <Button type="button" onClick={handleGenerate}>
            <Download className="h-4 w-4 mr-2" />
            Generate & Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
