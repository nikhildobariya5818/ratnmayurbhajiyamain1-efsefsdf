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
import { AlertTriangle, Scale, Beaker, Package } from "lucide-react"
import type { Ingredient } from "@/lib/types"

interface DeleteIngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient: Ingredient | null
  onConfirm: () => void
}

const unitIcons = {
  gram: Scale,
  kg: Scale,
  ml: Beaker,
  L: Beaker,
  piece: Package,
  જબલા: Package,
}

const unitColors = {
  gram: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  kg: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ml: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  L: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  piece: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  જબલા: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

export function DeleteIngredientDialog({ open, onOpenChange, ingredient, onConfirm }: DeleteIngredientDialogProps) {
  if (!ingredient) return null

  const Icon = unitIcons[ingredient.unit]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Ingredient
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{ingredient.name}</strong>? This action cannot be undone and may
            affect existing menu items that use this ingredient.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Ingredient Details:</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{ingredient.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unit:</span>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <Badge className={unitColors[ingredient.unit]} variant="secondary">
                    {ingredient.unit}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Added:</span>
                <span className="text-sm">
                  {ingredient.createdAt ? new Date(ingredient.createdAt).toLocaleDateString() : "Unknown date"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Warning:</p>
            <p className="text-sm text-destructive/80">
              Deleting this ingredient may affect menu items that use it. Make sure to update any affected recipes.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete Ingredient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
