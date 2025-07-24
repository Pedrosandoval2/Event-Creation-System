"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    Input,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    TableCell,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Select,
} from "@/components"

import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { CardEditUser } from "@/components/user/CardEditUser"
import { useGetUsers } from "@/hooks/useGetUsers"
import { useDebounce } from "@/hooks/useDebounce"
import type { UserEditFormValuesI, UserFormValuesI } from "./interfaces/user"


export default function Users() {
    const { data, error, isLoading, fetchUsers, page, setPage, limit, totalPages } = useGetUsers();
    console.log("🚀 ~ Users ~ data:", data)
    const [search, setSearch] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState(limit?.toString());
    const debouncedSearch = useDebounce(search);
    const [selectedUser, setSelectedUser] = useState<UserFormValuesI>()

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    useEffect(() => {
        fetchUsers({ query: debouncedSearch || null, page, limit: Number(currentQuantity) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, currentQuantity, page]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearch(e.target.value)
    }

    const closeEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedUser(undefined);
        fetchUsers({ query: debouncedSearch, page: 1, limit: Number(currentQuantity) });
    }



    if (error) return <div>Error al cargar los usuarios</div>

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Gestión de Usuarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Barra de búsqueda y botón agregar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar usuarios..."
                                className="pl-10"
                                value={search}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Tabla de usuarios */}
                    {<div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Aquí se mapearían los usuarios filtrados */}
                                {data?.map((user) => (
                                    <TableRow key={user.firstName + user.email}>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.isActive ? 'Activo' : 'Inactivo'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedUser({ id: user.id, data: user as UserEditFormValuesI })
                                                    setIsEditDialogOpen(true)
                                                }}
                                            >
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>}

                    {/* Paginación */}
                    <div className="flex items-center gap-2">
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
                </CardContent>
            </Card>

            {(isEditDialogOpen && selectedUser) && (
                <CardEditUser
                    isEditDialogOpen={isEditDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    selectedUser={selectedUser}
                    closeEditDialog={closeEditDialog}
                />
            )}
        </div>
    )
}
