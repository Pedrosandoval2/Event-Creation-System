export const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return "S/ 0.00";
    if (amount.toString().includes(".")) return `S/ ${amount}`
    return `S/ ${amount}.00`
}

export const formatCurrencyWithZeros = (amount: number) => {
    return Number(amount.toString().replace('.00', ' '));
}