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

export function disconnectedState(): ConnectionState {
    return {
        provider: undefined,
        account: undefined,
        session: undefined,
        connection: undefined,
        loading: true,
    }
}