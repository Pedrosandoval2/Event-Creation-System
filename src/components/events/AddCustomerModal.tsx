
import { useState, useEffect } from "react"
import {
  Button,
  Input,
  Label,
  Textarea,
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components"

import { UserPlus } from "lucide-react"

import { formatCurrency } from "@/utils/formatCurrency"

import type { CreateCustomer, CreateCustomerEventFormData, Payment } from "@/pages/private/event/interfaces/customerEvent"
import type { Event } from "@/pages/private/event/interfaces/event"

import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { eventPaymentSchema } from "@/pages/private/event/schema/createCustomerEvent"
import { createCustomerEvent } from "@/services/customesEvents/createCustomerEvent"
import { toast } from "react-toastify"
import { updateCustomerEvent } from "@/services/customesEvents/updateCustomerEvent"
import { getCustomersByEvent } from "@/services/customers/getCustomersByEvent"
import type { Customer } from "@/pages/private/customers/interfaces/customers"

interface AddCustomerModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly event: Pick<Event, "id" | "name_event" | "price_unit">
  readonly initialValue: CreateCustomer
  readonly handleReloadCustomers: () => void
  readonly openModalType: { type: "add" | "edit"; customerEventId: number };
  readonly onReloadEvent: () => void;
}

const allTitles = ['Efectivo', 'Yape', 'Plin'];

export function AddCustomerModal({ isOpen, onClose, event, initialValue, handleReloadCustomers, openModalType, onReloadEvent }: AddCustomerModalProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(initialValue.payments);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const { ...rest } = initialValue;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateCustomerEventFormData>({
    defaultValues: {
      ...rest,
      customerId: initialValue.customer.id,
    },
    mode: "onBlur",
    resolver: yupResolver(eventPaymentSchema(event.price_unit))
  });

  const typeEditOrAdd = openModalType.type === "add";

  const onSubmit = async (data: CreateCustomerEventFormData) => {
    try {
      setIsLoading(true);

      const response = typeEditOrAdd ? await createCustomerEvent(data) : await updateCustomerEvent({ id: openModalType.customerEventId, payload: data });
      console.log("🚀 ~ onSubmit ~ response:", response)

      toast.success("Cliente agregado correctamente");
      handleReloadCustomers();
      onReloadEvent();
      onClose();
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Error al crear el cliente del evento");
      throw new Error("Error al crear el cliente del evento");
    } finally {
      setIsLoading(false);
    }
  }

  const fetchCustomersByEvent = async () => {
    try {
      const response = await getCustomersByEvent({ idEvent: event.id });
      if (!response.data || response.data.length === 0) {
        setCustomers([initialValue.customer]);
      }
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers by event:", error);
      toast.error("Error al obtener los clientes del evento");
      throw new Error("Error al obtener los clientes del evento");

    }
  };

  useEffect(() => {
    fetchCustomersByEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  const quantity = watch("quantity", 0);
  const paymentsMount = payments.reduce((acumulador, valor) => {
    if (isNaN(valor.amount)) return acumulador;
    if (valor.amount < 0) return acumulador;
    return acumulador + valor.amount;
  }, 0)

  const totalAmount = quantity * event.price_unit;

  const handleFormChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newPayments = [...payments];
    newPayments[index].amount = parseInt(event.target.value);
    setPayments(newPayments);
  };

  // Luego me trae todos los seleccionados
  const used = payments.map(p => p.method);

  // Aquí lo que hace es agregar nuevos campos de pago
  const addFields = () => {

    if (paymentsMount >= totalAmount) return;

    // Primero limita a que sea mayor de 3 campos
    if (payments.length >= 3) return;

    // Luego busca un título que no esté en los usados
    // y lo agrega a los pagos
    const available = allTitles.find(title => !used.includes(title))


    if (!available) return;
    // Agrega un nuevo campo de pago con el valor inicial
    // y el método de pago seleccionado
    setPayments([...payments, { amount: 0, method: available }]);
  };

  // TODO: Aquí se puede usar useFieldArray para manejar los campos de pagos | LUEGO REVISAR EN DOCU
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'payments',
  // });

  const messageButton = typeEditOrAdd ? "Agregar Cliente" : "Actualizar Cliente";

  if (!event) return null


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] z-[60]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Agregar Cliente - {event.name_event}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Precio unitario: {formatCurrency(event.price_unit)}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 flex justify-start flex-col">
            <Label htmlFor="customerId">Cliente *</Label>

            <select
              id="customerId"
              defaultValue={initialValue?.customer.id}
              {...register("customerId")}
              className=" border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#09090B] focus:border-[#fff] dark:bg-[#09090B]"
              required
            >
              <option value="0" disabled selected>Seleccione un cliente</option>
              {
                customers?.map((customer) => (
                  <option className="hover:bg-black text-white bg-[#09090B] focus:bg-[#1e1e2f]" key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName} {customer.isMember ? "(Miembro)" : ""}
                  </option>
                ))
              }
            </select>

            {errors.customerId && <p className="text-sm text-red-500">{errors.customerId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la reserva (opcional)"
              rows={2}
              defaultValue={initialValue?.description || ""}
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              {<Input
                id="quantity"
                type="number"
                min="1"
                defaultValue={initialValue?.quantity || 0}
                {...register("quantity")}
                placeholder="0"
              />}
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Total a Pagar</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center font-semibold">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          <Separator />
          {quantity > 0 &&
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Pago Inicial (Opcional)</h4>
                <button
                  type="button"
                  className="border-black border text-black py-1.5 px-3 rounded-md dark:border-cyan-50 dark:bg-[#09090B] dark:text-white"
                  onClick={() => addFields()}
                >
                  +
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Monto del Pago</Label>
                  {
                    payments.map((_, index) => (
                      <Input
                        key={index + 1}
                        id="paymentAmount"
                        type="number"
                        placeholder="0.00"
                        {...register(`payments.${index}.amount`)}
                        onChange={(e) => handleFormChange(index, e)}
                      />
                    ))
                  }

                </div>

                <div className="space-y-2 flex flex-col justify-end">
                  <Label htmlFor="paymentMethod">Método de Pago</Label>

                  {
                    payments.map((payment: Payment, index: number) => {
                      const used: string[] = payments.map((p: Payment) => p.method);
                      const options: string[] = allTitles.filter((t: string) => !used.includes(t) || t === payment.method);
                      return (
                        <select
                          className=" border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#09090B] focus:border-[#fff] dark:bg-[#09090B]"
                          key={index + 1}
                          defaultValue={initialValue?.payments[index]?.method || payment.method}
                          {...register(`payments.${index}.method`)}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFormChange(index, e)}
                        >
                          {options.map((option: string) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )
                    })
                  }

                </div>

              </div>
              {errors.payments?.[0] && (
                <p className="text-sm text-red-500">{(errors.payments[0] as { method?: { message?: string } }).method?.message}</p>
              )}
              {errors.payments?.[0] && (
                <p className="text-sm text-red-500">{(errors.payments[0] as { amount?: { message?: string } }).amount?.message}</p>
              )}
              {errors.payments?.root?.message && (
                <p className="text-sm text-red-500">{errors.payments.root.message}</p>
              )}

              {paymentsMount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 dark:bg-black dark:border-emerald-500">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Total a pagar:</span>
                      <span className="font-semibold">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Pago inicial:</span>
                      <span className="font-semibold">-{formatCurrency(paymentsMount)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Saldo pendiente:</span>
                      <span className="text-red-600">
                        {formatCurrency(totalAmount - paymentsMount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Cargando..." : (messageButton)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
