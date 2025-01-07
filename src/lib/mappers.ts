import { createAmountFromBalance, createAssetObject, type Asset } from "@chromia/ft4";
import type { Order, OrderResponse, Pair, PairResponse } from "./types";

export function mapPair(pair: PairResponse, ccy: Asset): Pair {
    return {
        id: pair.id,
        name: pair.name,
        asset1: createAssetObject(pair.asset1),
        ccy,
        amount1: pair.amount1,
        amountCcy: pair.amount_ccy,
        lpToken: createAssetObject(pair.lp_token),
    }
}

export function mapOrder(order: OrderResponse, ccy: Asset): Order {
    const pair = mapPair(order.pair, ccy)
    const decimals = (order.buy_ccy? pair.asset1 : pair.ccy).decimals
    return {
        id: order.id,
        pair,
        accountId: order.account_id,
        price: order.price,
        buyCcy: order.buy_ccy,
        amount: createAmountFromBalance(order.amount, decimals),
        deadline: new Date(order.deadline),
    }
}