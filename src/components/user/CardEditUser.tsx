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
import type { UserEditFormValuesI, UserFormValuesI } from "@/pages/private/users/interfaces/user";
// Ensure all fields in UserEditFormValuesI are required to match the schema
import { editUserSchema } from "@/pages/private/users/schema/editUser";
import { editUser } from "@/services/users/updateUser";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";


interface Props {
  isEditDialogOpen: boolean;
  selectedUser: UserFormValuesI;
  setIsEditDialogOpen: (open: boolean) => void;
  closeEditDialog: () => void;
}

export const CardEditUser = ({
  isEditDialogOpen,
  selectedUser,
  setIsEditDialogOpen,
  closeEditDialog
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, formState: { errors }, register, control } = useForm<UserEditFormValuesI>({
    defaultValues: {
      email: selectedUser.data.email,
      firstName: selectedUser.data.firstName,
      lastName: selectedUser.data.lastName,
      role: selectedUser.data.role,
      isActive: selectedUser.data.isActive,
    },
    resolver: yupResolver(editUserSchema)
  })

  const onSubmit = async (data: UserEditFormValuesI) => {
    setIsLoading(true);
    try {
      const response = await editUser({ id: selectedUser.id, payload: data });
      if (response.status !== 200) {
        toast.error("Error al actualizar el usuario");
        throw new Error('Error al actualizar el usuario');
      }
      toast.success("Usuario actualizado correctamente");
      closeEditDialog();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                {...register("firstName")}
              />
              {errors.firstName && <span className='text-red-600'>{errors.firstName.message}</span>}
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                {...register("lastName")}
              />
              {errors.lastName && <span className='text-red-600'>{errors.lastName.message}</span>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
              />
              {errors.email && <span className='text-red-600'>{errors.email.message}</span>}
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <span className='text-red-600'>{errors.role.message}</span>}
            </div>
            <div>
              <Label htmlFor="isActive">Estado</Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ? 'activo' : 'inactivo'} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.isActive && <span className='text-red-600'>{errors.isActive.message}</span>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              {/* <button type="submit">
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button> */}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
