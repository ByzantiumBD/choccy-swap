<script lang="ts">
	import Linkid from '$lib/components/common/linkid.svelte';
    import CloseSvg from '$lib/images/swap/close.svelte';
	import { mint } from '$lib/interactions/account';
	import { disconnectModal } from '$lib/interactions/reown.svelte';
	import { connectionState } from '$lib/states/shared/connection-state.svelte';
	import { refreshData } from '$lib/states/swap/swap-state-interactions.svelte';

    let { close }: { close: () => void } = $props();

	let getFundsText: string = $state('Get funds');
	let hideMinter = $state(false);

	// function getBalance() {
	// 	getFundsText = 'Receiving funds...';
	// 	mint(connectionState.session!)
	// 		.then(() => {
	// 			getFundsText = 'Assets received!';
	// 			refreshData();
	// 			new Promise<void>((resolve) => {
	// 				setTimeout(() => {
	// 					hideMinter = true;
	// 					resolve();
	// 				}, 3000);
	// 			});
	// 		})
	// 		.catch((e: Error) => {
	// 			getFundsText = 'Error!';
	// 			new Promise<void>((resolve) => {
	// 				setTimeout(() => {
	// 					getFundsText = 'Get funds for testing';
	// 					resolve();
	// 				}, 3000);
	// 			});
	// 			throw e;
	// 		});
	// }


    async function disconnect() {
        await disconnectModal()
        close()
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={close}
	class="bg-[#0008] z-10 fixed top-0 left-0 w-screen h-screen allcenter"
>
    <div
        onclick={(e) => e.stopPropagation()}
        class="allcenter !items-stretch flex-col bg-black rounded-3xl border-[var(--border)] border w-[400px] max-[450px]:w-[350px]"
        >
		<div class="allcenter !justify-between p-5 text-sm">
			<h2 class="font-extrabold text-xl">Account Info</h2>
			<button onclick={close}><CloseSvg style="width:28px; height:28px; fill:#ff9ced" /></button>
		</div>

		<div
			class="allcenter h-full rounded-b-3xl text-white bg-[#101010] flex-col !items-stretch pt-2"
		>

            <div class="allcenter !justify-between p-5 text-lg">
                <h3 class="chr">Chromia ID:</h3>
                <Linkid account id={connectionState.session?.account.id} />
            </div>
            <div class="allcenter !justify-between p-5 text-lg">
                <h3 class="evm">EVM address:</h3>
                <Linkid account evm id={connectionState.account?.address} />
            </div>
            <div class="flex mx-5 mt-3 mb-5">
				<a href="/orders" class="flex-1 allcenter mr-3 clickable lilacborder py-2 px-7 font-semibold" >
					My Orders
				</a>
                <button onclick={disconnect} class="flex-1 clickable pinkpill py-2 px-7 font-semibold" >
                    Disconnect
                </button>
            </div>
		</div>
	</div>
</div>

<style lang="less">
	.pinkpill {
		border: 2.5px solid var(--mulberry);
		&:hover {
			border: 2.5px solid var(--pink);
		}
	}

    h3 {
        text-decoration: underline;
        text-decoration-thickness: 2px;

        &.chr {
            text-decoration-color: var(--mulberry);
        }
        &.evm {
            text-decoration-color: var(--blue);
        }
    }
</style>
