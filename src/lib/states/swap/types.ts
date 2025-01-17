import type { Pair, TokenInfo } from "$lib/types";
import { createAmount, type Amount } from "@chromia/ft4";

export type SwapData = {
    token1: TokenInfo | undefined;
    token2: TokenInfo | undefined;

    input1: Amount;
    input2: Amount;

    settings: {
        slippage: number;
        deadline: number;
    },

    pair1: Pair | undefined;
    pair2: Pair | undefined;

    impact: number;
}

export function newSwapData(): SwapData {
    return {
        token1: undefined,
        token2: undefined,
    
        input1: createAmount(0,0),
        input2: createAmount(0,0),
    
        settings: {
            slippage: 0.1,
            deadline: 20,
        },
    
        pair1: undefined,
        pair2: undefined,
        
        impact: 0,
    }
}