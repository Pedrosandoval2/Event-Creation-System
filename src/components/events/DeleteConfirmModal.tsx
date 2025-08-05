
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onConfirm: () => void
  readonly eventName: string
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, eventName }: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-left">
            ¿Estás seguro de que deseas eliminar el evento <span className="font-semibold">"{eventName}"</span>?
            <br />
            <br />
            Esta acción también eliminará todos los clientes y pagos asociados al evento.
            <br />
            <br />
            <span className="text-red-600 font-medium">Esta acción no se puede deshacer.</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar Evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
