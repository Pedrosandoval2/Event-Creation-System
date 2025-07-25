
import { useState, useContext, useEffect } from "react"


import { Search, Plus, Edit, Trash2, Users, Calendar, DollarSign, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react"
import { EventModal } from "./EventModal"
import { CustomerModal } from "./CustomerModal"
import { ThemeContext, type ThemeContextType } from "@/context/themeProvider"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { DeleteConfirmModal } from './DeleteConfirmModal';
import type { CreateEventFormData, Customer, Event, EventCustomer } from "@/pages/private/event/interfaces/Event"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { useGetEvents } from "@/hooks/useGetEvents"
import { useDebounce } from "@/hooks/useDebounce"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


const initialCustomers: Customer[] = [
    { id: 101, name: "Juan Pérez" },
    { id: 102, name: "María García" },
    { id: 103, name: "Carlos López" },
    { id: 104, name: "Ana Martínez" },
]

const initialEventCustomers: EventCustomer[] = [
    {
        id: 1,
        customer: { id: 101, name: "Juan Pérez" },
        event: { id: 1, title: "Pollada Benéfica" },
        description: "Reserva para 4 personas",
        payments: [{ id: 1, amount: 50, method: "Efectivo", date: "2025-07-20T10:00:00Z" }],
        createdAt: "2025-07-22T12:45:00Z",
        isActive: true,
        quantity: 4,
        total_price: 100.0,
    },
]

export default function EventManagement() {
    const { theme, setTheme } = useContext(ThemeContext) as ThemeContextType

    const { data, isLoading, page, setPage, totalPages, limit, fetchEvents } = useGetEvents()
    const [search, setSearch] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState(limit?.toString());
    const debouncedSearch = useDebounce(search);
    console.log("🚀 ~ EventManagement ~ data:", data)

    const [customers] = useState<Customer[]>(initialCustomers)
    const [eventCustomers, setEventCustomers] = useState<EventCustomer[]>(initialEventCustomers)

    const [selectedEvent, setSelectedEvent] = useState<CreateEventFormData | null>(null)
    const [selectedEventForCustomers, setSelectedEventForCustomers] = useState<Event | null>(null)
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        fetchEvents({ query: debouncedSearch || null, page, limit: Number(currentQuantity) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, page, currentQuantity])

    // Obtener clientes de un evento específico
    const getEventCustomers = (eventId: number) => {
        return eventCustomers.filter((ec) => ec.event.id === eventId)
    }

    // Handlers para eventos
    const handleCreateEvent = () => {
        setSelectedEvent(null)
        setIsEditing(false)
        setIsEventModalOpen(true)
    }

    const handleEditEvent = (event: CreateEventFormData) => {
        setSelectedEvent(event)
        setIsEditing(true)
        setIsEventModalOpen(true)
    }

    const handleDeleteEvent = (event: Event) => {
        setEventToDelete(event)
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteEvent = () => {

    }

    const handleSaveCustomer = (customerData: Omit<EventCustomer, "id" | "createdAt">) => {
        const newCustomer: EventCustomer = {
            ...customerData,
            id: Math.max(...eventCustomers.map((ec) => ec.id), 0) + 1,
            createdAt: new Date().toISOString(),
        }
        setEventCustomers([...eventCustomers, newCustomer])
    }

    const handleManageCustomers = (event: Event) => {
        setSelectedEventForCustomers(event)
        setIsCustomerModalOpen(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearch(e.target.value)
    }

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    // TODO: Implemendar filto por fecha de creación
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
                    <p className="text-muted-foreground">Administra tus eventos y controla los pagos de los clientes</p>
                </div>
                <div className="flex items-center gap-2 justify-end md:justify-start">
                    <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9 bg-transparent">
                        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                    <Button onClick={handleCreateEvent} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo Evento
                    </Button>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Buscar eventos por nombre..."
                    value={search}
                    onChange={handleChange}
                    className="pl-10"
                />
            </div>

            {/* Lista de eventos */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {!isLoading && data?.map((event) => {
                    console.log("🚀 ~ event:", event)
                    // const stats = getEventStats(event.id)
                    return (
                        <Card key={event.id} className="hover:shadow-lg transition-shadow dark:hover:shadow-xl">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{event.name_event}</CardTitle>
                                        <CardDescription className="mt-1">{event?.description}</CardDescription>
                                    </div>
                                    <div className="flex items-center flex-col gap-2">
                                        <Badge variant="secondary"> Unidad. {formatCurrency(Number.parseFloat(event.price_unit))}</Badge>
                                        <Badge variant="secondary"> Total. {formatCurrency(Number.parseFloat(event.totalAmount))}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Fechas */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {formatDate(event.start_date)} - {formatDate(event.end_date)}
                                    </span>
                                </div>

                                {/* Estadísticas */}
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span className="text-xs text-muted-foreground">Clientes</span>
                                        </div>
                                        <div className="font-semibold">{event.totalQuantityCustomers}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-center gap-1">
                                            <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
                                            <span className="text-xs text-muted-foreground">Cobrado</span>
                                        </div>
                                        <div className="font-semibold text-green-600 dark:text-green-400">
                                            {formatCurrency(event.totalPayments)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-center gap-1">
                                            <DollarSign className="h-3 w-3 text-red-600 dark:text-red-400" />
                                            <span className="text-xs text-muted-foreground">Pendiente</span>
                                        </div>
                                        <div className="font-semibold text-red-600 dark:text-red-400">
                                            {formatCurrency(Number.parseFloat(event.totalAmount) - event.totalPayments)}
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" onClick={() => handleManageCustomers(event)} className="flex-1">
                                        <Users className="h-4 w-4 mr-1" />
                                        Clientes
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEditEvent({
                                        name_event: event.name_event,
                                        description: event.description || "",
                                        price_unit: event.price_unit,
                                        start_date: new Date(event.start_date),
                                        end_date: new Date(event.end_date)
                                    })}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteEvent(event)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Creado por */}
                                <div className="text-xs text-muted-foreground border-t pt-2">Creado por: {event.userCreate}</div>
                            </CardContent>
                        </Card>
                    )
                })
                }
            </div>
            <div className="flex items-center gap-2 md:justify-start justify-center">
                <Select
                    value={currentQuantity}
                    onValueChange={(value) => {
                        setCurrentQuantity(value);
                    }}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={isLoading || page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm px-3 py-1">
                        {page} de {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={isLoading || page === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Modales */}
            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                event={selectedEvent}
                isEditing={isEditing}
            />

            {/* <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSave={handleSaveCustomer}
                event={selectedEventForCustomers}
                customers={customers}
                eventCustomers={getEventCustomers(selectedEventForCustomers?.id || 0)}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteEvent}
                eventName={eventToDelete?.name_event || ""}
            /> */}
        </div >
    )
}
