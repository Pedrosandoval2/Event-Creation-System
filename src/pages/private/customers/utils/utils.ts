import type { Customer } from "../interfaces/customers"

export const getFullName = (customer: Pick<Customer, "firstName" | "lastName">) => {
    return `${customer.firstName} ${customer.lastName}`.trim()
}