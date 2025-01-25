import { newLiquidityData, newOrderData, newSwapData } from "./types";

export const isProMode = $state({value: false});

export const swapData = $state(newSwapData())
export const liquidityData = $state(newLiquidityData())
export const orderData = $state(newOrderData())