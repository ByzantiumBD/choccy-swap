import { formatter, type BufferId, type Queryable } from 'postchain-client';
import { getCcy, handlePagination } from './utils';
import { mapOrder, mapPair } from '$lib/mappers';
import type { Order, OrderResponse, Paginator, Pair, PairResponse } from '$lib/types';
import type { Asset } from '@chromia/ft4';
import { connectionState } from '$lib/states/shared/connection-state.svelte';

export const ALL_PAIRS_QUERY_NAME = 'get_all_pairs_by_liquidity';
export const ALL_ORDERS_QUERY_NAME = 'get_orders_by_price_range';

export async function getAllPairsByLiquidity(
	ccy: Asset,
	name: string = '',
	symbol: string = '',
	id: BufferId = '',
	queryable: Queryable = connectionState.connection!
): Promise<Paginator<Pair>> {
	return handlePagination<Pair, PairResponse>(
		queryable,
		(x) => x.map((y) => mapPair(y, ccy)),
		ALL_PAIRS_QUERY_NAME,
		null,
		null,
		{ name_start: name, symbol_start: symbol, id_start: formatter.ensureBuffer(id) }
	);
}

export async function getAllOrdersByPriceRange(
	assetId: BufferId,
	priceMin: bigint,
	priceMax: bigint,
	queryable: Queryable = connectionState.connection!
): Promise<Paginator<Order>> {
	const ccy = await getCcy();
	return handlePagination<Order, OrderResponse>(
		queryable,
		(x) => x.map((y) => mapOrder(y, ccy)),
		ALL_ORDERS_QUERY_NAME,
		null,
		null,
		{
            asset: formatter.ensureBuffer(assetId),
            price_range: {
                min: priceMin,
                max: priceMax
            }
        }
	);
}
