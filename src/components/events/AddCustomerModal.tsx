import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { UserPlus } from "lucide-react"

interface Customer {
  id: number
  name: string
}

interface Event {
  id: number
  name_event: string
  price_unit: string
}

interface Payment {
  id: number
  amount: number
  method: string
  date: string
}

interface EventCustomer {
  id: number
  customer: Customer
  event: {
    id: number
    title: string
  }
  description: string
  payments: Payment[]
  createdAt: string
  isActive: boolean
  quantity: number
  total_price: number
}

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (customer: Omit<EventCustomer, "id" | "createdAt">) => void
  event: Event | null
  availableCustomers: Customer[]
}

export function AddCustomerModal({ isOpen, onClose, onSave, event, availableCustomers }: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    customerId: "",
    description: "",
    quantity: "1",
    paymentAmount: "",
    paymentMethod: "Efectivo",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setFormData({
        customerId: "",
        description: "",
        quantity: "1",
        paymentAmount: "",
        paymentMethod: "Efectivo",
      })
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerId) {
      newErrors.customerId = "Selecciona un cliente"
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = "La cantidad es requerida"
    } else if (isNaN(Number.parseInt(formData.quantity)) || Number.parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "La cantidad debe ser un número válido mayor a 0"
    }

    if (
      formData.paymentAmount &&
      (isNaN(Number.parseFloat(formData.paymentAmount)) || Number.parseFloat(formData.paymentAmount) < 0)
    ) {
      newErrors.paymentAmount = "El monto debe ser un número válido mayor o igual a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!event || !validateForm()) return

    const selectedCustomer = availableCustomers.find((c) => c.id === Number.parseInt(formData.customerId))
    if (!selectedCustomer) return

    const quantity = Number.parseInt(formData.quantity)
    const unitPrice = Number.parseFloat(event.price_unit)
    const totalPrice = quantity * unitPrice

    const payments: Payment[] = []
    if (formData.paymentAmount && Number.parseFloat(formData.paymentAmount) > 0) {
      payments.push({
        id: 1,
        amount: Number.parseFloat(formData.paymentAmount),
        method: formData.paymentMethod,
        date: new Date().toISOString(),
      })
    }

    const customerData: Omit<EventCustomer, "id" | "createdAt"> = {
      customer: selectedCustomer,
      event: {
        id: event.id,
        title: event.name_event,
      },
      description: formData.description.trim() || `Reserva para ${quantity} ${quantity === 1 ? "persona" : "personas"}`,
      payments,
      isActive: true,
      quantity,
      total_price: totalPrice,
    }

    onSave(customerData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatCurrency = (amount: number) => {
    return `S/ ${amount.toFixed(2)}`
  }

  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] z-[60]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Agregar Cliente - {event.name_event}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Precio unitario: {formatCurrency(Number.parseFloat(event.price_unit))}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerId">Cliente *</Label>
            <Select value={formData.customerId} onValueChange={(value) => handleChange("customerId", value)}>
              <SelectTrigger className={errors.customerId ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {availableCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && <p className="text-sm text-red-500">{errors.customerId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descripción de la reserva (opcional)"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>

            <div className="space-y-2">
              <Label>Total a Pagar</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center font-semibold">
                {formatCurrency((Number.parseInt(formData.quantity) || 0) * Number.parseFloat(event.price_unit))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Pago Inicial (Opcional)</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Monto del Pago</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.paymentAmount}
                  onChange={(e) => handleChange("paymentAmount", e.target.value)}
                  placeholder="0.00"
                  className={errors.paymentAmount ? "border-red-500" : ""}
                />
                {errors.paymentAmount && <p className="text-sm text-red-500">{errors.paymentAmount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleChange("paymentMethod", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Yape">Yape</SelectItem>
                    <SelectItem value="Plin">Plin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.paymentAmount && Number.parseFloat(formData.paymentAmount) > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Total a pagar:</span>
                    <span className="font-semibold">
                      {formatCurrency((Number.parseInt(formData.quantity) || 0) * Number.parseFloat(event.price_unit))}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Pago inicial:</span>
                    <span className="font-semibold">-{formatCurrency(Number.parseFloat(formData.paymentAmount))}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Saldo pendiente:</span>
                    <span className="text-red-600">
                      {formatCurrency(
                        (Number.parseInt(formData.quantity) || 0) * Number.parseFloat(event.price_unit) -
                          Number.parseFloat(formData.paymentAmount),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Agregar Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
