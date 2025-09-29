"use client"

import type React from "react"
import { useLanguage } from "@/lib/language-context"
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
import type { Client } from "@/lib/types"

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
  onSubmit: (data: Omit<Client, "_id" | "createdAt" | "updatedAt">) => void
}

export function ClientDialog({ open, onOpenChange, client, onSubmit }: ClientDialogProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        phone: client.phone,
        address: client.address,
        reference: client.reference || "",
        notes: client.notes || "",
      })
    } else {
      setFormData({
        name: "",
        phone: "",
        address: "",
        reference: "",
        notes: "",
      })
    }
    setErrors({})
  }, [client, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t.required
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.required
    } else if (!/^[+]?[0-9\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = t.invalidPhone
    }

    if (!formData.address.trim()) {
      newErrors.address = t.required
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
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      reference: formData.reference.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? t.edit + " " + t.clients : t.addClient}</DialogTitle>
          <DialogDescription>
            {client ? "Update client information below." : "Enter client information below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t.name} *</Label>
              <MultilingualInput
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter client name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">{t.phone} *</Label>
              <MultilingualInput
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">{t.address} *</Label>
              <MultilingualTextarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter complete address"
                className={errors.address ? "border-destructive" : ""}
                rows={3}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">{t.reference}</Label>
              <MultilingualInput
                id="reference"
                value={formData.reference}
                onChange={(e) => handleInputChange("reference", e.target.value)}
                placeholder="How did they find you?"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">{t.notes}</Label>
              <MultilingualTextarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about the client"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit">{client ? t.edit + " " + t.clients : t.addClient}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
