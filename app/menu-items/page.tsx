"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, ChefHat, Package, FileText, BarChart3, Loader2 } from 'lucide-react'
import { MenuItemDialog } from "@/components/menu-items/menu-item-dialog"
import { DeleteMenuItemDialog } from "@/components/menu-items/delete-menu-item-dialog"
import { ViewMenuItemDialog } from "@/components/menu-items/view-menu-item-dialog"
import type { MenuItem, Ingredient } from "@/lib/types"
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/api/menu-items"
import { fetchIngredients } from "@/lib/api/ingredients"
import { useLanguage } from "@/lib/language-context"

const typeColors = {
  only_bhajiya_kg: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  dish_with_only_bhajiya: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  dish_have_no_chart: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  dish_have_chart_bhajiya: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

const typeLabels = {
  only_bhajiya_kg: "onlyBhajiyaKG",
  dish_with_only_bhajiya: "dishWithOnlyBhajiya",
  dish_have_no_chart: "dishHaveNoChart",
  dish_have_chart_bhajiya: "dishHaveChartAndBhajiya",
}

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [deletingMenuItem, setDeletingMenuItem] = useState<MenuItem | null>(null)
  const [viewingMenuItem, setViewingMenuItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [menuItemsData, ingredientsData] = await Promise.all([fetchMenuItems("", "", "", true), fetchIngredients()])
      setMenuItems(menuItemsData)
      setIngredients(ingredientsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const menuItemsWithIngredients = menuItems.map((item) => ({
    ...item,
    ingredients: item.ingredients.map((ing) => ({
      ...ing,
      ingredient: ingredients.find((i) => i._id === ing.ingredientId),
    })),
  }))

  const filteredMenuItems = menuItemsWithIngredients.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesType = selectedType === "all" || item.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const categories = Array.from(new Set(menuItems.map((item) => item.category)))
  const categoryCounts = menuItems.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeCounts = menuItems.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const handleCreateMenuItem = async (menuItemData: Omit<MenuItem, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const newMenuItem = await createMenuItem(menuItemData)
      setMenuItems([newMenuItem, ...menuItems])
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create menu item")
    }
  }

  const handleUpdateMenuItem = async (menuItemData: Omit<MenuItem, "_id" | "createdAt" | "updatedAt">) => {
    if (!editingMenuItem) return

    try {
      const updatedMenuItem = await updateMenuItem(editingMenuItem._id!, menuItemData)
      setMenuItems(menuItems.map((item) => (item._id === editingMenuItem._id ? updatedMenuItem : item)))
      setEditingMenuItem(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update menu item")
    }
  }

  const handleDeleteMenuItem = async () => {
    if (!deletingMenuItem) return

    try {
      await deleteMenuItem(deletingMenuItem._id!)
      setMenuItems(menuItems.filter((item) => item._id !== deletingMenuItem._id))
      setDeletingMenuItem(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete menu item")
    }
  }

  const openEditDialog = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingMenuItem(null)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm md:text-base">{t.loading} menu items...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4 md:gap-6">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-xs md:text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={loadData} className="text-xs md:text-sm w-full sm:w-auto">
                  {t.retry}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-balance">{t.menuItemManagement}</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">{t.manageBhajiyaVarieties}</p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2 w-full sm:w-auto text-xs md:text-sm">
            <Plus className="h-4 w-4" />
            {t.addMenuItem}
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t.searchMenuItems}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-xs md:text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="text-xs md:text-sm"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs md:text-sm"
              >
                {category} ({categoryCounts[category]})
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
              className="text-xs md:text-sm"
            >
              All Types
            </Button>
            {Object.entries(typeCounts).map(([type, count]) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="text-xs md:text-sm"
              >
                {t[typeLabels[type as keyof typeof typeLabels] as keyof typeof t]} ({count})
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">{t.totalMenuItems}</p>
                  <p className="text-lg md:text-2xl font-bold">{menuItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">Categories</p>
                  <p className="text-lg md:text-2xl font-bold">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">With Charts</p>
                  <p className="text-lg md:text-2xl font-bold">{menuItems.filter((item) => item.type.includes("chart")).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">{t.searchResults}</p>
                  <p className="text-lg md:text-2xl font-bold">{filteredMenuItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredMenuItems.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 md:pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg line-clamp-2">{item.name}</CardTitle>
                    <CardDescription className="text-xs md:text-sm mt-1">{item.category}</CardDescription>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className={typeColors[item.type as keyof typeof typeColors]} variant="secondary" className="text-xs">
                        {t[typeLabels[item.type as keyof typeof typeLabels] as keyof typeof t]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{item.ingredients.length} ing</Badge>
                      {item.ingredients.some((ing) => ing.isDefaultIngredient) && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                          Defaults
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingMenuItem(item)}
                      className="h-7 w-7 md:h-8 md:w-8 p-0"
                      title="View Details"
                    >
                      <FileText className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                      className="h-7 w-7 md:h-8 md:w-8 p-0"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingMenuItem(item)}
                      className="h-7 w-7 md:h-8 md:w-8 p-0 text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs md:text-sm font-medium mb-1">Key Ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.slice(0, 3).map((ing) => (
                        <Badge key={ing.ingredientId} variant="outline" className="text-xs">
                          {ing.ingredient?.name}
                          {ing.isDefaultIngredient && <span className="ml-1">*</span>}
                        </Badge>
                      ))}
                      {item.ingredients.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.ingredients.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMenuItems.length === 0 && !loading && (
          <Card>
            <CardContent className="p-6 md:p-8 text-center">
              <ChefHat className="h-10 md:h-12 w-10 md:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t.noMenuItemsFound}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all" || selectedType !== "all"
                  ? t.tryAdjustingSearch
                  : t.getStartedAddMenuItem}
              </p>
              {!searchTerm && selectedCategory === "all" && selectedType === "all" && (
                <Button onClick={openCreateDialog} className="w-full sm:w-auto text-xs md:text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addMenuItem}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <MenuItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        menuItem={editingMenuItem}
        ingredients={ingredients}
        onSubmit={editingMenuItem ? handleUpdateMenuItem : handleCreateMenuItem}
      />

      <ViewMenuItemDialog
        open={!!viewingMenuItem}
        onOpenChange={() => setViewingMenuItem(null)}
        menuItem={viewingMenuItem}
      />

      <DeleteMenuItemDialog
        open={!!deletingMenuItem}
        onOpenChange={() => setDeletingMenuItem(null)}
        menuItem={deletingMenuItem}
        onConfirm={handleDeleteMenuItem}
      />
    </div>
  )
}
