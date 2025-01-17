import { disconnectedState } from './types';

export const connectionState = $state(disconnectedState());

export const isConnected: () => boolean = () => {
    return Boolean(
        connectionState.provider
        && connectionState.account?.address
        && connectionState.session
    )
}
