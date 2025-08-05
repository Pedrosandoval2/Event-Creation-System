import { useState, useEffect } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  SidebarTrigger,
  Separator,
  Button,
  Input,
  Badge,
} from "@/components"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Users2, Loader2, Phone, Crown } from "lucide-react"
import { useGetCustomers } from "@/hooks/useGetCustomers"
import { useDebounce } from "@/hooks/useDebounce"
import { formatDateV2 } from "@/utils/formatDate"
import type { Customer } from "./interfaces/customers"
import { ModalCustomer } from "@/components/customers/ModalCustomer"
import { getFullName } from "./utils/utils"



const getInitials = (customer: Customer) => {
  return `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase()
}
// Mock data con la estructura exacta que proporcionaste

export default function CustomersPage() {

  const { data, isLoading, error, limit, page, fetchCustomers, totalPages, totalCustomers, setTotalCustomers, setPage } = useGetCustomers();
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search);
  const [currentQuantity, setCurrentQuantity] = useState(limit?.toString());

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers({ query: debouncedSearch, page: 1, limit: 10 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, currentQuantity, page])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value)
  }

  const handleCloseEditCustomerDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedCustomer(null);
  }
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  }

  if (error) return <div>Error loading customers</div>

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestión de Clientes</h1>
        <div className="ml-auto">
          {/* <ThemeToggle /> */}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users2 className="h-5 w-5" />
                    Clientes ({totalCustomers})
                  </CardTitle>
                  <CardDescription>Gestiona tu base de clientes y su información</CardDescription>
                </div>
                <Button onClick={() => setIsEditDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Cliente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={search}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                <Select value={currentQuantity} onValueChange={(value) => setCurrentQuantity(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 por página</SelectItem>
                    <SelectItem value="10">10 por página</SelectItem>
                    <SelectItem value="20">20 por página</SelectItem>
                    <SelectItem value="50">50 por página</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customers Table */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Cargando clientes...
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Membresía</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha de Registro</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No se encontraron clientes
                            </TableCell>
                          </TableRow>
                        ) : (
                          data?.map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={`/placeholder.svg?height=32&width=32`}
                                      alt={getFullName({
                                        firstName: customer.firstName,
                                        lastName: customer.lastName
                                      })}
                                    />
                                    <AvatarFallback>{getInitials(customer)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{getFullName({
                                      firstName: customer.firstName,
                                      lastName: customer.lastName
                                    })}</div>
                                    <div className="text-sm text-muted-foreground">ID: {customer.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {customer.phone ? (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">{customer.phone}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Sin teléfono</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {customer.isMember ? (
                                    <Badge
                                      variant="secondary"
                                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    >
                                      <Crown className="h-3 w-3 mr-1" />
                                      Miembro
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                    >
                                      Regular
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    customer.isActive
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  }
                                >
                                  {customer.isActive ? "Activo" : "Inactivo"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">{formatDateV2(customer.createdAt)}</span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditCustomer(customer)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    // onClick={() => handleDeleteCustomer(customer)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTotalCustomers((prev) => Math.max(prev - 1, 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((currentPage) => currentPage === 1 || currentPage === totalPages || Math.abs(currentPage - page) <= 1)
                            .map((currentPage, index, array) => (
                              <div key={currentPage} className="flex items-center">
                                {index > 0 && array[index - 1] !== currentPage - 1 && (
                                  <span className="px-2 text-muted-foreground">...</span>
                                )}
                                <Button
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setPage(currentPage)}
                                  className="w-8 h-8 p-0"
                                >
                                  {currentPage}
                                </Button>
                              </div>
                            ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={page === totalPages}
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Customer Dialog */}
      {isEditDialogOpen && (
        <ModalCustomer
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditCustomerDialog}
          customer={selectedCustomer}
          typeModal={selectedCustomer ? "edit" : "create"}
          customerId={selectedCustomer?.id || 0}
        />
      )}
      {/* Delete Customer Dialog */}

    </>
  )
}