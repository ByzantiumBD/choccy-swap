import type { Paginator, Pair, TokenInfo } from '$lib/types';
import {
	type Connection,
	type Asset,
	type OptionalPageCursor,
	type PaginatedEntity,
	type OptionalLimit,
	retrievePaginatedEntity,
	createAmount,
} from '@chromia/ft4';
import type { DictPair, Queryable, QueryObject, RawGtv } from 'postchain-client';
import { getAllPairsByLiquidity } from './queries';
import { ASSET_IDS, CCY_ID, isCcy } from '$lib/utils';
import { SwapError } from '$lib/errors';
import { getPairInfo } from './swaps';
import { connectionState } from '$lib/states/shared/connection-state.svelte';

let ccy: Asset | undefined = undefined;

export async function getCcy(): Promise<Asset> {
	if (!ccy) {
		ccy = (await connectionState.connection!.getAssetById(CCY_ID)) as Asset;
	}
	return ccy;
}

export async function getFavoriteAssets(connection: Connection): Promise<Asset[]> {
	return Promise.all(ASSET_IDS.map((id) => connection.getAssetById(id))) as Promise<Asset[]>;
}

export async function handlePagination<ReturnType, Response extends RawGtv>(
	queryable: Queryable,
	dataMapper: (arg: Response[]) => ReturnType[],
	queryName: string,
	limit: OptionalLimit = null,
	cursor: OptionalPageCursor = null,
	params: DictPair = {}
): Promise<Paginator<ReturnType>> {
	let pageCursor = cursor;
	let hasMore = true;
	let data: Array<ReturnType> = [];

	function getQueryObj(): QueryObject<PaginatedEntity<RawGtv>, DictPair> {
		return {
			name: queryName,
			args: {
				...params,
				page_size: limit,
				page_cursor: pageCursor
			}
		};
	}

	async function getResponse() {
		if (hasMore) {
			const ret = await retrievePaginatedEntity<ReturnType, Response>(
				queryable,
				getQueryObj(),
				dataMapper
			);
			pageCursor = ret.nextCursor;
			data = data.concat(ret.data);
			hasMore = pageCursor !== null;
			return {
				data,
				loadMore: getResponse,
				hasMore
			};
		}
		return undefined;
	}

	await getResponse();

	if (hasMore) {
		return {
			data,
			loadMore: getResponse as () => Promise<Paginator<ReturnType>>,
			hasMore
		};
	} else {
		return {
			data,
			hasMore
		};
	}
}

export async function searchAssets(query: string) {
	const ccy = await getCcy();
	const idQuery =
		query.match(/^[0-9a-f]{0,64}$/i) === null
			? null
			: query.slice(0, query.length % 2 ? -1 : undefined);

	const namePaginator = await getAllPairsByLiquidity(ccy, query);
	const symbolPaginator = await getAllPairsByLiquidity(ccy, '', query);
	const idPaginator =
		idQuery !== null ? await getAllPairsByLiquidity(ccy, '', '', idQuery) : undefined;

	return {
		byName: namePaginator,
		bySymbol: symbolPaginator,
		byId: idPaginator
	};
}

export async function getTokenInfo(asset: Asset): Promise<TokenInfo> {
	const bal = await connectionState.session?.account.getBalanceByAssetId(asset.id);
	return {
		asset,
		amountOwned: bal?.amount ?? createAmount(0, asset.decimals)
	};
}

export async function getLpTokenInfo(pair: Pair): Promise<TokenInfo> {
	const bal = await connectionState.session?.account.getBalanceByAssetId(pair.lpToken.id);
	return {
		asset: pair.lpToken,
		amountOwned: bal?.amount ?? createAmount(0, pair.lpToken.decimals)
	};
}

export function sequentialize<T>(paginator: Paginator<T>) {
	let p = paginator;
	let i = 0;
	return async () => {
		if (p.data.length > i) {
			return p.data[i++];
		} else if (p.hasMore) {
			p = (await p.loadMore())!;
			return p.data[i++];
		} else return undefined;
	};
}

export async function getPairs(
	fromAsset: Asset | undefined,
	toAsset: Asset | undefined
) {
	if (fromAsset === undefined || toAsset === undefined)
		return { pair1: undefined, pair2: undefined };

	const fromCcy = isCcy(fromAsset);
	const toCcy = isCcy(toAsset);

	if (fromCcy && toCcy) throw new SwapError('Cannot swap from CCY to CCY');

	const pair1 = await (fromCcy
		? getPairInfo(toAsset.id)
		: getPairInfo(fromAsset.id));
	const pair2 = await (fromCcy || toCcy ? undefined : getPairInfo(toAsset.id));

	return { pair1, pair2 };
}
