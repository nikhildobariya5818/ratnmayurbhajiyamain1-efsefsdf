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
import { Scale, Beaker, Package } from "lucide-react"
import type { MenuItem, Ingredient } from "@/lib/types"

interface ViewMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuItem: MenuItem | null
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

const unitIcons = {
  gram: Scale,
  kg: Scale,
  ml: Beaker,
  L: Beaker,
  piece: Package,
}

// Mock ingredients for display (would come from props in real app)
const mockIngredients: Ingredient[] = [
  { _id: "1", name: "Besan (Gram Flour)", unit: "kg", createdAt: new Date(), updatedAt: new Date() },
  { _id: "2", name: "Onions", unit: "kg", createdAt: new Date(), updatedAt: new Date() },
  { _id: "3", name: "Green Chilies", unit: "gram", createdAt: new Date(), updatedAt: new Date() },
  { _id: "4", name: "Turmeric Powder", unit: "gram", createdAt: new Date(), updatedAt: new Date() },
  { _id: "5", name: "Cooking Oil", unit: "L", createdAt: new Date(), updatedAt: new Date() },
  { _id: "6", name: "Salt", unit: "gram", createdAt: new Date(), updatedAt: new Date() },
  { _id: "7", name: "Coriander Seeds", unit: "gram", createdAt: new Date(), updatedAt: new Date() },
  { _id: "8", name: "Cumin Seeds", unit: "gram", createdAt: new Date(), updatedAt: new Date() },
  { _id: "9", name: "Potatoes", unit: "kg", createdAt: new Date(), updatedAt: new Date() },
  { _id: "10", name: "Spinach", unit: "kg", createdAt: new Date(), updatedAt: new Date() },
]

export function ViewMenuItemDialog({ open, onOpenChange, menuItem }: ViewMenuItemDialogProps) {
  if (!menuItem) return null

  const ingredientsWithDetails = menuItem.ingredients.map((ing) => ({
    ...ing,
    ingredient: mockIngredients.find((i) => i._id === ing.ingredientId),
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{menuItem.name}</DialogTitle>
          <DialogDescription>Menu item details and recipe information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
                <span className="text-sm font-medium">Total Ingredients:</span>
                <span className="text-sm">{menuItem.ingredients.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">{new Date(menuItem.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recipe */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recipe (per 100 people)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ingredientsWithDetails.map((ing, index) => {
                  const ingredient = ing.ingredient
                  if (!ingredient) return null

                  const Icon = unitIcons[ingredient.unit]

                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{ingredient.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {ing.quantityPer100} {ingredient.unit}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Scaling Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Scaling Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Base Recipe:</strong> Quantities shown are for 100 people
                </p>
                <p>
                  <strong>Scaling Formula:</strong> Final Quantity = (Base Quantity × Number of People) ÷ 100
                </p>
                <p>
                  <strong>Example:</strong> For 150 people, multiply each quantity by 1.5
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
