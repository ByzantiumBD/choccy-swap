import { createAmountFromBalance, op, type Asset, type AuthenticatedAccount, type Session } from "@chromia/ft4";

export async function getBalance(account: AuthenticatedAccount, asset: Asset) {
    return (
        await account.getBalanceByAssetId(asset.id)
    ) ?? {
        asset,
        amount: createAmountFromBalance(0n, asset.decimals)
    };
}

export async function mint(session: Session) {
    await session.call(
        op("receive_balance")
    );
}