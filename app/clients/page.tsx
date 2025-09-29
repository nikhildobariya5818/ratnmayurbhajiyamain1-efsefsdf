"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Phone, MapPin, User, FileText, Loader2 } from "lucide-react"
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
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>
              {t.loading} {t.clients}...
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
                <Button variant="outline" size="sm" onClick={loadClients}>
                  {t.retry}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t.clientManagement}</h1>
            <p className="text-muted-foreground">{t.manageClientInfo}</p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t.addClient}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t.searchClients}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.totalClients}</p>
                  <p className="text-2xl font-bold">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.searchResults}</p>
                  <p className="text-2xl font-bold">{filteredClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.withReferences}</p>
                  <p className="text-2xl font-bold">{clients.filter((client) => client.reference).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Card key={client._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(client)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingClient(client)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground line-clamp-2">{client.address}</p>
                  </div>
                  {client.reference && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground line-clamp-1">{client.reference}</p>
                    </div>
                  )}
                  {client.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{client.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.noClientsFound}</h3>
              <p className="text-muted-foreground mb-4">{searchTerm ? t.tryAdjustingSearch : t.getStartedAddClient}</p>
              {!searchTerm && (
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addClient}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
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
