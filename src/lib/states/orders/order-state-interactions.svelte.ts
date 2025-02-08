import { getAllOrdersByAccount } from "$lib/interactions/queries";
import { sequentialize } from "$lib/interactions/utils";
import type { Order, Pair } from "$lib/types";
import { CCY_ID, getId, isCcy } from "$lib/utils";
import { untrack } from "svelte";
import { connectionState } from "../shared/connection-state.svelte";
import { swapData } from "../swap/swap-states.svelte";
import { ordersData } from "./order-states.svelte";
import type { BufferId } from "postchain-client";

function makeComparable(x: Pair) {
    return {
        id: getId(x.id),
        name: x.asset1.name.toLowerCase(),
        symbol: x.asset1.symbol.toLowerCase(),
    };
}

export function getFilteredOrders(filterId: BufferId | undefined) {
    return ordersData.allOrders
        .filter(o => showOrder(o, filterId))
}

function showOrder(o: Order, filterId: BufferId | undefined) {
    if (!filterId || getId(filterId)===CCY_ID) return true;
    return getId(o.pair.asset1.id) === getId(filterId)
}

export async function loadOrders(forceUpdate = false) {
    const ownerIdOrUndefined = untrack(() => ordersData.allOrders[0]?.accountId.toString("hex"));
    const accountIdOrUndefined = connectionState.session?.account.id.toString("hex");
    if (!forceUpdate && ownerIdOrUndefined === accountIdOrUndefined) return;
    ordersData.allOrders = [];

    if (!connectionState.session) return;
    const nextOrder = sequentialize(await getAllOrdersByAccount(connectionState.session.account.id));

    let lastOrder = undefined;
    do {
        lastOrder = await nextOrder();
        if (lastOrder !== undefined) {
            ordersData.allOrders.push(lastOrder);
        }
    } while (lastOrder !== undefined);

    const allOrderIds: string[] = []

    ordersData.allOrders = ordersData.allOrders.filter((o) => {
        const id = getId(o.id)
        const duplicate = allOrderIds.includes(id);
        if (duplicate) return false;
        allOrderIds.push(id)
        return true;
    })
};