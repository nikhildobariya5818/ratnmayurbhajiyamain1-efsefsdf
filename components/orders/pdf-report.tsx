"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"

import type { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Users, ChefHat, FileText, Phone, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { OrderPDF } from "./pdf/OrderPDF" // <- your @react-pdf/renderer document
import { generatePDFFilename } from "@/lib/pdf-utils"

interface PDFReportProps {
  order: Order
  onClose?: () => void
}

export function PDFReport({ order, onClose }: PDFReportProps) {
  const client = order.client || order.clientSnapshot
  const scaledIngredients = order.menuItems.flatMap((item) =>
    item.ingredients.map((ing) => ({
      ...ing,
      ingredientName: ing.ingredientName,
      totalQuantity: ing.quantity * order.numberOfPeople,
      unit: ing.unit,
    })),
  )

  const pdfFilename = generatePDFFilename(client?.name || "Unknown_Client", order.orderDate)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Catering Order Report</h1>
        <p className="text-gray-600 mt-2">Professional Catering Management System</p>
      </div>

      <div className="space-y-6">
        {/* Client Information */}
        <Card className="border-2">
          <CardHeader className="pb-3 bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <p className="text-sm font-semibold">{client?.name || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Phone:</span>
                <p className="text-sm font-semibold">{client?.phone || "Not provided"}</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Address:</span>
              <p className="text-sm">{client?.address || "Not provided"}</p>
            </div>
            {client?.reference && (
              <div>
                <span className="text-sm font-medium text-gray-600">Reference:</span>
                <p className="text-sm">{client.reference}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card className="border-2">
          <CardHeader className="pb-3 bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Order Type:</span>
                <Badge variant="secondary" className="ml-2">
                  {order.orderType}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Number of People:</span>
                <span className="text-sm font-bold ml-2">{order.numberOfPeople}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Date:</span>
                <p className="text-sm font-semibold">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Time:</span>
                <p className="text-sm font-semibold">{order.orderTime}</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Event Address:</span>
              <p className="text-sm">{order.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="border-2">
          <CardHeader className="pb-3 bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Menu Items ({order.menuItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {order.menuItems.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      {item.selectedType ? item.selectedType.replace(/_/g, " ") : item.type.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs text-gray-600">{item.ingredients.length} ingredients</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ingredient Requirements */}
        <Card className="border-2">
          <CardHeader className="pb-3 bg-gray-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ingredient Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-0">
              {scaledIngredients.map((ingredient, index) => (
                <div
                  key={`${ingredient.ingredientName}-${index}`}
                  className={`flex justify-between items-center py-3 ${
                    index !== scaledIngredients.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <span className="text-sm font-medium">{ingredient.ingredientName}</span>
                  <span className="text-sm font-semibold">
                    {ingredient.totalQuantity} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        {(order.vehicleOwnerName || order.chefName || order.notes) && (
          <Card className="border-2">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {order.vehicleOwnerName && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Vehicle Owner:
                    </span>
                    <p className="text-sm font-semibold">{order.vehicleOwnerName}</p>
                  </div>
                  {order.phoneNumber && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Vehicle Phone:
                      </span>
                      <p className="text-sm font-semibold">{order.phoneNumber}</p>
                    </div>
                  )}
                </div>
              )}
              {order.vehicleNumberPlaceholder && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Vehicle Number:</span>
                  <p className="text-sm font-mono font-semibold">{order.vehicleNumberPlaceholder}</p>
                </div>
              )}
              {order.chefName && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <ChefHat className="h-4 w-4" />
                      Chef:
                    </span>
                    <p className="text-sm font-semibold">{order.chefName}</p>
                  </div>
                  {order.chefPhoneNumber && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Chef Phone:</span>
                      <p className="text-sm font-semibold">{order.chefPhoneNumber}</p>
                    </div>
                  )}
                </div>
              )}
              {order.addHelper && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Helper:</span>
                  <p className="text-sm font-semibold">{order.addHelper}</p>
                </div>
              )}
              {order.notes && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Notes:</span>
                  <p className="text-sm text-gray-700 mt-1">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t-2 border-gray-200 text-center text-sm text-gray-600">
        <p>
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
        <p className="mt-1">Catering Management System - Professional Order Report</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <PDFDownloadLink document={<OrderPDF order={order} />} fileName={pdfFilename}>
          {({ loading }) => (
            <Button className="flex items-center gap-2" disabled={loading}>
              <Download className="h-4 w-4" />
              {loading ? "Generating PDF..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>

        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  )
}
