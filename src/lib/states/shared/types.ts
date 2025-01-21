import type { Order, ReadablePriceType } from "$lib/types";
import type { Connection, Session } from "@chromia/ft4";
import type { UseAppKitAccountReturn } from "@reown/appkit";
import type { Eip1193Provider } from "ethers";

export type ConnectionState = {
    provider: Eip1193Provider | undefined,
    account: UseAppKitAccountReturn | undefined,
    session: Session | undefined,
    connection: Connection | undefined,
    loading: boolean,
}

export type AllOrdersType = {
    [pairId: string]: {
        orders: Order[],
        updater: NodeJS.Timeout | undefined
    }
}

export function disconnectedState(): ConnectionState {
    return {
        provider: undefined,
        account: undefined,
        session: undefined,
        connection: undefined,
        loading: true,
    }
}

export type PerthouPriceRange = {
    start: bigint;
    end: bigint | undefined;
};

export type OrderInfoSection = {
    number: number;
    volume: bigint;
    priceRange: string;
    startPrice: bigint;
    endPrice: bigint;
};
export type OrderInfo = {
    number: string;
    volume: string;
    symbol: string;
    priceRange: string;
    width: number;
    tooltip: TooltipData;
};
export type TooltipData = {
    one: ReadablePriceType;
    two: ReadablePriceType;
};