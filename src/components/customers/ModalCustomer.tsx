import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Switch, } from "@/components"
import type { CreateCustomer } from "@/pages/private/customers/interfaces/customers";
import { customerSchema } from "@/pages/private/customers/schema/createCustomersSchema";
import { createCustomer } from "@/services/customers/createCustomer";
import { updateCustomer } from "@/services/customers/updateCustomer";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    customer: CreateCustomer | null;
    typeModal: "edit" | "create";
    customerId: number; // Optional, only needed for edit mode
}

const initialCustomer: CreateCustomer = {
    firstName: "",
    lastName: "",
    phone: "",
    isMember: false,
    isActive: true,
}

// Error porqué no da el botón y listo.

export const ModalCustomer = ({ isOpen, onClose, customer, typeModal, customerId }: Props) => {

    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<CreateCustomer>({
        defaultValues: customer || initialCustomer,
        mode: "onBlur",
        resolver: yupResolver(customerSchema)
    });

    console.log("🚀 ~ ModalCustomer ~ getValues:", getValues());

    console.log("🚀 ~ ModalCustomer ~ errors:", errors)
    const onSubmit = async (data: CreateCustomer) => {
        console.log("🚀 ~ onSubmit ~ data:", data)
        try {
            setLoading(true);
            const response = typeModal === "edit"
                ? await updateCustomer({ id: customerId, payload: data })
                : await createCustomer({ payload: data });

            if (response.status === 200 || response.status === 201) {
                toast.success(typeModal === "edit" ? "Cliente actualizado correctamente." : "Cliente creado correctamente.");
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

    // Extract button text logic into a variable
    // let buttonText: string;
    // if (loading) {
    //     buttonText = typeModal === "edit" ? "Guardando..." : "Agregando...";
    // } else {
    //     buttonText = typeModal === "edit" ? "Guardar cambios" : "Agregar cliente";
    // }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+34 600 000 000"
                                {...register("phone")}
                            />
                            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Miembro</Label>
                                <p className="text-sm text-muted-foreground">¿Es miembro?</p>
                            </div>
                            <Switch
                                defaultChecked={customer?.isMember || false}
                                {...register("isMember")}
                            />
                            {errors.isMember && <p className="text-sm text-red-600">{errors.isMember.message}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Estado Activo</Label>
                                <p className="text-sm text-muted-foreground">¿Está activo el cliente?</p>
                            </div>
                            <Switch
                                defaultChecked={customer?.isMember || false}
                                {...register("isActive")}
                            />
                            {errors.isActive && <p className="text-sm text-red-600">{errors.isActive.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
