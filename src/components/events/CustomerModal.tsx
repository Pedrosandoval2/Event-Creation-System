
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, User, CreditCard, Plus } from "lucide-react"
import { formatCurrency, formatCurrencyWithZeros } from "@/utils/formatCurrency"
import { getCustomerEvent } from "@/services/customesEvents/getCustomerEvent"
import type { CreateCustomer, EventCustomer, PaymentI } from "@/pages/private/event/interfaces/customerEvent"
import { formatDateV2 } from "@/utils/formatDate"
import { Separator } from "../ui/separator"
import { AddCustomerModal } from "./AddCustomerModal"
import type { Event } from "@/pages/private/event/interfaces/event"


interface CustomerModalProps {
    readonly isOpen?: boolean
    readonly onClose?: () => void
    readonly event: Pick<Event, "id" | "name_event" | "price_unit">
    readonly onReloadEvent: () => void
}

const getPaymentTotal = (payments: PaymentI[]) => {
    const total = payments.reduce((sum, payment) => {
        return sum + formatCurrencyWithZeros(payment.amount)
    }, 0)
    return total || 0
}

const getDebtAmount = (customer: EventCustomer) => {
    const totalPaid = getPaymentTotal(customer?.payments)
    return customer.total_price - totalPaid
}

export function CustomerModal({ isOpen, onClose, event, onReloadEvent }: CustomerModalProps) {
    const [openModalType, setOpenModalType] = useState<{ type: "add" | "edit"; customerEventId: number }>({ type: "add", customerEventId: 0 });
    const initialCustomer: CreateCustomer = {
        customer: {
            id: 0,
            firstName: "",
            lastName: "",
            isMember: false,
            phone: "",
            createdAt: "",
            isActive: true
        },
        description: "",
        quantity: 1,
        payments: [{
            amount: 0,
            method: "Efectivo"
        }],
        eventId: event.id
    }

    const [data, setData] = useState<EventCustomer[]>([])

    const [availableCustomers, setAvailableCustomers] = useState<CreateCustomer>(initialCustomer)

    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)

    const handleFetchEventCustomers = async (eventId: number) => {
        const response = await getCustomerEvent({ id: eventId })
        setData(response.data)
    }

    const handleReloadCustomers = () => {
        handleFetchEventCustomers(event.id)
    }

    const editCustomer = (customer: EventCustomer) => {
        setOpenModalType({
            type: "edit",
            customerEventId: customer.id
        })
        setAvailableCustomers({
            customer: {
                id: customer.customer.id,
                firstName: customer.customer.firstName,
                lastName: customer.customer.lastName,
                isMember: customer.customer.isMember,
                phone: customer.customer.phone,
                createdAt: customer.customer.createdAt,
                isActive: customer.customer.isActive
            },
            description: customer.description,
            quantity: customer.quantity,
            payments: [
                ...customer.payments.map(payment => ({
                    amount: formatCurrencyWithZeros(payment.amount),
                    method: payment.method
                }))
            ],
            eventId: event.id
        })
        setIsAddCustomerModalOpen(true)
    }

    const closeModal = () => {
        setIsAddCustomerModalOpen(false)
        setAvailableCustomers(initialCustomer)
    }

    useEffect(() => {
        handleReloadCustomers();
    }, [])


    if (!event) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] ">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Clientes - {event.name_event}
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground">
                        Precio unitario: {formatCurrency(event?.price_unit)}
                    </div>
                </DialogHeader>

                {/* <div className="space-y-6"> */}
                {/* Lista de clientes existentes */}
                {data.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Clientes Registrados</h3>
                        {/* //Todo: Aquí podrías agregar un filtro para buscar clientes por nombre o ID Y LE BAJAS EL h-[50vh] */}
                        <div className="space-y-3 overflow-y-auto max-h-[50vh]">
                            {data.map((eventCustomer) => {
                                const totalPaid = getPaymentTotal(eventCustomer.payments)
                                const debt = getDebtAmount(eventCustomer)
                                const isPaidInFull = debt <= 0

                                return (
                                    <Card key={eventCustomer.id} className="relative" onClick={() => editCustomer(eventCustomer)}>
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
                                                                <span>{formatDateV2(payment.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                    )}
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
                ) : (
                    <div className="text-center text-muted-foreground">
                        No hay clientes registrados para este evento.
                    </div>
                )
                }

                {data.length > 0 && <Separator />}

                {/* Botón para agregar nuevo cliente */}
                <div className="text-center">
                    <Button
                        onClick={() => { setIsAddCustomerModalOpen(true); setOpenModalType({ type: "add", customerEventId: 0 }); }}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Cliente
                    </Button>
                </div>
                {/* Modal para agregar cliente */}
                {isAddCustomerModalOpen && <AddCustomerModal
                    isOpen={isAddCustomerModalOpen}
                    onClose={closeModal}
                    event={event}
                    initialValue={availableCustomers}
                    handleReloadCustomers={handleReloadCustomers}
                    openModalType={openModalType}
                    onReloadEvent={onReloadEvent}
                />}
                {/* </div> */}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
