import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { createEventSchema } from "@/pages/private/event/schema/createEvent"
import type { CreateEventFormData } from "@/pages/private/event/interfaces/Event"


interface EventModalProps {
    readonly isOpen: boolean
    readonly onClose: () => void
    readonly event: CreateEventFormData | null;
    readonly isEditing: boolean
}

export function EventModal({ isOpen, onClose, event, isEditing }: EventModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateEventFormData>({
        defaultValues: event || {
            name_event: '',
            description: '',
            price_unit: '',
            start_date: new Date(),
            end_date: new Date(),
        },
        mode: "onChange",
        resolver: yupResolver(createEventSchema),
    });

    const onSubmit = (data: CreateEventFormData) => {
        console.log("Form data:", data)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name_event">Nombre del Evento *</Label>
                        <Input
                            id="name_event"
                            {...register("name_event")}
                            placeholder="Ej: Pollada Benéfica"
                        />
                        {errors.name_event && <p className="text-sm text-red-500">{errors.name_event.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Descripción del evento (opcional)"
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price_unit">Precio Unitario (S/) *</Label>
                        <Input
                            id="price_unit"
                            type="number"
                            step="0.01"
                            min="0"
                            {...register("price_unit")}
                            placeholder="25.00"
                            className={errors.price_unit ? "border-red-500" : ""}
                        />
                        {errors.price_unit && <p className="text-sm text-red-500">{errors.price_unit.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Fecha de Inicio *</Label>
                            <Input
                                id="start_date"
                                type="date"
                                {...register("start_date")}
                                className={errors.start_date ? "border-red-500" : ""}
                            />
                            {errors.start_date && <p className="text-sm text-red-500">{errors.start_date.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">Fecha de Fin *</Label>
                            <Input
                                id="end_date"
                                type="date"
                                {...register("end_date")}
                                className={errors.end_date ? "border-red-500" : ""}
                            />
                            {errors.end_date && <p className="text-sm text-red-500">{errors.end_date.message}</p>}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">{isEditing ? "Actualizar" : "Crear"} Evento</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
