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
import { getFullName } from "@/pages/private/customers/utils/utils";

interface Props {
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (open: boolean) => void;
    deletingCustomer: { firstName: string; lastName: string } | null;
    handleConfirmDelete: () => void;
}

export const ModalDeleteCustomer = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, deletingCustomer, handleConfirmDelete }: Props) => {
    return (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente{" "}
                        <strong>{deletingCustomer && getFullName(deletingCustomer)}</strong> y todos los datos asociados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                        Eliminar Cliente
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
