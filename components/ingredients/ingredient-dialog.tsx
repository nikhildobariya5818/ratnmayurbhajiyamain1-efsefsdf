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
import { Scale, Beaker, Package } from "lucide-react"
import type { Ingredient } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"

interface IngredientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient?: Ingredient | null
  onSubmit: (data: Omit<Ingredient, "_id" | "createdAt" | "updatedAt">) => void
}

const units = [
  { value: "gram", label: "Gram (g)", icon: Scale, description: "For small quantities" },
  { value: "kg", label: "Kilogram (kg)", icon: Scale, description: "For larger quantities" },
  { value: "ml", label: "Milliliter (ml)", icon: Beaker, description: "For small liquid volumes" },
  { value: "L", label: "Liter (L)", icon: Beaker, description: "For larger liquid volumes" },
  { value: "piece", label: "Piece", icon: Package, description: "For countable items" },
  { value: "જબલા", label: "જબલા", icon: Package, description: "Traditional Gujarati measurement unit" },
] as const

export function IngredientDialog({ open, onOpenChange, ingredient, onSubmit }: IngredientDialogProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    unit: "" as "gram" | "kg" | "ml" | "L" | "piece" | "જબલા" | "",
    isDefault: false,
    defaultValue: 12,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        unit: ingredient.unit,
        isDefault: ingredient.isDefault || false,
        defaultValue: ingredient.defaultValue || 12,
      })
    } else {
      setFormData({
        name: "",
        unit: "",
        isDefault: false,
        defaultValue: 12,
      })
    }
    setErrors({})
  }, [ingredient, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Ingredient name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Ingredient name must be at least 2 characters"
    }

    if (!formData.unit) {
      newErrors.unit = "Unit is required"
    }

    if (formData.isDefault && (!formData.defaultValue || formData.defaultValue <= 0)) {
      newErrors.defaultValue = "Default value must be greater than 0"
    }

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
      unit: formData.unit as "gram" | "kg" | "ml" | "L" | "piece" | "જબલા",
      isDefault: formData.isDefault,
      defaultValue: formData.isDefault ? formData.defaultValue : undefined,
    })
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{ingredient ? t.edit + " " + t.ingredients : t.add + " " + t.ingredients}</DialogTitle>
          <DialogDescription>
            {ingredient ? "Update ingredient information below." : "Enter ingredient name and measurement unit."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t.ingredientName} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Besan (Gram Flour)"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unit">{t.unit} *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger className={errors.unit ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => {
                    const Icon = unit.icon
                    return (
                      <SelectItem key={unit.value} value={unit.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{unit.label}</div>
                            <div className="text-xs text-muted-foreground">{unit.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.unit && <p className="text-sm text-destructive">{errors.unit}</p>}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => handleInputChange("isDefault", checked === true)}
                />
                <Label htmlFor="isDefault" className="font-medium cursor-pointer">
                  Mark as Default Ingredient
                </Label>
              </div>

              {formData.isDefault && (
                <div className="grid gap-2 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Label htmlFor="defaultValue">Default Quantity (per order)</Label>
                  <Input
                    id="defaultValue"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.defaultValue}
                    onChange={(e) => handleInputChange("defaultValue", Number.parseFloat(e.target.value) || 0)}
                    className={errors.defaultValue ? "border-destructive" : ""}
                  />
                  {errors.defaultValue && <p className="text-sm text-destructive">{errors.defaultValue}</p>}
                  <p className="text-xs text-muted-foreground">
                    This value will be added when 3+ menu items share this ingredient
                  </p>
                </div>
              )}
            </div>

            {formData.unit && (
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Unit Information</h4>
                <p className="text-xs text-muted-foreground">
                  {units.find((u) => u.value === formData.unit)?.description}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit">{ingredient ? t.edit + " " + t.ingredients : t.add + " " + t.ingredients}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
