import type { Pair } from "$lib/types";

export type PoolsData = {
    showVerifiedOnly: boolean;
    query: string;
    allPairs: PairState[];
}
export type PairState = { pair: Pair, loading: boolean };


export function newPoolsData(): PoolsData {
    return {
        showVerifiedOnly: true,
        query: "",
        allPairs: [],
    }
}