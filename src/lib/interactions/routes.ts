import type { Pair } from '$lib/types';
import { createAmountFromBalance, op, type Amount } from '@chromia/ft4';
import { calcInputIncludingOrders, calcOutputIncludingOrders } from './swaps';
import type { Queryable } from 'postchain-client';
import { OfflineError, SwapError } from '$lib/errors';

export async function calcOutput(
	queryable: Queryable | undefined,
	input: Amount,
	fromCcy: boolean,
	pair1: Pair | undefined,
	pair2: Pair | undefined
) {
	if (!queryable) {
		throw new OfflineError('Connection lost. Please reload the page.');
	}
	if (pair1 === undefined) {
		return createAmountFromBalance(0n, 0);
	}

	const intermediateOutput = await calcOutputIncludingOrders(queryable, pair1, input, !fromCcy);
	const decimals = fromCcy ? pair1.asset1.decimals : pair1.ccy.decimals;
	const intermAmount = createAmountFromBalance(intermediateOutput, decimals);
	if (pair2 === undefined) {
		return intermAmount;
	} else {
		if (fromCcy) throw new SwapError('Cannot use two pools when starting from CCY');
		const endVal = await calcOutputIncludingOrders(queryable, pair2, intermAmount, false);
		return createAmountFromBalance(endVal, pair2.asset1.decimals);
	}
}
export async function calcInput(
	queryable: Queryable,
	output: Amount,
	fromCcy: boolean,
	pair1: Pair | undefined,
	pair2: Pair | undefined
) {
	if (pair1 === undefined) {
		return createAmountFromBalance(0n, 0);
	}

	if (pair2 === undefined) {
		const endVal = await calcInputIncludingOrders(queryable, pair1, output, !fromCcy);
		const decimals = fromCcy ? pair1.ccy.decimals : pair1.asset1.decimals;
		return createAmountFromBalance(endVal, decimals);
	} else {
		if (fromCcy) throw new SwapError('Cannot use two pools when starting from CCY');

		const intermediateOutput = await calcInputIncludingOrders(queryable, pair2, output, false);
		const endVal = await calcInputIncludingOrders(
			queryable,
			pair1,
			createAmountFromBalance(intermediateOutput, pair1.ccy.decimals),
			true
		);
		return createAmountFromBalance(endVal, pair1.asset1.decimals);
	}
}

function createSwapOperation(
	pair: Pair,
	buyCcy: boolean,
	amountIn: Amount,
	amountOutMin: Amount,
	deadline: number
) {
	const expectedDecimalsIn = buyCcy ? pair.asset1.decimals : pair.ccy.decimals;
	const expectedDecimalsOut = buyCcy ? pair.ccy.decimals : pair.asset1.decimals;
	if (amountIn.decimals !== expectedDecimalsIn) throw new SwapError('Amount in has wrong decimals');
	if (amountOutMin.decimals !== expectedDecimalsOut)
		throw new SwapError('Amount out has wrong decimals');

	if (deadline <= new Date().getTime()) throw new SwapError('Deadline is in the past');

	return op(
		'swap',
		/*asset:      */ pair.id,
		/*buy_ccy:    */ buyCcy,
		/*amount:     */ amountIn.value,
		/*amount_min: */ amountOutMin.value,
		/*deadline:   */ deadline
	);
}

function createDoubleSwapOperation(
	pair1: Pair,
	pair2: Pair,
	amountIn: Amount,
	amountOutMin: Amount,
	deadline: number
) {
	const expectedDecimalsIn = pair1.asset1.decimals;
	const expectedDecimalsOut = pair2.asset1.decimals;
	if (amountIn.decimals !== expectedDecimalsIn) throw new SwapError('Amount in has wrong decimals');
	if (amountOutMin.decimals !== expectedDecimalsOut)
		throw new SwapError('Amount out has wrong decimals');

	if (deadline <= new Date().getTime()) throw new SwapError('Deadline is in the past');

	return op(
		'double_swap',
		/*asset1:     */ pair1.id,
		/*asset2:     */ pair2.id,
		/*amount:     */ amountIn.value,
		/*amount_min: */ amountOutMin.value,
		/*deadline:   */ deadline
	);
}

export function getCorrectSwapOperation(
	pair1: Pair | undefined,
	pair2: Pair | undefined,
	buyCcy: boolean,
	amountIn: Amount,
	amountOutMin: Amount,
	deadline: number
) {
	if (pair1 === undefined) throw new SwapError('Pair1 is undefined');
	if (pair2 === undefined) {
		return createSwapOperation(
            pair1, buyCcy, amountIn, amountOutMin, deadline
        )
	} else {
		return createDoubleSwapOperation(
            pair1, pair2, amountIn, amountOutMin, deadline
        )
	}
}
