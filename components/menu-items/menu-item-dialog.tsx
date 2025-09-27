"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Scale, Beaker, Package, Users, User } from "lucide-react"
import type { MenuItem, Ingredient, MenuItemIngredient } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"

interface MenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuItem?: MenuItem | null
  ingredients: Ingredient[]
  onSubmit: (data: Omit<MenuItem, "_id" | "createdAt" | "updatedAt">) => void
}

const menuItemTypes = [
  { value: "only_dish", label: "Only bhajiya (KG)" },
  { value: "only_dish_with_chart", label: "Dish with Only bhajiya" },
  { value: "dish_without_chart", label: "Dish have no Chart" },
  { value: "dish_with_chart", label: "Dish have Chart & Bhajiya" },
] as const

const unitIcons = {
  gram: Scale,
  kg: Scale,
  ml: Beaker,
  L: Beaker,
  piece: Package,
  જબલા: Package,
}

export function MenuItemDialog({ open, onOpenChange, menuItem, ingredients, onSubmit }: MenuItemDialogProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "" as "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart" | "",
    ingredients: [] as MenuItemIngredient[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (menuItem) {
      const updatedIngredients = menuItem.ingredients.map((ing) => {
        // If the ingredient already has dual values, use them
        if (ing.singleItems && ing.multiItems) {
          return ing
        }
        // Otherwise, migrate from legacy format
        return {
          ...ing,
          singleItems: {
            onlyDishQuantity: ing.onlyDishQuantity,
            onlyDishWithChartQuantity: ing.onlyDishWithChartQuantity,
            dishWithoutChartQuantity: ing.dishWithoutChartQuantity,
            dishWithChartQuantity: ing.dishWithChartQuantity,
          },
          multiItems: {
            onlyDishQuantity: ing.onlyDishQuantity * 0.7, // Default to 70% for multi items
            onlyDishWithChartQuantity: ing.onlyDishWithChartQuantity * 0.7,
            dishWithoutChartQuantity: ing.dishWithoutChartQuantity * 0.7,
            dishWithChartQuantity: ing.dishWithChartQuantity * 0.7,
          },
        }
      })

      setFormData({
        name: menuItem.name,
        category: menuItem.category,
        type: menuItem.type,
        ingredients: updatedIngredients,
      })
    } else {
      setFormData({
        name: "",
        category: "",
        type: "",
        ingredients: [],
      })
    }
    setErrors({})
  }, [menuItem, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Menu item name is required"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    if (!formData.type) {
      newErrors.type = "Type is required"
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required"
    }

    formData.ingredients.forEach((ing, index) => {
      if (!ing.ingredientId) {
        newErrors[`ingredient_${index}`] = "Ingredient is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit({
      name: formData.name.trim(),
      category: formData.category.trim(),
      type: formData.type as "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart",
      ingredients: formData.ingredients,
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          ingredientId: "",
          singleItems: {
            onlyDishQuantity: 0,
            onlyDishWithChartQuantity: 0,
            dishWithoutChartQuantity: 0,
            dishWithChartQuantity: 0,
          },
          multiItems: {
            onlyDishQuantity: 0,
            onlyDishWithChartQuantity: 0,
            dishWithoutChartQuantity: 0,
            dishWithChartQuantity: 0,
          },
          // Legacy fields for backward compatibility
          onlyDishQuantity: 0,
          onlyDishWithChartQuantity: 0,
          dishWithoutChartQuantity: 0,
          dishWithChartQuantity: 0,
        },
      ],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
    // Clear related errors
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`ingredient_${index}`]
      return newErrors
    })
  }

  const updateIngredient = (index: number, field: keyof MenuItemIngredient, value: string | number | any) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => {
        if (i === index) {
          const updated = { ...ing, [field]: value }

          if (field === "singleItems" || field === "multiItems") {
            // Use single items values as the primary legacy values
            if (field === "singleItems") {
              updated.onlyDishQuantity = value.onlyDishQuantity
              updated.onlyDishWithChartQuantity = value.onlyDishWithChartQuantity
              updated.dishWithoutChartQuantity = value.dishWithoutChartQuantity
              updated.dishWithChartQuantity = value.dishWithChartQuantity
            }
          }

          return updated
        }
        return ing
      }),
    }))
    // Clear related errors
    if (field === "ingredientId") {
      setErrors((prev) => ({ ...prev, [`ingredient_${index}`]: "" }))
    }
  }

  const updateQuantityValue = (
    index: number,
    valueType: "singleItems" | "multiItems",
    quantityType:
      | "onlyDishQuantity"
      | "onlyDishWithChartQuantity"
      | "dishWithoutChartQuantity"
      | "dishWithChartQuantity",
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => {
        if (i === index) {
          const updated = {
            ...ing,
            [valueType]: {
              ...ing[valueType],
              [quantityType]: value,
            },
          }

          // Update legacy fields when single items change
          if (valueType === "singleItems") {
            updated[quantityType] = value
          }

          return updated
        }
        return ing
      }),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{menuItem ? t.edit + " " + t.menuItems : t.add + " " + t.menuItems}</DialogTitle>
          <DialogDescription>
            {menuItem
              ? "Update menu item information below."
              : "Enter menu item information and ingredient quantities for each dish type."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t.menuItemName} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Onion Bhajiya"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="e.g., Traditional, Special, Healthy"
                  className={errors.category ? "border-destructive" : ""}
                />
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Default Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select menu item type" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItemTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-lg font-semibold">Ingredients (per 100 people)</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure different values for single item orders vs multi-item orders
                  </p>
                </div>
                <Button type="button" onClick={addIngredient} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Ingredient
                </Button>
              </div>

              {formData.ingredients.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">No ingredients added yet</p>
                    <Button type="button" onClick={addIngredient} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add First Ingredient
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {formData.ingredients.map((ingredient, index) => {
                    const selectedIngredient = ingredients.find((ing) => ing._id === ingredient.ingredientId)
                    const Icon = selectedIngredient ? unitIcons[selectedIngredient.unit] : Package

                    return (
                      <Card key={index} className="border-2">
                        <CardContent className="p-4">
                          <div className="grid gap-4">
                            {/* Ingredient Selection Row */}
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <Label className="text-sm font-medium mb-2 block">Ingredient</Label>
                                <Select
                                  value={ingredient.ingredientId}
                                  onValueChange={(value) => updateIngredient(index, "ingredientId", value)}
                                >
                                  <SelectTrigger className={errors[`ingredient_${index}`] ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select ingredient" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ingredients.map((ing) => {
                                      const IngIcon = unitIcons[ing.unit]
                                      return (
                                        <SelectItem key={ing._id} value={ing._id!}>
                                          <div className="flex items-center gap-2">
                                            <IngIcon className="h-4 w-4" />
                                            <span>{ing.name}</span>
                                            <Badge variant="outline" className="ml-auto">
                                              {ing.unit}
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      )
                                    })}
                                  </SelectContent>
                                </Select>
                                {errors[`ingredient_${index}`] && (
                                  <p className="text-sm text-destructive mt-1">{errors[`ingredient_${index}`]}</p>
                                )}
                              </div>
                              <Button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <Tabs defaultValue="single" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="single" className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Single Item Orders
                                </TabsTrigger>
                                <TabsTrigger value="multi" className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  Multi Item Orders
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="single" className="mt-4">
                                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                  <p className="text-sm text-blue-800">
                                    <strong>Single Item Values:</strong> Used when an order contains only one menu item
                                    that uses this ingredient
                                  </p>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <Label className="text-sm font-medium text-blue-600 mb-2 block">{t.onlyDish}</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.singleItems?.onlyDishQuantity || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "singleItems",
                                          "onlyDishQuantity",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-sm font-medium text-green-600 mb-2 block">
                                      {t.onlyDishWithChart}
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.singleItems?.onlyDishWithChartQuantity || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "singleItems",
                                          "onlyDishWithChartQuantity",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-sm font-medium text-orange-600 mb-2 block">
                                      {t.dishWithoutChart}
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.singleItems?.dishWithoutChartQuantity || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "singleItems",
                                          "dishWithoutChartQuantity",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-sm font-medium text-purple-600 mb-2 block">
                                      {t.dishWithChart}
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.singleItems?.dishWithChartQuantity || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "singleItems",
                                          "dishWithChartQuantity",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="multi" className="mt-4">
                                <div className="bg-orange-50 p-3 rounded-lg mb-4">
                                  <p className="text-sm text-orange-800">
                                    <strong>Multi Item Values:</strong> Used when an order contains multiple menu items
                                    that use this ingredient
                                  </p>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <Label className="text-sm font-medium text-blue-600 mb-2 block">{t.onlyDish}</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.multiItems?.onlyDishQuantity || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "multiItems",
                                          "onlyDishQuantity",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-sm font-medium text-green-600 mb-2 block">
                                      {t.onlyDishWithChart}
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.multiItems?.onlyDishWithChartQuantity || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "multiItems",
                                          "onlyDishWithChartQuantity",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-sm font-medium text-orange-600 mb-2 block">
                                      {t.dishWithoutChart}
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.multiItems?.dishWithoutChartQuantity || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "multiItems",
                                          "dishWithoutChartQuantity",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-sm font-medium text-purple-600 mb-2 block">
                                      {t.dishWithChart}
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.multiItems?.dishWithChartQuantity || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "multiItems",
                                          "dishWithChartQuantity",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {errors.ingredients && <p className="text-sm text-destructive">{errors.ingredients}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit">{menuItem ? t.edit + " " + t.menuItems : t.add + " " + t.menuItems}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
