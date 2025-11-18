"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Phone, MapPin, User, FileText, Loader2 } from 'lucide-react'
import { ClientDialog } from "@/components/clients/client-dialog"
import { DeleteClientDialog } from "@/components/clients/delete-client-dialog"
import type { Client } from "@/lib/types"
import { useLanguage } from "@/lib/language-context"
import { fetchClients, createClient, updateClient, deleteClient } from "@/lib/api/clients"

export default function ClientsPage() {
  const { t } = useLanguage()
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const clientsData = await fetchClients()
      setClients(clientsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients")
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateClient = async (clientData: Omit<Client, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const newClient = await createClient(clientData)
      setClients([newClient, ...clients])
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client")
    }
  }

  const handleUpdateClient = async (clientData: Omit<Client, "_id" | "createdAt" | "updatedAt">) => {
    if (!editingClient) return

    try {
      const updatedClient = await updateClient(editingClient._id!, clientData)
      setClients(clients.map((client) => (client._id === editingClient._id ? updatedClient : client)))
      setEditingClient(null)
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client")
    }
  }

  const handleDeleteClient = async () => {
    if (!deletingClient) return

    try {
      await deleteClient(deletingClient._id!)
      setClients(clients.filter((client) => client._id !== deletingClient._id))
      setDeletingClient(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client")
    }
  }

  const openEditDialog = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingClient(null)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm md:text-base">
              {t.loading} {t.clients}...
            </p>
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
                <Button variant="outline" size="sm" onClick={loadClients} className="text-xs md:text-sm w-full sm:w-auto">
                  {t.retry}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-balance">{t.clientManagement}</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">{t.manageClientInfo}</p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2 w-full sm:w-auto text-xs md:text-sm">
            <Plus className="h-4 w-4" />
            {t.addClient}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t.searchClients}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-xs md:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">{t.totalClients}</p>
                  <p className="text-xl md:text-2xl font-bold">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">{t.searchResults}</p>
                  <p className="text-xl md:text-2xl font-bold">{filteredClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">{t.withReferences}</p>
                  <p className="text-xl md:text-2xl font-bold">{clients.filter((client) => client.reference).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredClients.map((client) => (
            <Card key={client._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 md:pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg line-clamp-2">{client.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 text-xs md:text-sm">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{client.phone}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(client)}
                      className="h-7 w-7 md:h-8 md:w-8 p-0"
                    >
                      <Edit className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingClient(client)}
                      className="h-7 w-7 md:h-8 md:w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{client.address}</p>
                  </div>
                  {client.reference && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{client.reference}</p>
                    </div>
                  )}
                  {client.notes && (
                    <div className="mt-2">
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{client.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && !loading && (
          <Card>
            <CardContent className="p-6 md:p-8 text-center">
              <User className="h-10 md:h-12 w-10 md:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t.noClientsFound}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">
                {searchTerm ? t.tryAdjustingSearch : t.getStartedAddClient}
              </p>
              {!searchTerm && (
                <Button onClick={openCreateDialog} className="w-full sm:w-auto text-xs md:text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addClient}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={editingClient}
        onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
      />

      <DeleteClientDialog
        open={!!deletingClient}
        onOpenChange={() => setDeletingClient(null)}
        client={deletingClient}
        onConfirm={handleDeleteClient}
      />
    </div>
  )
}
