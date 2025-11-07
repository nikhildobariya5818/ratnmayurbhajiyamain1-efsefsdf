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
import type { MenuItem } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { formatQuantityI18n } from "@/lib/format-quantity"

interface ViewMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuItem: MenuItem | null
}

const typeColors = {
  only_bhajiya_kg: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  dish_with_only_bhajiya: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  dish_have_no_chart: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  dish_have_chart_bhajiya: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

const typeLabels = {
  only_bhajiya_kg: "Only Bhajiya (KG)",
  dish_with_only_bhajiya: "Dish with Only Bhajiya",
  dish_have_no_chart: "Dish have no Chart",
  dish_have_chart_bhajiya: "Dish have Chart & Bhajiya",
}

const quantityFieldMap = {
  only_bhajiya_kg: "onlyBhajiyaKG",
  dish_with_only_bhajiya: "dishWithOnlyBhajiya",
  dish_have_no_chart: "dishHaveNoChart",
  dish_have_chart_bhajiya: "dishHaveChartAndBhajiya",
}

const unitIcons = {
  gram: Scale,
  kg: Scale,
  ml: Beaker,
  L: Beaker,
  piece: Package,
  જબલા: Package,
}

export function ViewMenuItemDialog({ open, onOpenChange, menuItem }: ViewMenuItemDialogProps) {
  const { t } = useLanguage()

  if (!menuItem) return null

  const quantityField = quantityFieldMap[menuItem.type as keyof typeof quantityFieldMap]

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
                {menuItem.ingredients.map((ing, index) => {
                  const ingredient = ing.ingredient
                  if (!ingredient) return null

                  const quantity = ing.quantities[quantityField as keyof typeof ing.quantities]

                  const Icon = unitIcons[ingredient.unit as keyof typeof unitIcons] || Package

                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{ingredient.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{formatQuantityI18n(quantity, t)}</span>
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
