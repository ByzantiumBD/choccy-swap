import { createAmountFromBalance } from "@chromia/ft4";
import { ParsingError } from "./errors";
import type { Pair } from "./types";

export function shortenNumber(number: string) {
    const integer = number.replace(/^0+(?=[1-9])/, "").match(/^\d+/)?.[0];
    const decimal = number.match(/(?<=\.)\d+$/)?.[0];

    if (integer === undefined || integer.match(/^0+$/)) {
        if (decimal === undefined) return "0";
        return "0."+decimal.slice(0,6)
    } else {
        if (decimal === undefined || decimal.match(/^0+$/)) return integer
        return integer+"."+decimal.slice(0,3)
    }
}

export function makeNumberReadable(number: string) {
    const integer = number.match(/^\d+/)?.[0];
    const decimal = number.match(/(?<=\.)\d+$/)?.[0];

    if (integer === undefined) {
        if (decimal === undefined) return "0";
        return "0."+decimal.slice(0,3)
    } else {
        return addPostfix(Number(number))
    }
}

function addPostfix(num: number) {
    const postfixes = [
        "", "k", "M", "B", "T", "Q"
    ]

    function trunc(str: string) {
        return str.match(/^\d*(\.\d{1,3})?/)?.[0]??"0";
    }

    let myNum = num;
    for (let i = 0; i < postfixes.length; i++) {
        if (myNum / 1000 < 1) {
            return trunc(myNum.toString()) + postfixes[i];
        }
        myNum = myNum /1000;
    }

    return trunc(myNum.toString())+postfixes[postfixes.length-1]
}

export function removeTrailingZeros(number: string): string {
    return number.replace(/\.0*$/, "").replace(/(?<=\.\d+)0+$/, "")
}

export function getReadablePriceInCcy(pair: Pair): {val: string, numberOfDecimalZeros: number} {   
    const decimalsDiff = pair.ccy.decimals - pair.asset1.decimals;
    if (pair.amountCcy === 0n || pair.amount1 === 0n) {
        return { val: "...", numberOfDecimalZeros: 0 }
    }
    const price = (Number(pair.amountCcy) / Number(pair.amount1)) / (10**decimalsDiff)

    if (price >= 0.01) {
        return { val: addPostfix(price), numberOfDecimalZeros: 0 }
    } else {
        const str = price.toString();
        const numberOfDecimalZeros = str.match(/^(?<=0\.)0+/)?.[0].length
        if (numberOfDecimalZeros === undefined) {
            throw new ParsingError("Could not parse: " + str)
        }
        return {
            val: str.replace(/^0.0+/, ""),
            numberOfDecimalZeros
        }
    }
}


export function getReadableTvlCcy(pair: Pair) {   
    return makeNumberReadable(
        createAmountFromBalance(pair.amountCcy * 2n, pair.ccy.decimals).toString()
    )
}