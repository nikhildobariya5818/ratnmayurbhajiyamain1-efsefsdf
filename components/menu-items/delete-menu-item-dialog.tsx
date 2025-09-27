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
import { AlertTriangle } from "lucide-react"
import type { MenuItem } from "@/lib/types"

interface DeleteMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuItem: MenuItem | null
  onConfirm: () => void
}

const typeColors = {
  only_dish: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  only_dish_with_chart: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  dish_without_chart: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  dish_with_chart: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

const typeLabels = {
  only_dish: "Only bhajiya (KG)",
  only_dish_with_chart: "Dish with Only bhajiya",
  dish_without_chart: "Dish have no Chart",
  dish_with_chart: "Dish have Chart & Bhajiya",
}

export function DeleteMenuItemDialog({ open, onOpenChange, menuItem, onConfirm }: DeleteMenuItemDialogProps) {
  if (!menuItem) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Menu Item
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{menuItem.name}</strong>? This action cannot be undone and may
            affect existing orders that use this menu item.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Menu Item Details:</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{menuItem.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Category:</span>
                <Badge variant="outline">{menuItem.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type:</span>
                <Badge className={typeColors[menuItem.type]} variant="secondary">
                  {typeLabels[menuItem.type]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ingredients:</span>
                <span className="text-sm">{menuItem.ingredients.length} items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">{new Date(menuItem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Warning:</p>
            <p className="text-sm text-destructive/80">
              Deleting this menu item may affect existing orders. Make sure to check for any active orders using this
              item.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete Menu Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
