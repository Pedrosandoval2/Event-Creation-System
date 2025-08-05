import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components";
import { desactiveCustomer } from "@/services/customers/descativeCustomer";
import { getFullName } from "@/utils/formatName";
import { toast } from "react-toastify";

interface Props {
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: () => void;
    onClose: () => void;
    deletingCustomer: { firstName: string; lastName: string; id: number } | null;
}

export const ModalDeleteCustomer = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, onClose, deletingCustomer }: Props) => {

    const fetchDesactivateCustomer = async () => {
        if (!deletingCustomer) {
            toast.error("No se ha seleccionado ningún cliente para desactivar.");
            return;
        }
        try {
            const response = await desactiveCustomer({ id: deletingCustomer.id });
            if (response.status === 200) {
                setIsDeleteDialogOpen();
            }
            toast.success("Cliente desactivado correctamente");
        } catch (error) {
            console.error("Error al desactivar el cliente:", error);
            toast.error("Error al desactivar el cliente");
            throw new Error("Error al desactivar el cliente");
        }
    }

    return (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Se desactivará el cliente hasta que se vuelva a activarlo y no se visualizará en otras vistas{" "}
                        <strong>{deletingCustomer && getFullName(deletingCustomer)}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={fetchDesactivateCustomer} className="bg-red-600 hover:bg-red-700 text-black dark:text-white">
                        Desactivar Cliente
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
