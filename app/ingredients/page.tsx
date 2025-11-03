"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Package, Scale, Beaker, Loader2 } from "lucide-react"
import { IngredientDialog } from "@/components/ingredients/ingredient-dialog"
import { DeleteIngredientDialog } from "@/components/ingredients/delete-ingredient-dialog"
import type { Ingredient } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { fetchIngredients, createIngredient, updateIngredient, deleteIngredient } from "@/lib/api/ingredients"

const unitColors = {
  gram: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  kg: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ml: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  L: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  piece: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  જબલા: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

const unitIcons = {
  gram: Scale,
  kg: Scale,
  ml: Beaker,
  L: Beaker,
  piece: Package,
  જબલા: Package,
}

export default function IngredientsPage() {
  const { t } = useLanguage()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUnit, setSelectedUnit] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadIngredients()
  }, [])

  const loadIngredients = async () => {
    try {
      setLoading(true)
      setError(null)
      const ingredientsData = await fetchIngredients()
      setIngredients(ingredientsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ingredients")
    } finally {
      setLoading(false)
    }
  }

  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUnit = selectedUnit === "all" || ingredient.unit === selectedUnit
    return matchesSearch && matchesUnit
  })

  const unitCounts = ingredients.reduce(
    (acc, ingredient) => {
      acc[ingredient.unit] = (acc[ingredient.unit] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const handleCreateIngredient = async (ingredientData: Omit<Ingredient, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const newIngredient = await createIngredient(ingredientData)
      setIngredients([newIngredient, ...ingredients])
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ingredient")
    }
  }

  const handleUpdateIngredient = async (ingredientData: Omit<Ingredient, "_id" | "createdAt" | "updatedAt">) => {
    if (!editingIngredient) return

    try {
      const updatedIngredient = await updateIngredient(editingIngredient._id!, ingredientData)
      setIngredients(
        ingredients.map((ingredient) => (ingredient._id === editingIngredient._id ? updatedIngredient : ingredient)),
      )
      setEditingIngredient(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ingredient")
    }
  }

  const handleDeleteIngredient = async () => {
    if (!deletingIngredient) return

    try {
      await deleteIngredient(deletingIngredient._id!)
      setIngredients(ingredients.filter((ingredient) => ingredient._id !== deletingIngredient._id))
      setDeletingIngredient(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete ingredient")
    }
  }

  const openEditDialog = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingIngredient(null)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading ingredients...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={loadIngredients}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t.ingredientManagement}</h1>
            <p className="text-muted-foreground">{t.manageIngredients}</p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t.addIngredient}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t.searchIngredients}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedUnit === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedUnit("all")}
            >
              {t.allUnits}
            </Button>
            {Object.entries(unitCounts).map(([unit, count]) => {
              const Icon = unitIcons[unit as keyof typeof unitIcons]
              return (
                <Button
                  key={unit}
                  variant={selectedUnit === unit ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedUnit(unit)}
                  className="flex items-center gap-1"
                >
                  <Icon className="h-3 w-3" />
                  {unit} ({count})
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.totalIngredients}</p>
                  <p className="text-2xl font-bold">{ingredients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.weightUnits}</p>
                  <p className="text-2xl font-bold">{(unitCounts.gram || 0) + (unitCounts.kg || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.volumeUnits}</p>
                  <p className="text-2xl font-bold">{(unitCounts.ml || 0) + (unitCounts.L || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.searchResults}</p>
                  <p className="text-2xl font-bold">{filteredIngredients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredIngredients.map((ingredient) => {
            const Icon = unitIcons[ingredient.unit]
            return (
              <Card key={ingredient._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{ingredient.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Badge className={unitColors[ingredient.unit]} variant="secondary">
                          {ingredient.unit}
                        </Badge>
                        {ingredient.isDefault && (
                          <Badge
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            variant="secondary"
                          >
                            Default: {ingredient.defaultValue} {ingredient.unit}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(ingredient)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingIngredient(ingredient)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground">
                    Added {new Date(ingredient.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredIngredients.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.noIngredientsFound}</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedUnit !== "all" ? t.tryAdjustingSearch : t.getStartedAddIngredient}
              </p>
              {!searchTerm && selectedUnit === "all" && (
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addIngredient}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <IngredientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        ingredient={editingIngredient}
        onSubmit={editingIngredient ? handleUpdateIngredient : handleCreateIngredient}
      />

      <DeleteIngredientDialog
        open={!!deletingIngredient}
        onOpenChange={() => setDeletingIngredient(null)}
        ingredient={deletingIngredient}
        onConfirm={handleDeleteIngredient}
      />
    </div>
  )
}
