import { getAllPairsByLiquidity } from "$lib/interactions/queries";
import { getPairInfo } from "$lib/interactions/swaps";
import { getCcy, sequentialize } from "$lib/interactions/utils";
import type { Pair } from "$lib/types";
import { getId, isVerified } from "$lib/utils";
import { poolsData } from "./pool-states.svelte";

function makeComparable(x: Pair) {
    return {
        id: getId(x.id),
        name: x.asset1.name.toLowerCase(),
        symbol: x.asset1.symbol.toLowerCase(),
    };
}

export function getFilteredPairs() {
    return poolsData.allPairs
        .filter(p => showPair(p.pair))
        .toSorted((_a, _b) => {
            const a = makeComparable(_a.pair);
            const b = makeComparable(_b.pair);
            
            if (a.id === poolsData.query) return -1
            if (b.id === poolsData.query) return 1

            const aMatchesByNameOrSymbol = a.name.includes(poolsData.query)
            const bMatchesByNameOrSymbol = b.name.includes(poolsData.query)

            if (aMatchesByNameOrSymbol) return -1
            if (bMatchesByNameOrSymbol) return 1

            return Number(_b.pair.amountCcy - _a.pair.amountCcy)
        })
}

function showPair(_p: Pair) {
    const p = makeComparable(_p)
    if (p.id === poolsData.query) return true
    if (poolsData.showVerifiedOnly && !isVerified(_p.id)) return false;
    if (poolsData.query) {
        if (
            p.name.includes(poolsData.query) ||
            p.symbol.includes(poolsData.query) ||
            p.id.startsWith(poolsData.query)
        ) return true;
        return false;
    }
    return true;
}

export async function loadPairs() {
    const ccy = await getCcy();
    const nextPool = sequentialize(await getAllPairsByLiquidity(ccy));

    let lastPair = undefined;
    do {
        lastPair = await nextPool();
        if (lastPair !== undefined) {
            poolsData.allPairs.push({ pair: lastPair, loading: false });
        }
    } while (lastPair !== undefined);
};

export async function updatePairStats(id: Buffer) {
    const idx = poolsData.allPairs.findIndex(p => p.pair.id.compare(id) === 0);

    poolsData.allPairs[idx].loading = true;

    poolsData.allPairs[idx].pair = await getPairInfo(poolsData.allPairs[idx].pair.id)

    poolsData.allPairs[idx].loading = false;
}