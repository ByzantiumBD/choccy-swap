import type { Amount, Asset, AssetResponse } from "@chromia/ft4";

export type TokenInfo = {
    asset: Asset;
    amountOwned: Amount;
}

export type ChainStats = {
    executed_orders: number;
    executed_swaps: number;
    registered_accounts: number;
    registered_assets: number;
    registered_pairs: number;
}

export type AlertType = {
    id: number;
    text: string;
    ttl: number;
    isError: boolean;
    link: string;
}

export type PairResponse = {
    id: Buffer;
    name: string;
    asset1: AssetResponse;
    amount1: bigint;
    amount_ccy: bigint;
    lp_token: AssetResponse;
}

export type Pair = {
    id: Buffer;
    name: string;
    asset1: Asset;
    ccy: Asset;
    amount1: bigint;
    amountCcy: bigint;
    lpToken: Asset;
}

export type Paginator<T> = {
    data: Array<T>;
} & ({
    loadMore: () => Promise<Paginator<T>>;
    hasMore: true;
} | {
    hasMore: false;
});

export enum AssetFilter {
    ByName, BySymbol, ById
}

export type OrderResponse = {
    id: Buffer;
    pair: PairResponse;
    account_id: Buffer;
    price: bigint;
    buy_ccy: boolean;
    amount: bigint;
    deadline: number;
}

export type Order = {
    id: Buffer;
    pair: Pair;
    accountId: Buffer;
    price: bigint;
    buyCcy: boolean;
    amount: Amount;
    deadline: Date;
}