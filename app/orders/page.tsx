"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, FileText, Users, Calendar, MapPin, Loader2, Download } from "lucide-react"
import { OrderDialog } from "@/components/orders/order-dialog"
import { DeleteOrderDialog } from "@/components/orders/delete-order-dialog"
import { ViewOrderDialog } from "@/components/orders/view-order-dialog"
import { PDFReportDialog } from "@/components/orders/pdf-report-dialog"
import type { Order, Client, MenuItem, Ingredient } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { fetchOrders, createOrder, updateOrder, deleteOrder } from "@/lib/api/orders"
import { fetchClients } from "@/lib/api/clients"
import { fetchMenuItems } from "@/lib/api/menu-items"
import { fetchIngredients } from "@/lib/api/ingredients"

const orderTypeColors = {
  Wedding: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  "Birthday Party": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Corporate Event": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Religious Function": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Anniversary: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Festival: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export default function OrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrderType, setSelectedOrderType] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [pdfReportOrder, setPdfReportOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [ordersData, clientsData, menuItemsData, ingredientsData] = await Promise.all([
        fetchOrders(),
        fetchClients(),
        fetchMenuItems(),
        fetchIngredients(),
      ])

      setOrders(ordersData)
      setClients(clientsData)
      setMenuItems(menuItemsData)
      setIngredients(ingredientsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const ordersWithClients = orders.map((order) => ({
    ...order,
    client: order.clientId ? clients.find((c) => c._id === order.clientId) : undefined,
  }))

  const filteredOrders = ordersWithClients.filter((order) => {
    const client = order.client || order.clientSnapshot
    const clientName = client?.name || ""
    const matchesSearch =
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedOrderType === "all" || order.orderType === selectedOrderType
    return matchesSearch && matchesType
  })

  const orderTypes = Array.from(new Set(orders.map((order) => order.orderType)))
  const orderTypeCounts = orders.reduce(
    (acc, order) => {
      acc[order.orderType] = (acc[order.orderType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const handleCreateOrder = async (orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const newOrder = await createOrder(orderData)
      setOrders([newOrder, ...orders])
      const updatedClients = await fetchClients()
      setClients(updatedClients)
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order")
    }
  }

  const handleUpdateOrder = async (orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">) => {
    if (!editingOrder) return

    try {
      const updatedOrder = await updateOrder(editingOrder._id!, orderData)
      setOrders(orders.map((order) => (order._id === editingOrder._id ? updatedOrder : order)))
      const updatedClients = await fetchClients()
      setClients(updatedClients)
      setEditingOrder(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order")
    }
  }

  const handleDeleteOrder = async () => {
    if (!deletingOrder) return

    try {
      await deleteOrder(deletingOrder._id!)
      setOrders(orders.filter((order) => order._id !== deletingOrder._id))
      setDeletingOrder(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order")
    }
  }

  const openEditDialog = (order: Order) => {
    setEditingOrder(order)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingOrder(null)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>
              {t.loading} {t.orders}...
            </p>
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
                <Button variant="outline" size="sm" onClick={loadAllData}>
                  {t.retry}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t.orderManagement}</h1>
            <p className="text-muted-foreground">{t.createManageOrders}</p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t.createOrder}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t.searchOrders}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedOrderType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedOrderType("all")}
            >
              All Types
            </Button>
            {orderTypes.map((type) => (
              <Button
                key={type}
                variant={selectedOrderType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedOrderType(type)}
              >
                {type} ({orderTypeCounts[type]})
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.totalOrders}</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total People</p>
                  <p className="text-2xl font-bold">{orders.reduce((sum, order) => sum + order.numberOfPeople, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.thisMonth}</p>
                  <p className="text-2xl font-bold">
                    {
                      orders.filter((order) => {
                        const orderMonth = new Date(order.orderDate).getMonth()
                        const currentMonth = new Date().getMonth()
                        return orderMonth === currentMonth
                      }).length
                    }
                  </p>
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
                  <p className="text-2xl font-bold">{filteredOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map((order) => {
            const client = order.client || order.clientSnapshot
            const orderTypeColor =
              orderTypeColors[order.orderType as keyof typeof orderTypeColors] || orderTypeColors.Other

            return (
              <Card key={order._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{client?.name || "New Client"}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" />
                        {order.numberOfPeople} people
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={orderTypeColor} variant="secondary">
                          {order.orderType}
                        </Badge>
                        <Badge variant="outline">{order.menuItems.length} items</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingOrder(order)}
                        className="h-8 w-8 p-0"
                        title="View Details"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPdfReportOrder(order)}
                        className="h-8 w-8 p-0"
                        title="Generate PDF Report"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(order)}
                        className="h-8 w-8 p-0"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingOrder(order)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">{order.orderTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground line-clamp-2">{order.address}</p>
                    </div>
                    {order.chefName && (
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{order.chefName}</p>
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Menu Items:</p>
                      <div className="flex flex-wrap gap-1">
                        {order.menuItems.slice(0, 2).map((item) => (
                          <Badge key={item.menuItemId} variant="outline" className="text-xs">
                            {item.name}
                          </Badge>
                        ))}
                        {order.menuItems.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{order.menuItems.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredOrders.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.noOrdersFound}</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedOrderType !== "all" ? t.tryAdjustingSearch : t.getStartedCreateOrder}
              </p>
              {!searchTerm && selectedOrderType === "all" && (
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t.createOrder}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <OrderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={editingOrder}
        clients={clients}
        menuItems={menuItems}
        ingredients={ingredients}
        onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
      />

      <ViewOrderDialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)} order={viewingOrder} />

      <PDFReportDialog open={!!pdfReportOrder} onOpenChange={() => setPdfReportOrder(null)} order={pdfReportOrder} />

      <DeleteOrderDialog
        open={!!deletingOrder}
        onOpenChange={() => setDeletingOrder(null)}
        order={deletingOrder}
        onConfirm={handleDeleteOrder}
      />
    </div>
  )
}
