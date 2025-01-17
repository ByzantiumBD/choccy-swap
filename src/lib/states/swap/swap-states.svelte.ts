import { newSwapData } from "./types";

export const isProMode = $state({value: false});

export const swapData = $state(newSwapData())