import { createAmountFromBalance } from '@chromia/ft4';
import { ParsingError } from './errors';
import type { Pair, ReadablePriceType } from './types';

export function removeTrailingZeros(number: string): string {
	return number.replace(/\.0*$/, '').replace(/(?<=\.\d+)0+$/, '');
}

/**
 * Converts a number string to a fixed number of decimal places, avoiding exponential notation
 * @param decimalString the decimals part of a number (5.32 => "32")
 * @param decimals The number of decimal places to fix to
 * @returns The decimal string formatted with the specified decimal places, rounded
 *
 * example "2345", 3 => "235"
 */
export function ensureFixedDecimals(decimalString: string, decimals: number): string {
	return Number('0.' + decimalString)
		.toFixed(decimals)
		.toString()
		.slice(2);
}

/**
 * Converts a long number into a shorter one, removing useless decimals.
 * If it has an integer part, it will keep 3 decimals;
 * if it is only decimal, it will keep 4 decimals as long as they're not all 0s;
 * it will keep the integer part whole.
 *
 * @param number an Amount.toString() or numToString(amount)
 * @returns a short version, which could become "0" if the number is too small
 */
export function shortenNumber(number: string, decimals: number | undefined = undefined) {
	const integer = number.replace(/^0+(?=[1-9])/, '').match(/^\d+/)?.[0];
	const decimal = number.match(/(?<=\.)\d+$/)?.[0];

	if (integer === undefined || integer.match(/^0*$/)) {
		if (decimal === undefined) return '0';
		return removeTrailingZeros('0.' + ensureFixedDecimals(decimal, decimals ?? 4));
	} else {
		if (decimal === undefined || decimal.match(/^0*$/)) return integer;
		return removeTrailingZeros(integer + '.' + ensureFixedDecimals(decimal, decimals ?? 3));
	}
}

/**
 * Converts a long number into a shorter one, removing useless decimals and adding
 * postfixes like "k", "M", "B", etc.
 * 123456 => 1.234M;
 * 1.23456 => 1.234;
 * 0.123456789 => 0.123456
 * 0.00000023 => 0
 * @param number an Amount.toString() or numToString(amount)
 * @returns a short version, which could become "0" if the number is too small
 */
export function makeNumberReadable(number: string) {
	const short = shortenNumber(number);

	if (Number(short) >= 1) {
		return addPostfix(Number(number));
	} else {
		return short;
	}
}

function addPostfix(num: number) {
	const postfixes = ['', 'k', 'M', 'B', 'T', 'Q'];

	function trunc(str: string) {
		const tr = str.match(/^\d*(\.\d{1,3})?/)?.[0] ?? '0';
		return removeTrailingZeros(tr);
	}

	let myNum = num;
	for (let i = 0; i < postfixes.length; i++) {
		if (myNum / 1000 < 1) {
			return trunc(myNum.toString()) + postfixes[i];
		}
		myNum = myNum / 1000;
	}

	let strNum = myNum.toFixed(3);
	if (strNum.match(/e/)) {
		// scientific notation
		strNum = BigInt(myNum * 1000).toString();
		strNum = strNum.slice(0, -3) + '.' + strNum.slice(-3);
	}

	return trunc(myNum.toFixed(3)) + postfixes[postfixes.length - 1];
}

/** never uses exponential notation */
export function numToString(num: number): string {
	const str = num.toString();
	if (str.match(/e/i)) {
		if (str.match(/e-/i)) {
			const zeros = Number(str.match(/e-\d+$/i)![0].replace(/e-/i, ''));
			const decimals = str.replace(/e.*$/, '').replace('.', '');
			return '0.' + '0'.repeat(zeros - 1) + decimals;
		} else {
			let zeros = Number(str.match(/e\+?\d+$/i)![0].replace(/e\+?/i, ''));
			const [int, dec] = str.replace(/e.*$/, '').split('.');
			if (dec) zeros -= dec.length;
			if (zeros >= 0) return int + dec + '0'.repeat(zeros);
			const n = int + dec;
			return n.slice(0, zeros) + '.' + n.slice(zeros);
		}
	}
	return str;
}

export function makeStringValueReadablePrice(amount: string): ReadablePriceType {
	const numberOfDecimalZeros = amount.toString().match(/(?<=^0\.)0+/)?.[0].length;

	if (!numberOfDecimalZeros || numberOfDecimalZeros < 1) {
		return { val: addPostfix(Number(amount)), numberOfDecimalZeros: 0 };
	} else {
		if (numberOfDecimalZeros === undefined) {
			throw new ParsingError('Could not parse: ' + amount);
		}
		return {
			val: amount.replace(/^0.0+/, '').slice(0, 3),
			numberOfDecimalZeros
		};
	}
}

export function getReadablePriceInCcy(pair: Pair): {
	val: string;
	numberOfDecimalZeros: number;
} {
	return makeStringValueReadablePrice(numToString(getPriceInCcy(pair)));
}

export function getPriceInCcy(pair: Pair | undefined): number {
	if (pair === undefined || pair.amountCcy === 0n || pair.amount1 === 0n) {
		return 0;
	}
	const decimalsDiff = pair.ccy.decimals - pair.asset1.decimals;
	return Number(pair.amountCcy) / Number(pair.amount1) / 10 ** decimalsDiff;
}

export function getReadableTvlCcy(pair: Pair) {
	return makeNumberReadable(
		createAmountFromBalance(pair.amountCcy * 2n, pair.ccy.decimals).toString()
	);
}

export function ensureInputIsDecimalNumber(input: string, maxDecimals: number): string {
	let newText = input;

	if (newText === '.') newText = '0.';

	// remove leading zeros
	newText = newText.replace(/^0+(?=[1-9])/, '');
	// remove every non-digit besides "."
	newText = newText.replaceAll(/[^0-9.]/g, '');
	// remove all "." after the first
	newText = newText.replaceAll(/(?<=\..*)\./g, '');

	const decimals = newText.match(/(?<=\.)\d+/g);
	if (decimals && decimals[0]) {
		if (decimals[0].length >= maxDecimals) {
			const integer = newText.match(/^\d*/);
			newText = (integer?.[0] ?? '0') + '.' + decimals[0].slice(0, maxDecimals);
		}
	}
	return newText;
}

export function match(amount1: string, amount2: string, decimals: number) {
	return (
		removeTrailingZeros(shortenNumber(amount1, decimals)) ===
		removeTrailingZeros(shortenNumber(amount2, decimals))
	);
}
