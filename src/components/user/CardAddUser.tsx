
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Input,
    Button,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components"

interface Props {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (open: boolean) => void;
}

export const CardAddUser = ({ isAddDialogOpen, setIsAddDialogOpen }: Props) => {
    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <form>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="add-name">Nombre</Label>
                            <Input
                                id="add-name"
                                placeholder="Ingresa el nombre completo"
                            />
                        </div>
                        <div>
                            <Label htmlFor="add-email">Email</Label>
                            <Input
                                id="add-email"
                                type="email"

                                placeholder="usuario@email.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="add-role">Rol</Label>
                            <Select >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Usuario">Usuario</SelectItem>
                                    <SelectItem value="Editor">Editor</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="add-status">Estado</Label>
                            <Select >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Activo">Activo</SelectItem>
                                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Agregar Usuario</Button>
                        </div>
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}
