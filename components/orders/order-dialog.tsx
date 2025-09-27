"use client"

import type React from "react"
import type { OrderDialogProps } from "./order-dialog.types" // Declare OrderDialogProps type

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
import { MultilingualInput } from "@/components/ui/multilingual-input"
import { MultilingualTextarea } from "@/components/ui/multilingual-textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Order, OrderMenuItem } from "@/lib/types"
import { scaleIngredientsWithDualValues } from "@/lib/database"
import { createClient } from "@/lib/api/clients"
import { FileText } from "lucide-react"

const orderTypes = [
  "Wedding",
  "Birthday Party",
  "Corporate Event",
  "Religious Function",
  "Anniversary",
  "Festival",
  "Other",
]

const menuItemTypes = [
  { value: "only_dish", label: "Only bhajiya (KG)" },
  { value: "only_dish_with_chart", label: "Dish with Only bhajiya" },
  { value: "dish_without_chart", label: "Dish have no Chart" },
  { value: "dish_with_chart", label: "Dish have Chart & Bhajiya" },
] as const

export function OrderDialog({
  open,
  onOpenChange,
  order,
  clients,
  menuItems,
  ingredients,
  onSubmit,
}: OrderDialogProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    clientSnapshot: {
      name: "",
      phone: "",
      address: "",
      reference: "",
    },
    numberOfPeople: 0,
    address: "",
    orderType: "",
    orderDate: "",
    orderTime: "",
    selectedMenuItems: [] as Array<{ menuItemId: string; selectedType: string }>,
    vehicleOwnerName: "",
    phoneNumber: "",
    vehicleNumberPlaceholder: "",
    time: "",
    chefName: "",
    chefPhoneNumber: "",
    addHelper: "",
    notes: "",
  })

  const [clientType, setClientType] = useState<"existing" | "new">("existing")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (order) {
      setFormData({
        clientId: order.clientId || "",
        clientSnapshot: order.clientSnapshot || {
          name: "",
          phone: "",
          address: "",
          reference: "",
        },
        numberOfPeople: order.numberOfPeople,
        address: order.address,
        orderType: order.orderType,
        orderDate: new Date(order.orderDate).toISOString().split("T")[0],
        orderTime: order.orderTime,
        selectedMenuItems: order.menuItems.map((item) => ({
          menuItemId: item.menuItemId,
          selectedType: item.selectedType || item.type,
        })),
        vehicleOwnerName: order.vehicleOwnerName || "",
        phoneNumber: order.phoneNumber || "",
        vehicleNumberPlaceholder: order.vehicleNumberPlaceholder || "",
        time: order.time || "",
        chefName: order.chefName || "",
        chefPhoneNumber: order.chefPhoneNumber || "",
        addHelper: order.addHelper || "",
        notes: order.notes || "",
      })
      setClientType(order.clientId ? "existing" : "new")
    } else {
      setFormData({
        clientId: "",
        clientSnapshot: {
          name: "",
          phone: "",
          address: "",
          reference: "",
        },
        numberOfPeople: 0,
        address: "",
        orderType: "",
        orderDate: "",
        orderTime: "",
        selectedMenuItems: [],
        vehicleOwnerName: "",
        phoneNumber: "",
        vehicleNumberPlaceholder: "",
        time: "",
        chefName: "",
        chefPhoneNumber: "",
        addHelper: "",
        notes: "",
      })
      setClientType("existing")
    }
    setErrors({})
  }, [order, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (clientType === "existing" && !formData.clientId) {
      newErrors.clientId = "Please select a client"
    }

    if (clientType === "new") {
      if (!formData.clientSnapshot.name.trim()) {
        newErrors.clientName = "Client name is required"
      }
      if (!formData.clientSnapshot.phone.trim()) {
        newErrors.clientPhone = "Client phone is required"
      }
      if (!formData.clientSnapshot.address.trim()) {
        newErrors.clientAddress = "Client address is required"
      }
    }

    if (!formData.numberOfPeople || formData.numberOfPeople <= 0) {
      newErrors.numberOfPeople = "Number of people must be greater than 0"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Event address is required"
    }

    if (!formData.orderType) {
      newErrors.orderType = "Order type is required"
    }

    if (!formData.orderDate) {
      newErrors.orderDate = "Order date is required"
    }

    if (!formData.orderTime) {
      newErrors.orderTime = "Order time is required"
    }

    if (formData.selectedMenuItems.length === 0) {
      newErrors.selectedMenuItems = "At least one menu item must be selected"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    let finalClientId = formData.clientId
    let finalClientSnapshot = formData.clientSnapshot

    if (clientType === "new" && formData.clientSnapshot.name.trim()) {
      try {
        const newClient = await createClient({
          name: formData.clientSnapshot.name.trim(),
          phone: formData.clientSnapshot.phone.trim(),
          address: formData.clientSnapshot.address.trim(),
          reference: formData.clientSnapshot.reference.trim() || undefined,
        })

        finalClientId = newClient._id!
        finalClientSnapshot = undefined
      } catch (error) {
        console.error("Failed to create client:", error)
        finalClientSnapshot = {
          name: formData.clientSnapshot.name.trim(),
          phone: formData.clientSnapshot.phone.trim(),
          address: formData.clientSnapshot.address.trim(),
          reference: formData.clientSnapshot.reference.trim() || undefined,
        }
      }
    }

    const orderMenuItems: OrderMenuItem[] = formData.selectedMenuItems.map(({ menuItemId, selectedType }) => {
      const menuItem = menuItems.find((item) => item._id === menuItemId)!
      return {
        menuItemId,
        name: menuItem.name,
        category: menuItem.category,
        type: menuItem.type,
        selectedType: selectedType as "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart",
        ingredients: menuItem.ingredients.map((ing) => {
          const ingredient = ingredients.find((i) => i._id === ing.ingredientId)!
          let quantityPer100: number
          switch (selectedType) {
            case "only_dish":
              quantityPer100 = ing.onlyDishQuantity
              break
            case "only_dish_with_chart":
              quantityPer100 = ing.onlyDishWithChartQuantity
              break
            case "dish_without_chart":
              quantityPer100 = ing.dishWithoutChartQuantity
              break
            case "dish_with_chart":
              quantityPer100 = ing.dishWithChartQuantity
              break
            default:
              quantityPer100 = ing.onlyDishQuantity
          }
          return {
            ingredientId: ing.ingredientId,
            ingredientName: ingredient.name,
            unit: ingredient.unit,
            quantityPer100,
          }
        }),
      }
    })

    const orderData: Omit<Order, "_id" | "createdAt" | "updatedAt"> = {
      clientId: finalClientId || undefined,
      clientSnapshot: finalClientSnapshot,
      numberOfPeople: formData.numberOfPeople,
      address: formData.address.trim(),
      orderType: formData.orderType,
      orderDate: new Date(formData.orderDate),
      orderTime: formData.orderTime,
      menuItems: orderMenuItems,
      vehicleOwnerName: formData.vehicleOwnerName.trim() || undefined,
      phoneNumber: formData.phoneNumber.trim() || undefined,
      vehicleNumberPlaceholder: formData.vehicleNumberPlaceholder.trim() || undefined,
      time: formData.time.trim() || undefined,
      chefName: formData.chefName.trim() || undefined,
      chefPhoneNumber: formData.chefPhoneNumber.trim() || undefined,
      addHelper: formData.addHelper.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    }

    onSubmit(orderData)
  }

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith("clientSnapshot.")) {
      const subField = field.replace("clientSnapshot.", "")
      setFormData((prev) => ({
        ...prev,
        clientSnapshot: {
          ...prev.clientSnapshot,
          [subField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleMenuItemToggle = (menuItemId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        const menuItem = menuItems.find((item) => item._id === menuItemId)!
        return {
          ...prev,
          selectedMenuItems: [...prev.selectedMenuItems, { menuItemId, selectedType: menuItem.type }],
        }
      } else {
        return {
          ...prev,
          selectedMenuItems: prev.selectedMenuItems.filter((item) => item.menuItemId !== menuItemId),
        }
      }
    })
    if (errors.selectedMenuItems) {
      setErrors((prev) => ({ ...prev, selectedMenuItems: "" }))
    }
  }

  const handleMenuItemTypeChange = (menuItemId: string, selectedType: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedMenuItems: prev.selectedMenuItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, selectedType } : item,
      ),
    }))
  }

  const scaledIngredients =
    formData.numberOfPeople > 0 && formData.selectedMenuItems.length > 0
      ? scaleIngredientsWithDualValues(
          formData.selectedMenuItems.map(({ menuItemId, selectedType }) => {
            const menuItem = menuItems.find((item) => item._id === menuItemId)!
            return {
              selectedType: selectedType as
                | "only_dish"
                | "only_dish_with_chart"
                | "dish_without_chart"
                | "dish_with_chart",
              ingredients: menuItem.ingredients.map((ing) => {
                const ingredient = ingredients.find((i) => i._id === ing.ingredientId)!

                return {
                  ingredientId: ing.ingredientId,
                  ingredientName: ingredient.name,
                  unit: ingredient.unit,
                  singleItems: ing.singleItems || {
                    onlyDishQuantity: ing.onlyDishQuantity,
                    onlyDishWithChartQuantity: ing.onlyDishWithChartQuantity,
                    dishWithoutChartQuantity: ing.dishWithoutChartQuantity,
                    dishWithChartQuantity: ing.dishWithChartQuantity,
                  },
                  multiItems: ing.multiItems || {
                    onlyDishQuantity: ing.onlyDishQuantity * 0.7,
                    onlyDishWithChartQuantity: ing.onlyDishWithChartQuantity * 0.7,
                    dishWithoutChartQuantity: ing.dishWithoutChartQuantity * 0.7,
                    dishWithChartQuantity: ing.dishWithChartQuantity * 0.7,
                  },
                }
              }),
            }
          }),
          formData.numberOfPeople,
        )
      : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Create New Order"}</DialogTitle>
          <DialogDescription>
            {order ? "Update order information below." : "Enter order information below."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="menu">Menu & Items</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-2">
                <Label>Client *</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="existing-client"
                      name="clientType"
                      checked={clientType === "existing"}
                      onChange={() => setClientType("existing")}
                    />
                    <Label htmlFor="existing-client">Existing Client</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="new-client"
                      name="clientType"
                      checked={clientType === "new"}
                      onChange={() => setClientType("new")}
                    />
                    <Label htmlFor="new-client">New Client</Label>
                  </div>
                </div>

                {clientType === "existing" ? (
                  <div>
                    <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
                      <SelectTrigger className={errors.clientId ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client._id} value={client._id!}>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-muted-foreground">{client.phone}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.clientId && <p className="text-sm text-destructive">{errors.clientId}</p>}
                  </div>
                ) : (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">New Client Information (will be added to database)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-2">
                        <Label htmlFor="client-name">Name *</Label>
                        <MultilingualInput
                          id="client-name"
                          value={formData.clientSnapshot.name}
                          onChange={(e) => handleInputChange("clientSnapshot.name", e.target.value)}
                          placeholder="Client name"
                          className={errors.clientName ? "border-destructive" : ""}
                        />
                        {errors.clientName && <p className="text-sm text-destructive">{errors.clientName}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="client-phone">Phone *</Label>
                        <MultilingualInput
                          id="client-phone"
                          value={formData.clientSnapshot.phone}
                          onChange={(e) => handleInputChange("clientSnapshot.phone", e.target.value)}
                          placeholder="+91 98765 43210"
                          className={errors.clientPhone ? "border-destructive" : ""}
                        />
                        {errors.clientPhone && <p className="text-sm text-destructive">{errors.clientPhone}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="client-address">Address *</Label>
                        <MultilingualTextarea
                          id="client-address"
                          value={formData.clientSnapshot.address}
                          onChange={(e) => handleInputChange("clientSnapshot.address", e.target.value)}
                          placeholder="Client address"
                          className={errors.clientAddress ? "border-destructive" : ""}
                          rows={2}
                        />
                        {errors.clientAddress && <p className="text-sm text-destructive">{errors.clientAddress}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="client-reference">Reference</Label>
                        <MultilingualInput
                          id="client-reference"
                          value={formData.clientSnapshot.reference}
                          onChange={(e) => handleInputChange("clientSnapshot.reference", e.target.value)}
                          placeholder="How did they find you?"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="numberOfPeople">Number of People *</Label>
                  <MultilingualInput
                    id="numberOfPeople"
                    type="number"
                    min="1"
                    value={formData.numberOfPeople}
                    onChange={(e) => handleInputChange("numberOfPeople", Number.parseInt(e.target.value) || 0)}
                    placeholder="100"
                    className={errors.numberOfPeople ? "border-destructive" : ""}
                  />
                  {errors.numberOfPeople && <p className="text-sm text-destructive">{errors.numberOfPeople}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="orderType">Order Type *</Label>
                  <Select value={formData.orderType} onValueChange={(value) => handleInputChange("orderType", value)}>
                    <SelectTrigger className={errors.orderType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.orderType && <p className="text-sm text-destructive">{errors.orderType}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="orderDate">Order Date *</Label>
                  <MultilingualInput
                    id="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => handleInputChange("orderDate", e.target.value)}
                    className={errors.orderDate ? "border-destructive" : ""}
                  />
                  {errors.orderDate && <p className="text-sm text-destructive">{errors.orderDate}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="orderTime">Order Time *</Label>
                  <MultilingualInput
                    id="orderTime"
                    type="time"
                    value={formData.orderTime}
                    onChange={(e) => handleInputChange("orderTime", e.target.value)}
                    className={errors.orderTime ? "border-destructive" : ""}
                  />
                  {errors.orderTime && <p className="text-sm text-destructive">{errors.orderTime}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Event Address *</Label>
                <MultilingualTextarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Complete event address"
                  className={errors.address ? "border-destructive" : ""}
                  rows={3}
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>
            </TabsContent>

            <TabsContent value="menu" className="space-y-4">
              <div className="grid gap-2">
                <Label>Menu Items *</Label>
                <div className="space-y-3">
                  {menuItems.map((menuItem) => {
                    const selectedItem = formData.selectedMenuItems.find((item) => item.menuItemId === menuItem._id!)
                    const isSelected = !!selectedItem

                    return (
                      <Card key={menuItem._id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                id={`menu-${menuItem._id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) => handleMenuItemToggle(menuItem._id!, checked as boolean)}
                              />
                              <div className="flex-1">
                                <Label htmlFor={`menu-${menuItem._id}`} className="font-medium cursor-pointer">
                                  {menuItem.name}
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{menuItem.category}</Badge>
                                  <Badge variant="secondary">{menuItem.ingredients.length} ingredients</Badge>
                                  <Badge variant="default">{menuItem.type.replace(/_/g, " ")}</Badge>
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="ml-6 grid gap-2">
                                <Label htmlFor={`type-${menuItem._id}`} className="text-sm">
                                  Select Type for this Order:
                                </Label>
                                <Select
                                  value={selectedItem.selectedType}
                                  onValueChange={(value) => handleMenuItemTypeChange(menuItem._id!, value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {menuItemTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                {errors.selectedMenuItems && <p className="text-sm text-destructive">{errors.selectedMenuItems}</p>}
              </div>

              {scaledIngredients.length > 0 && (
                <Card className="border-2">
                  <CardHeader className="pb-3 bg-muted/30">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Ingredient Requirements (for {formData.numberOfPeople} people)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {scaledIngredients.map((ingredient) => (
                        <div
                          key={ingredient.ingredientId}
                          className="flex justify-between items-center py-2 border-b border-muted last:border-b-0"
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
              )}
            </TabsContent>

            <TabsContent value="additional" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicleOwnerName">Vehicle Owner Name</Label>
                  <MultilingualInput
                    id="vehicleOwnerName"
                    value={formData.vehicleOwnerName}
                    onChange={(e) => handleInputChange("vehicleOwnerName", e.target.value)}
                    placeholder="Transport company/owner"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Vehicle Phone Number</Label>
                  <MultilingualInput
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+91 99999 88888"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="chefName">Chef Name</Label>
                  <MultilingualInput
                    id="chefName"
                    value={formData.chefName}
                    onChange={(e) => handleInputChange("chefName", e.target.value)}
                    placeholder="Chef name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="chefPhoneNumber">Chef Phone Number</Label>
                  <MultilingualInput
                    id="chefPhoneNumber"
                    value={formData.chefPhoneNumber}
                    onChange={(e) => handleInputChange("chefPhoneNumber", e.target.value)}
                    placeholder="+91 88888 77777"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicleNumberPlaceholder">Vehicle Number</Label>
                  <MultilingualInput
                    id="vehicleNumberPlaceholder"
                    value={formData.vehicleNumberPlaceholder}
                    onChange={(e) => handleInputChange("vehicleNumberPlaceholder", e.target.value)}
                    placeholder="GJ-01-AB-1234"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="addHelper">Additional Helper</Label>
                  <MultilingualInput
                    id="addHelper"
                    value={formData.addHelper}
                    onChange={(e) => handleInputChange("addHelper", e.target.value)}
                    placeholder="Helper name"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <MultilingualTextarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes or special instructions"
                  rows={3}
                />
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{order ? "Update Order" : "Create Order"}</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
