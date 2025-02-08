import type { Order, Pair } from "$lib/types";

export type OrdersData = {
    allOrders: Order[];
}

export function newOrdersData(): OrdersData {
    return {
        allOrders: [],
    }
}