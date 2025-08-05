import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Switch, } from "@/components"
import type { CreateCustomer } from "@/pages/private/customers/interfaces/customers";
import { customerSchema } from "@/pages/private/customers/schema/createCustomersSchema";
import { createCustomer } from "@/services/customers/createCustomer";
import { updateCustomer } from "@/services/customers/updateCustomer";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    customer: CreateCustomer | null;
    typeModal: "edit" | "create";
    customerId: number; // Optional, only needed for edit mode
    handleCloseEditCustomerDialog: () => void; // Callback to close the edit dialog
}

const initialCustomer: CreateCustomer = {
    firstName: "",
    lastName: "",
    phone: undefined,
    isMember: false,
    isActive: false,
}

// Error porqué no da el botón y listo.

export const ModalCustomer = ({ isOpen, onClose, customer, typeModal, customerId, handleCloseEditCustomerDialog }: Props) => {

    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, control } = useForm<CreateCustomer>({
        defaultValues: customer || initialCustomer,
        mode: "onChange",
        resolver: yupResolver(customerSchema)
    });

    const onSubmit = async (data: CreateCustomer) => {
        try {
            setLoading(true);
            const response = typeModal === "edit"
                ? await updateCustomer({ id: customerId, payload: data })
                : await createCustomer({ payload: data });

            if (response.status === 200 || response.status === 201) {
                toast.success(typeModal === "edit" ? "Cliente actualizado correctamente." : "Cliente creado correctamente.");
                handleCloseEditCustomerDialog();
                onClose();
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            toast.error("Ocurrió un error al enviar el formulario.");
            throw new Error("Error al enviar el formulario");
        } finally {
            setLoading(false);
        }
    }

    const buttonText = typeModal === "edit" ? "Guardar Cambios" : "Crear Cliente";
    const messageButton = loading ? "Guardando..." : buttonText;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} id="customer-form">
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{typeModal === "edit" ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
                        <DialogDescription>
                            {typeModal === "edit" ? "Modifica los detalles del cliente." : "Agrega un nuevo cliente al sistema."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nombre</Label>
                                <Input
                                    id="firstName"
                                    {...register("firstName")}
                                />
                                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input
                                    id="lastName"
                                    {...register("lastName")}
                                />
                                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono {"(+51)"}</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="933288124"
                                {...register("phone")}
                            />
                            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Miembro</Label>
                                <p className="text-sm text-muted-foreground">¿Es miembro?</p>
                            </div>
                            <Controller
                                name="isMember"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Switch
                                        checked={value}
                                        onCheckedChange={onChange}
                                    />
                                )}
                            />
                            {errors.isMember && <p className="text-sm text-red-600">{errors.isMember.message}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Estado Activo</Label>
                                <p className="text-sm text-muted-foreground">¿Está activo el cliente?</p>
                            </div>
                            <Controller
                                control={control}
                                name="isActive"
                                render={({ field: { value, onChange } }) => (
                                    <Switch
                                        checked={value}
                                        onCheckedChange={onChange}
                                    />
                                )}
                            />
                            {errors.isActive && <p className="text-sm text-red-600">{errors.isActive.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button type="submit" form="customer-form" disabled={loading}>
                            {messageButton}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form >
        </Dialog >
    )
}
