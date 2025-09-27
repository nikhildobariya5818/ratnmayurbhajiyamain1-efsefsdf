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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Phone, ChefHat, Truck, FileText, Download } from "lucide-react"
import type { Order } from "@/lib/types"
import { scaleIngredients } from "@/lib/database"
import { pdf } from "@react-pdf/renderer"
import { useState } from "react"
import { OrderPDF } from "./pdf/OrderPDF"

interface ViewOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export function ViewOrderDialog({ open, onOpenChange, order }: ViewOrderDialogProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  if (!order) return null

  const client = order.client || order.clientSnapshot

  // Since saved orders have flattened ingredient structure with quantityPer100, use scaleIngredients instead
  const scaledIngredients = scaleIngredients(order.menuItems, order.numberOfPeople)

  // Remove the fallback logic since we're now using the correct function
  // const fallbackIngredients =
  //   scaledIngredients.length === 0 ? scaleIngredients(order.menuItems, order.numberOfPeople) : scaledIngredients

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true)
      const blob = await pdf(<OrderPDF order={order} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `order-${order._id}-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Complete order information and ingredient calculations</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Client Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{client?.name || "Not provided"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm">{client?.phone || "Not provided"}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium">Address:</span>
                <span className="text-sm text-right max-w-[60%]">{client?.address || "Not provided"}</span>
              </div>
              {client?.reference && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reference:</span>
                  <span className="text-sm">{client.reference}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Order Type:</span>
                <Badge variant="secondary">{order.orderType}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Number of People:</span>
                <span className="text-sm font-bold">{order.numberOfPeople}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Date & Time:</span>
                <span className="text-sm">
                  {new Date(order.orderDate).toLocaleDateString()} at {order.orderTime}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium">Event Address:</span>
                <span className="text-sm text-right max-w-[60%]">{order.address}</span>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Menu Items ({order.menuItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.menuItems.map((item, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default" className="text-xs">
                        {item.selectedType ? item.selectedType.replace(/_/g, " ") : item.type.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.ingredients.length} ingredients</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Default type: {item.type.replace(/_/g, " ")}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3 bg-muted/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Ingredient Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {scaledIngredients.length > 0 ? (
                  scaledIngredients.map((ingredient) => (
                    <div
                      key={ingredient.ingredientId}
                      className="flex justify-between items-center py-3 border-b border-muted last:border-b-0"
                    >
                      <span className="text-sm font-medium">{ingredient.ingredientName}</span>
                      <span className="text-sm font-semibold">
                        {ingredient.totalQuantity} {ingredient.unit}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No ingredient requirements calculated</p>
                    <p className="text-xs mt-1">Check menu item ingredient configuration</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {(order.vehicleOwnerName || order.chefName || order.notes) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.vehicleOwnerName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Vehicle Owner:
                    </span>
                    <span className="text-sm">{order.vehicleOwnerName}</span>
                  </div>
                )}
                {order.phoneNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Vehicle Phone:
                    </span>
                    <span className="text-sm">{order.phoneNumber}</span>
                  </div>
                )}
                {order.vehicleNumberPlaceholder && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Vehicle Number:</span>
                    <span className="text-sm font-mono">{order.vehicleNumberPlaceholder}</span>
                  </div>
                )}
                {order.chefName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <ChefHat className="h-4 w-4" />
                      Chef:
                    </span>
                    <span className="text-sm">{order.chefName}</span>
                  </div>
                )}
                {order.chefPhoneNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chef Phone:</span>
                    <span className="text-sm">{order.chefPhoneNumber}</span>
                  </div>
                )}
                {order.addHelper && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Helper:</span>
                    <span className="text-sm">{order.addHelper}</span>
                  </div>
                )}
                {order.notes && (
                  <div>
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 bg-transparent"
          >
            <Download className="h-4 w-4" />
            {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
