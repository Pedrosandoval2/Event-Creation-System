
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { UserPlus } from "lucide-react"
import { formatCurrency } from "@/utils/formatCurrency"
import type { CreateCustomerEventFormData, EventCustomer } from "@/pages/private/event/interfaces/customerEvent"
import type { Customer, Event } from "@/pages/private/event/interfaces/event"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { getCustomers } from "@/services/events/getCustomers"
import { eventPaymentSchema } from "@/pages/private/event/schema/createCustomerEvent"

interface AddCustomerModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly event: Pick<Event, "id" | "name_event" | "price_unit">
  readonly initialValue: EventCustomer
}

const payments = [
  { id: 1, title: "Efectivo" },
  { id: 3, title: "Yape" },
  { id: 4, title: "Plin" },
]
// TODO: Realizar el multiple payments logic
export function AddCustomerModal({ isOpen, onClose, event, initialValue, }: AddCustomerModalProps) {

  const [customers, setCustomers] = useState<Customer[]>([])

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<CreateCustomerEventFormData>({
    defaultValues: initialValue,
    mode: "onBlur",
    resolver: yupResolver(eventPaymentSchema(event.price_unit))
  });

  const onCloseModal = () => {
    onClose();
    reset()
  }

  const onSubmit = (data: CreateCustomerEventFormData) => {
    console.log("Form data:", data)

    onCloseModal();
  }

  const handleCustomers = async () => {
    const customer = await getCustomers({ idEvent: event.id });
    setCustomers(customer.data);
  }

  useEffect(() => {
    handleCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  const quantity = watch("quantity", 0);
  const paymentsMount = watch("paymentsMount", 0);
  const totalAmount = quantity * event.price_unit;

  if (!event) return null



  return (
    <Dialog open={isOpen} onOpenChange={onCloseModal}>
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
              defaultValue="0"
              {...register("customerId")}
              className=" border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#09090B] focus:border-[#fff] dark:bg-[#09090B]"
              required
            >
              <option value="0" disabled selected>Seleccione un cliente</option>
              {
                customers.map((customer) => (
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Pago Inicial (Opcional)</h4>
              <button type="button" className="border-black border text-black py-1.5 px-3 rounded-md dark:border-cyan-50 dark:bg-[#09090B] dark:text-white">+</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Monto del Pago</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="1"
                  max={totalAmount}
                  placeholder="0.00"
                  {...register("paymentsMount")}
                />
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="1"
                  max={totalAmount}
                  placeholder="0.00"
                  {...register("paymentsMount")}
                />
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <select
                  {...register("paymentMethod")}
                  className=" border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#09090B] focus:border-[#fff] dark:bg-[#09090B]"
                >
                  {
                    payments.map((payment) => (
                      <option className="hover:bg-black text-white bg-[#09090B] focus:bg-[#1e1e2f]" key={payment.id} value={payment.id}>
                        {payment.title}
                      </option>
                    ))
                  }
                </select>
                <select
                  {...register("paymentMethod")}
                  className=" border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#09090B] focus:border-[#fff] dark:bg-[#09090B]"
                >
                  {
                    payments.map((payment) => (
                      <option className="hover:bg-black text-white bg-[#09090B] focus:bg-[#1e1e2f]" key={payment.id} value={payment.id}>
                        {payment.title}
                      </option>
                    ))
                  }
                </select>

              </div>

            </div>
            <div>{errors.paymentsMount && <p className="text-sm text-red-500">{errors.paymentsMount.message}</p>}</div>

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
                    <span className="font-semibold">-{formatCurrency(watch('paymentsMount'))}</span>
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

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">Agregar Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
