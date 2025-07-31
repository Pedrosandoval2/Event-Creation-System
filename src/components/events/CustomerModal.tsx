
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, User, CreditCard, Plus } from "lucide-react"
import { formatCurrency, formatCurrencyWithZeros } from "@/utils/formatCurrency"
import { getCustomerEvent } from "@/services/events/getCustomerEvent"
import type { EventCustomer, PaymentI } from "@/pages/private/event/interfaces/customerEvent"
import { formatDateV2 } from "@/utils/formatDate"
import { Separator } from "../ui/separator"
import { AddCustomerModal } from "./AddCustomerModal"
import type { Event } from "@/pages/private/event/interfaces/event"


interface CustomerModalProps {
    readonly isOpen?: boolean
    readonly onClose?: () => void
    readonly event: Pick<Event, "id" | "name_event" | "price_unit">
}

const getPaymentTotal = (payments: PaymentI[]) => {
    const total = payments.reduce((sum, payment) => {
        return sum + formatCurrencyWithZeros(payment.amount)
    }, 0)
    return total || 0
}

const getDebtAmount = (customer: EventCustomer) => {
    const totalPaid = getPaymentTotal(customer.payments)
    return customer.total_price - totalPaid
}

export function CustomerModal({ isOpen, onClose, event }: CustomerModalProps) {

    const [data, setData] = useState<EventCustomer[]>([])

    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)

    const handleFetchEventCustomers = async (eventId: number) => {
        const response = await getCustomerEvent({ id: eventId })
        console.log("🚀 ~ handleFetchEventCustomers ~ response:", response)
        setData(response.data)
    }

    useEffect(() => {
        if (event.id) {
            handleFetchEventCustomers(event.id)
        }
    }, [event.id])

    if (!event) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Clientes - {event.name_event}
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground">
                        Precio unitario: {formatCurrency(event?.price_unit)}
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Lista de clientes existentes */}
                    {data.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Clientes Registrados</h3>
                            <div className="space-y-3">
                                {data.map((eventCustomer) => {
                                    const totalPaid = getPaymentTotal(eventCustomer.payments)
                                    const debt = getDebtAmount(eventCustomer)
                                    const isPaidInFull = debt <= 0

                                    return (
                                        <Card key={eventCustomer.id} className="relative">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-base flex items-center gap-2">
                                                            {eventCustomer.customer.firstName}
                                                            {isPaidInFull ? (
                                                                <Badge variant="default" className="bg-green-600">
                                                                    Pagado
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="destructive">Debe {formatCurrency(debt)}</Badge>
                                                            )}
                                                        </CardTitle>
                                                        <CardDescription>{eventCustomer.description}</CardDescription>
                                                    </div>
                                                    <div className="text-right text-sm">
                                                        <div className="font-semibold">
                                                            {eventCustomer.quantity} × {formatCurrency(event.price_unit)}
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            Total: {formatCurrency(eventCustomer.total_price)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            {eventCustomer.payments.length > 0 && (
                                                <CardContent className="pt-0">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                            <CreditCard className="h-4 w-4" />
                                                            Pagos Realizados
                                                        </div>
                                                        {eventCustomer.payments.map((payment) => (
                                                            <div
                                                                key={payment.id}
                                                                className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <DollarSign className="h-3 w-3 text-green-600" />
                                                                    <span>{formatCurrency(payment.amount)}</span>
                                                                    <span className="text-muted-foreground">({payment.method})</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>{formatDateV2(payment.date)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-between items-center text-sm font-medium pt-1 border-t">
                                                            <span>Total Pagado:</span>
                                                            <span className="text-green-600">{formatCurrency(totalPaid)}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {data.length > 0 && <Separator />}

                    {/* Botón para agregar nuevo cliente */}
                    <div className="text-center">
                        <Button
                            onClick={() => setIsAddCustomerModalOpen(true)}
                            className="flex items-center gap-2"
                            // disabled={availableCustomers.length === 0}
                        >
                            <Plus className="h-4 w-4" />
                            Agregar Cliente
                        </Button>
                    </div>
                    {/* Modal para agregar cliente */}
                    <AddCustomerModal
                        isOpen={isAddCustomerModalOpen}
                        onClose={() => setIsAddCustomerModalOpen(false)}
                        event={event}
                        initialValue={{
                            id: event?.id,

                            customerId: 0, // Inicialmente no hay cliente seleccionado
                            quantity: 1,
                            description: "",
                            payments: [],
                        }}
                        // availableCustomers={availableCustomers}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
