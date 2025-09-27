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
import { AlertTriangle, Users, Calendar, MapPin } from "lucide-react"
import type { Order } from "@/lib/types"

interface DeleteOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onConfirm: () => void
}

// Mock clients for display
const mockClients = [
  {
    _id: "1",
    name: "Rajesh Patel",
    phone: "+91 98765 43210",
  },
  {
    _id: "2",
    name: "Priya Shah",
    phone: "+91 87654 32109",
  },
]

export function DeleteOrderDialog({ open, onOpenChange, order, onConfirm }: DeleteOrderDialogProps) {
  if (!order) return null

  const client = order.clientId ? mockClients.find((c) => c._id === order.clientId) : order.clientSnapshot

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Order
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this order for <strong>{client?.name}</strong>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Order Details:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{client?.name}</strong> • {order.numberOfPeople} people
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(order.orderDate).toLocaleDateString()} at {order.orderTime}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm">{order.address}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">{order.orderType}</Badge>
                <Badge variant="outline">{order.menuItems.length} menu items</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Warning:</p>
            <p className="text-sm text-destructive/80">
              This will permanently delete the order and all associated data. Make sure you have generated any required
              reports before deleting.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
