import type { Pair } from '$lib/types';
import { type Amount } from '@chromia/ft4';
import { PRICE_PRECISION } from './swaps';

export type Provision = [amount1: bigint, amountCcy: bigint];

export function calcLiqProvision(
	amountIn1: bigint,
	amount1: bigint,
	amount2: bigint
): [amount1: bigint, amount2: bigint] {
	return [amountIn1, (amountIn1 * amount2) / amount1];
}

/**
 * Calculates the provision for a given amount of liquidity tokens.
 * @param amountIn - The amount of liquidity tokens to be provisioned.
 * @param pair - The pair to be provisioned.
 * @param fromCcy - Whether the provision is from the Choccy or the Asset1.
 * @returns The provision for the given amount of liquidity tokens, with asset1 as the first element.
 */
export function calcPairProvision(amountIn: Amount, pair: Pair, fromCcy: boolean): Provision {
	const liq1 = fromCcy ? pair.amountCcy : pair.amount1;
	const liq2 = fromCcy ? pair.amount1 : pair.amountCcy;

	const amountOut = calcLiqProvision(amountIn.value, liq1, liq2);

	return fromCcy ? amountOut.reverse() as Provision : amountOut;
}

export function calcAmountsFromLpTokens(amountLp: Amount, pair: Pair): Provision {
	const lpSupply = pair.lpToken.supply;

	const ratio = (amountLp.value * PRICE_PRECISION) / lpSupply;

	const amount1 = pair.amount1;
	const amountCcy = pair.amountCcy;

	return [(amount1 * ratio) / PRICE_PRECISION, (amountCcy * ratio) / PRICE_PRECISION];
}

export function calcLpTokensFromAmountInOrOut(amount: bigint, pair: Pair, fromCcy: boolean) {
	const lpSupply = pair.lpToken.supply;
	const liq = fromCcy ? pair.amountCcy : pair.amount1;

	return (amount * lpSupply) / liq;
}
