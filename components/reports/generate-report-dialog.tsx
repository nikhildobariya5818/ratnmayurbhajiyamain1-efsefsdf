"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Users, Calendar, MapPin, Search, FileText } from "lucide-react"
import type { Order } from "@/lib/types"

interface GenerateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orders: (Order & { client?: any })[]
  onGenerate: (order: Order) => void
}

export function GenerateReportDialog({ open, onOpenChange, orders, onGenerate }: GenerateReportDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders.filter((order) => {
    const client = order.client || order.clientSnapshot
    const clientName = client?.name || ""
    return (
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleGenerate = () => {
    if (selectedOrder) {
      onGenerate(selectedOrder)
      setSelectedOrder(null)
      setSearchTerm("")
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedOrder(null)
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate PDF Report</DialogTitle>
          <DialogDescription>
            Select an order to generate a detailed PDF report with ingredient calculations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders by client, type, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Orders List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredOrders.map((order) => {
              const client = order.client || order.clientSnapshot
              const isSelected = selectedOrder?._id === order._id

              return (
                <Card
                  key={order._id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{client?.name || "New Client"}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{order.orderType}</Badge>
                          <Badge variant="outline">{order.menuItems.length} items</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {order.numberOfPeople}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {new Date(order.orderDate).toLocaleDateString()} at {order.orderTime}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground line-clamp-1">{order.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "No orders available for report generation"}
              </p>
            </div>
          )}

          {/* Selected Order Preview */}
          {selectedOrder && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary">Selected Order</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm">
                  <p>
                    <strong>Client:</strong> {(selectedOrder.client || selectedOrder.clientSnapshot)?.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedOrder.orderType}
                  </p>
                  <p>
                    <strong>People:</strong> {selectedOrder.numberOfPeople}
                  </p>
                  <p>
                    <strong>Menu Items:</strong> {selectedOrder.menuItems.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleGenerate} disabled={!selectedOrder}>
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
