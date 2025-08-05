import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { createEventSchema } from "@/pages/private/event/schema/createEvent"
import type { CreateEventFormData, EventFormValuesI } from "@/pages/private/event/interfaces/event"
import { updateEvents } from "@/services/events/updateEvent"
import { toast } from "react-toastify"
import { createEvents } from "@/services/events/createEvents"
import { getErrorFetch } from "@/utils/getErrorFetch"


interface EventModalProps {
    readonly isOpen: boolean
    readonly onReloadEvent: () => void
    readonly onClose: () => void
    readonly initialValue: EventFormValuesI | undefined;
    readonly isEditing: boolean
}

export function EventModal({ isOpen, onClose, onReloadEvent, initialValue, isEditing }: EventModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateEventFormData>({
        defaultValues: {
            name_event: initialValue?.data.name_event,
            description: initialValue?.data.description,
            price_unit: initialValue?.data.price_unit,
            start_date: initialValue?.data.start_date,
            end_date: initialValue?.data.end_date,
        },
        mode: "onChange",
        resolver: yupResolver(createEventSchema),
    });

    const onSubmit = async (data: CreateEventFormData) => {
        try {
            const response = initialValue
                ? await updateEvents({ id: initialValue?.id || 0, payload: data })
                : await createEvents(data);

            if (response.status !== 200 && response.status !== 201) return toast.error('Error al crear el evento');

            getErrorFetch(response);
            toast.success("Evento actualizado correctamente");
            onReloadEvent();
            onClose();

        } catch (error) {
            console.error("Error al enviar el formulario:", error);

        }
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
                            placeholder="Ej: Pollada General"
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
