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
import { scaleIngredientsWithMenuItems } from "@/lib/database"
import { createClient } from "@/lib/api/clients"
import { FileText } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { formatQuantityByUnitI18n } from "@/lib/format-quantity"

const OrderDialog = ({ open, onOpenChange, order, clients, menuItems, ingredients, onSubmit }: OrderDialogProps) => {
  const { t } = useLanguage()

  const orderTypes = [
    { value: "only_bhajiya_kg", label: t.onlyBhajiyaKG },
    { value: "dish_with_only_bhajiya", label: t.dishWithOnlyBhajiya },
    { value: "dish_have_no_chart", label: t.dishHaveNoChart },
    { value: "dish_have_chart_bhajiya", label: t.dishHaveChartAndBhajiya },
  ] as const

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
          selectedType: item.selectedType,
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
      newErrors.clientId = t.pleaseSelectClient
    }

    if (clientType === "new") {
      if (!formData.clientSnapshot.name.trim()) {
        newErrors.clientName = t.clientNameRequired
      }
      if (!formData.clientSnapshot.phone.trim()) {
        newErrors.clientPhone = t.clientPhoneRequired
      }
      if (!formData.clientSnapshot.address.trim()) {
        newErrors.clientAddress = t.clientAddressRequired
      }
    }

    if (!formData.numberOfPeople || formData.numberOfPeople <= 0) {
      newErrors.numberOfPeople = t.numberOfPeopleGreaterThanZero
    }

    if (!formData.address.trim()) {
      newErrors.address = t.eventAddressRequired
    }

    if (!formData.orderType) {
      newErrors.orderType = t.orderTypeRequired
    }

    if (!formData.orderDate) {
      newErrors.orderDate = t.orderDateRequired
    }

    if (!formData.orderTime) {
      newErrors.orderTime = t.orderTimeRequired
    }

    if (formData.selectedMenuItems.length === 0) {
      newErrors.selectedMenuItems = t.atLeastOneMenuItemRequired
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
        selectedType: selectedType as
          | "only_bhajiya_kg"
          | "dish_with_only_bhajiya"
          | "dish_have_no_chart"
          | "dish_have_chart_bhajiya",
        ingredients: menuItem.ingredients.map((ing) => {
          const ingredient = ingredients.find((i) => i._id === ing.ingredientId)!

          const quantityPer100 = ing.isDefaultIngredient
            ? ing.quantities?.onlyBhajiyaKG || 12
            : getQuantityForTypeNew(ing.quantities, selectedType)

          return {
            ingredientId: ing.ingredientId,
            ingredientName: ingredient.name,
            unit: ingredient.unit,
            isDefaultIngredient: ing.isDefaultIngredient,
            ingredient: ing.isDefaultIngredient
              ? {
                  defaultValue: ingredient?.defaultValue || 12,
                  incrementThreshold: ingredient?.incrementThreshold || 3,
                  incrementAmount: ingredient?.incrementAmount || 3,
                }
              : undefined,
            quantities: ing.quantities || {
              onlyBhajiyaKG: 0,
              dishWithOnlyBhajiya: 0,
              dishHaveNoChart: 0,
              dishHaveChartAndBhajiya: 0,
            },
            formattedValue: formatQuantityByUnitI18n(quantityPer100 * formData.numberOfPeople, ingredient.unit, t),
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
      setFormData((prev) => {
        if (field === "orderType") {
          return {
            ...prev,
            orderType: String(value) as
              | "only_bhajiya_kg"
              | "dish_with_only_bhajiya"
              | "dish_have_no_chart"
              | "dish_have_chart_bhajiya",
            selectedMenuItems: prev.selectedMenuItems.map((item) => ({
              ...item,
              selectedType: String(value),
            })),
          }
        }
        return { ...prev, [field]: value }
      })
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleMenuItemToggle = (menuItemId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        const globalType = (prev.orderType || "only_bhajiya_kg") as
          | "only_bhajiya_kg"
          | "dish_with_only_bhajiya"
          | "dish_have_no_chart"
          | "dish_have_chart_bhajiya"
        return {
          ...prev,
          selectedMenuItems: [...prev.selectedMenuItems, { menuItemId, selectedType: globalType }],
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

  const scaledIngredients =
    formData.numberOfPeople > 0 && formData.selectedMenuItems.length > 0
      ? scaleIngredientsWithMenuItems(
          formData.selectedMenuItems.map(({ menuItemId, selectedType }) => {
            const menuItem = menuItems.find((item) => item._id === menuItemId)!
            return {
              selectedType: selectedType as
                | "only_bhajiya_kg"
                | "dish_with_only_bhajiya"
                | "dish_have_no_chart"
                | "dish_have_chart_bhajiya",
              ingredients: menuItem.ingredients.map((ing) => {
                const ingredient = ingredients.find((i) => i._id === ing.ingredientId)
                return {
                  ingredientId: ing.ingredientId,
                  ingredientName: ingredient?.name || "Unknown",
                  unit: ingredient?.unit || "kg",
                  isDefaultIngredient: ing.isDefaultIngredient,
                  ingredient: ing.isDefaultIngredient
                    ? {
                        defaultValue: ingredient?.defaultValue || 12,
                        incrementThreshold: ingredient?.incrementThreshold || 3,
                        incrementAmount: ingredient?.incrementAmount || 3,
                      }
                    : undefined,
                  quantities: ing.quantities || {
                    onlyBhajiyaKG: 0,
                    dishWithOnlyBhajiya: 0,
                    dishHaveNoChart: 0,
                    dishHaveChartAndBhajiya: 0,
                  },
                  formattedValue: formatQuantityByUnitI18n(
                    ing.isDefaultIngredient
                      ? (ing.quantities?.onlyBhajiyaKG || 12) * formData.numberOfPeople
                      : getQuantityForTypeNew(ing.quantities, formData.orderType) * formData.numberOfPeople,
                    ingredient?.unit || "kg",
                    t,
                  ),
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
          <DialogTitle>{order ? t.editOrder : t.createOrder}</DialogTitle>
          <DialogDescription>{order ? t.updateOrderInfo : t.enterOrderInfo}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">{t.basicInfo}</TabsTrigger>
            <TabsTrigger value="menu">{t.menuItems}</TabsTrigger>
            <TabsTrigger value="additional">{t.additionalInfo}</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-2">
                <Label>{t.client}</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="existing-client"
                      name="clientType"
                      checked={clientType === "existing"}
                      onChange={() => setClientType("existing")}
                    />
                    <Label htmlFor="existing-client">{t.existingClient}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="new-client"
                      name="clientType"
                      checked={clientType === "new"}
                      onChange={() => setClientType("new")}
                    />
                    <Label htmlFor="new-client">{t.newClient}</Label>
                  </div>
                </div>

                {clientType === "existing" ? (
                  <div>
                    <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
                      <SelectTrigger className={errors.clientId ? "border-destructive" : ""}>
                        <SelectValue placeholder={t.selectClient} />
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
                      <CardTitle className="text-sm">{t.newClientInfo}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-2">
                        <Label htmlFor="client-name">{t.name}</Label>
                        <MultilingualInput
                          id="client-name"
                          value={formData.clientSnapshot.name}
                          onChange={(e) => handleInputChange("clientSnapshot.name", e.target.value)}
                          placeholder={t.clientNamePlaceholder}
                          className={errors.clientName ? "border-destructive" : ""}
                        />
                        {errors.clientName && <p className="text-sm text-destructive">{errors.clientName}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="client-phone">{t.phone}</Label>
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
                        <Label htmlFor="client-address">{t.address}</Label>
                        <MultilingualTextarea
                          id="client-address"
                          value={formData.clientSnapshot.address}
                          onChange={(e) => handleInputChange("clientSnapshot.address", e.target.value)}
                          placeholder={t.clientAddressPlaceholder}
                          className={errors.clientAddress ? "border-destructive" : ""}
                          rows={2}
                        />
                        {errors.clientAddress && <p className="text-sm text-destructive">{errors.clientAddress}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="client-reference">{t.reference}</Label>
                        <MultilingualInput
                          id="client-reference"
                          value={formData.clientSnapshot.reference}
                          onChange={(e) => handleInputChange("clientSnapshot.reference", e.target.value)}
                          placeholder={t.howDidTheyFindYou}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="numberOfPeople">{t.numberOfPeople}</Label>
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
                  <Label htmlFor="orderType">{t.orderType}</Label>
                  <Select value={formData.orderType} onValueChange={(value) => handleInputChange("orderType", value)}>
                    <SelectTrigger className={errors.orderType ? "border-destructive" : ""}>
                      <SelectValue placeholder={t.selectOrderType} />
                    </SelectTrigger>
                    <SelectContent>
                      {orderTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.orderType && <p className="text-sm text-destructive">{errors.orderType}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="orderDate">{t.orderDate}</Label>
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
                  <Label htmlFor="orderTime">{t.orderTime}</Label>
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
                <Label htmlFor="address">{t.eventAddress}</Label>
                <MultilingualTextarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder={t.completeEventAddress}
                  className={errors.address ? "border-destructive" : ""}
                  rows={3}
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>
            </TabsContent>

            <TabsContent value="menu" className="space-y-4">
              <div className="grid gap-2">
                <Label>{t.menuItems}</Label>
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
                                  <Badge variant="secondary">
                                    {menuItem.ingredients.length} {t.ingredients}
                                  </Badge>
                                  <Badge variant="default">{menuItem.type.replace(/_/g, " ")}</Badge>
                                </div>
                              </div>
                            </div>
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
                      {t.ingredientRequirements} ({formData.numberOfPeople} {t.people})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {scaledIngredients.map((ingredient) => (
                        <div
                          key={ingredient.ingredientId}
                          className="flex justify-between items-center py-2 border-b border-muted last:border-b-0"
                        >
                          <span className="text-sm font-medium">
                            {ingredient.ingredientName}
                            {ingredient.isDefaultIngredient && (
                              <span className="text-xs text-muted-foreground ml-2">
                                ({ingredient.menuItemCount} {t.menuItems})
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-semibold">{ingredient.formattedValue}</span>
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
                  <Label htmlFor="vehicleOwnerName">{t.vehicleOwnerName}</Label>
                  <MultilingualInput
                    id="vehicleOwnerName"
                    value={formData.vehicleOwnerName}
                    onChange={(e) => handleInputChange("vehicleOwnerName", e.target.value)}
                    placeholder={t.transportCompanyOrOwner}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">{t.vehiclePhoneNumber}</Label>
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
                  <Label htmlFor="chefName">{t.chefName}</Label>
                  <MultilingualInput
                    id="chefName"
                    value={formData.chefName}
                    onChange={(e) => handleInputChange("chefName", e.target.value)}
                    placeholder={t.chefNamePlaceholder}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="chefPhoneNumber">{t.chefPhoneNumber}</Label>
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
                  <Label htmlFor="vehicleNumberPlaceholder">{t.vehicleNumber}</Label>
                  <MultilingualInput
                    id="vehicleNumberPlaceholder"
                    value={formData.vehicleNumberPlaceholder}
                    onChange={(e) => handleInputChange("vehicleNumberPlaceholder", e.target.value)}
                    placeholder="GJ-01-AB-1234"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="addHelper">{t.additionalHelper}</Label>
                  <MultilingualInput
                    id="addHelper"
                    value={formData.addHelper}
                    onChange={(e) => handleInputChange("addHelper", e.target.value)}
                    placeholder={t.helperNamePlaceholder}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">{t.notes}</Label>
                <MultilingualTextarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder={t.additionalNotesOrSpecialInstructions}
                  rows={3}
                />
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t.cancel}
              </Button>
              <Button type="submit">{order ? t.updateOrder : t.createOrder}</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function getQuantityForTypeNew(
  quantities:
    | {
        onlyBhajiyaKG: number
        dishWithOnlyBhajiya: number
        dishHaveNoChart: number
        dishHaveChartAndBhajiya: number
      }
    | undefined,
  type: string,
): number {
  if (!quantities) return 0

  switch (type) {
    case "only_bhajiya_kg":
      return quantities.onlyBhajiyaKG
    case "dish_with_only_bhajiya":
      return quantities.dishWithOnlyBhajiya
    case "dish_have_no_chart":
      return quantities.dishHaveNoChart
    case "dish_have_chart_bhajiya":
      return quantities.dishHaveChartAndBhajiya
    default:
      return 0
  }
}

export { OrderDialog }
