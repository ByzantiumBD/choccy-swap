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

	function getBalance() {
		getFundsText = 'Receiving funds...';
		mint(connectionState.session!)
			.then(() => {
				getFundsText = 'Assets received!';
				refreshData();
				new Promise<void>((resolve) => {
					setTimeout(() => {
						hideMinter = true;
						resolve();
					}, 3000);
				});
			})
			.catch((e: Error) => {
				getFundsText = 'Error!';
				new Promise<void>((resolve) => {
					setTimeout(() => {
						getFundsText = 'Get funds for testing';
						resolve();
					}, 3000);
				});
				throw e;
			});
	}


    async function disconnect() {
        await disconnectModal()
        close()
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={close}
	class="bg-[#0008] z-10 absolute top-0 left-0 w-screen h-screen allcenter"
>
    <div
        onclick={(e) => e.stopPropagation()}
        class="allcenter !items-stretch flex-col bg-black rounded-3xl border-gray-600 border w-[400px] max-[450px]:w-[350px]"
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
                {#if !hideMinter}
                    <button onclick={getBalance} class="flex-1 mr-3 blackbutton clickable" >
                        {getFundsText}
                    </button>
                {/if}
                <button onclick={disconnect} class="flex-1 pinkbutton clickable" >
                    Disconnect
                </button>
            </div>
		</div>
	</div>
</div>

<style lang="less">
	.pinkbutton {
		background: linear-gradient(276.31deg, #ed32bf -10.17%, #b5178e 97.19%);
		border-radius: 32px;
		border: 2.34px solid #b5178e;
		padding: 0.375rem 1.75rem;
        font-weight: bolder;

		&:hover {
			border: 2.34px solid rgba(255, 255, 255, 0.326);
		}
	}
	.blackbutton {
		background: transparent;
		border-radius: 32px;
		border: 2.34px solid #b5178e;
		padding: 0.375rem 1.75rem;
        font-weight: bolder;
	}

    h3 {
        text-decoration: underline;
        text-decoration-thickness: 2px;

        &.chr {
            text-decoration-color: #ed32bf;
        }
        &.evm {
            text-decoration-color: #8eeafc;
        }
    }
</style>
