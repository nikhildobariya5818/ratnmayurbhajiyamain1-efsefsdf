"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import type { Client } from "@/lib/types"

interface DeleteClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
  onConfirm: () => void
}

export function DeleteClientDialog({ open, onOpenChange, client, onConfirm }: DeleteClientDialogProps) {
  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Client
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{client.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Client Details:</h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {client.name}
              </p>
              <p>
                <strong>Phone:</strong> {client.phone}
              </p>
              <p>
                <strong>Address:</strong> {client.address}
              </p>
              {client.reference && (
                <p>
                  <strong>Reference:</strong> {client.reference}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
