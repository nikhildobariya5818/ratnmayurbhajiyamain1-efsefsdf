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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Scale, Beaker, Package } from "lucide-react"
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
  { value: "only_bhajiya_kg", label: "Only bhajiya (KG)" },
  { value: "dish_with_only_bhajiya", label: "Dish with Only bhajiya" },
  { value: "dish_have_no_chart", label: "Dish have no Chart" },
  { value: "dish_have_chart_bhajiya", label: "Dish have Chart & Bhajiya" },
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
    type: "" as "only_bhajiya_kg" | "dish_with_only_bhajiya" | "dish_have_no_chart" | "dish_have_chart_bhajiya" | "",
    ingredients: [] as MenuItemIngredient[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name,
        category: menuItem.category,
        type: menuItem.type as any,
        ingredients: menuItem.ingredients.map((ing) => ({
          ...ing,
          isDefaultIngredient: ing.isDefaultIngredient || false,
        })),
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
      if (!ing.isDefaultIngredient) {
        const hasQuantity =
          ing.quantities.onlyBhajiyaKG > 0 ||
          ing.quantities.dishWithOnlyBhajiya > 0 ||
          ing.quantities.dishHaveNoChart > 0 ||
          ing.quantities.dishHaveChartAndBhajiya > 0
        if (!hasQuantity) {
          newErrors[`quantity_${index}`] = "At least one quantity value is required for non-default ingredients"
        }
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
      type: formData.type as
        | "only_bhajiya_kg"
        | "dish_with_only_bhajiya"
        | "dish_have_no_chart"
        | "dish_have_chart_bhajiya",
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
          isDefaultIngredient: false,
          quantities: {
            onlyBhajiyaKG: 0,
            dishWithOnlyBhajiya: 0,
            dishHaveNoChart: 0,
            dishHaveChartAndBhajiya: 0,
          },
        },
      ],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`ingredient_${index}`]
      delete newErrors[`quantity_${index}`]
      return newErrors
    })
  }

  const updateIngredient = (index: number, field: keyof MenuItemIngredient, value: any) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => {
        if (i === index) {
          return { ...ing, [field]: value }
        }
        return ing
      }),
    }))
    if (field === "ingredientId") {
      setErrors((prev) => ({ ...prev, [`ingredient_${index}`]: "" }))
    }
  }

  const updateQuantityValue = (
    index: number,
    quantityType: "onlyBhajiyaKG" | "dishWithOnlyBhajiya" | "dishHaveNoChart" | "dishHaveChartAndBhajiya",
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => {
        if (i === index) {
          return {
            ...ing,
            quantities: {
              ...ing.quantities,
              [quantityType]: value,
            },
          }
        }
        return ing
      }),
    }))
    // Clear quantity error when user updates a value
    if (errors[`quantity_${index}`]) {
      setErrors((prev) => ({ ...prev, [`quantity_${index}`]: "" }))
    }
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
                    Default ingredients use fixed 12kg value. Non-default ingredients require quantity values.
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
                            {/* Ingredient Selection and Default Flag Row */}
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
                                            {ing.isDefault && (
                                              <Badge className="ml-2 bg-blue-100 text-blue-800">Default</Badge>
                                            )}
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

                              <div className="flex items-center gap-2 mt-6">
                                <Checkbox
                                  id={`default_${index}`}
                                  checked={ingredient.isDefaultIngredient}
                                  onCheckedChange={(checked) =>
                                    updateIngredient(index, "isDefaultIngredient", checked === true)
                                  }
                                />
                                <Label htmlFor={`default_${index}`} className="font-medium cursor-pointer text-sm">
                                  Default
                                </Label>
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

                            {!ingredient.isDefaultIngredient && (
                              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <Label className="text-sm font-semibold mb-4 block">Quantities (per 100 people)</Label>
                                <div className="grid grid-cols-4 gap-3">
                                  <div className="text-center">
                                    <Label className="text-xs font-medium text-blue-600 mb-2 block">
                                      Only Bhajiya (KG)
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.quantities?.onlyBhajiyaKG || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "onlyBhajiyaKG",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-xs font-medium text-green-600 mb-2 block">
                                      Dish w/ Only Bhajiya
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.quantities?.dishWithOnlyBhajiya || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "dishWithOnlyBhajiya",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-xs font-medium text-orange-600 mb-2 block">
                                      Dish No Chart
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.quantities?.dishHaveNoChart || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "dishHaveNoChart",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-center">
                                    <Label className="text-xs font-medium text-purple-600 mb-2 block">
                                      Dish w/ Chart & Bhajiya
                                    </Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={ingredient.quantities?.dishHaveChartAndBhajiya || 0}
                                      onChange={(e) =>
                                        updateQuantityValue(
                                          index,
                                          "dishHaveChartAndBhajiya",
                                          Number.parseFloat(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-center"
                                    />
                                  </div>
                                </div>
                                {errors[`quantity_${index}`] && (
                                  <p className="text-sm text-destructive mt-2">{errors[`quantity_${index}`]}</p>
                                )}
                              </div>
                            )}

                            {ingredient.isDefaultIngredient && selectedIngredient && (
                              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                <CardContent className="p-3">
                                  <p className="text-sm text-green-800 dark:text-green-200">
                                    <Badge className="bg-green-600 text-white mr-2">Default Ingredient</Badge>
                                    This ingredient will use the fixed default value of{" "}
                                    <span className="font-semibold">{selectedIngredient.defaultValue} kg</span> when
                                    added to orders.
                                  </p>
                                </CardContent>
                              </Card>
                            )}
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
