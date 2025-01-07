<script>
	import X from '$lib/images/home/x.svg';
	import telegram from '$lib/images/home/telegram.svg';
	import discord from '$lib/images/home/discord.svg';
	import coingecko from '$lib/images/home/coingecko.svg';
	import writing from '$lib/images/common/writing.svg';
</script>

<div class="relative">
    <div id="footer" class="flex flex-col items-center w-full text-white bg-transparent">
        <span class="c ctopright"></span>
        <span class="c ctopleft"></span>
        <div id="socials" class="allcenter space-x-8 h-[6cm]">
            <a href="https://x.com/ChoccySwap" target="_blank">
                <img src={X} alt="X twitter" />
            </a>
            <a href="https://t.me/ChoccySwapCommunity" target="_blank">
                <img src={telegram} alt="telegram" />
            </a>
            <a href="https://discord.com/invite/cunRKsgbBz" target="_blank">
                <img src={discord} alt="discord" />
            </a>
            <a href="https://www.coingecko.com/en/coins/choccyswap" target="_blank">
                <img src={coingecko} alt="coingecko" />
            </a>
        </div>
        <img src={writing} alt="ChoccySwap" />
    </div>
</div>

<style lang="less">
	#footer {
		border-radius: 5mm 5mm 0 0;
		overflow: hidden;
		position: relative;
		z-index: 1;
		height: calc(7cm + min(100vw, 30cm) / 5);
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			backdrop-filter: blur(20px);
		}
		& > img {
			max-width: 30cm;
			width: 100%;
			padding: 0 1rem;
			position: absolute;
			bottom: 1cm;
		}
	}

	.c {
		position: absolute;
		height: 200px;
		width: 200px;
		border-radius: 100%;
		filter: blur(120px);

		&topright {
			height: 400px;
			width: 400px;
			transform: rotate(-45deg);

			background-image: linear-gradient(
				90deg,
				rgba(147, 238, 255, 0.6) 13%,
				rgba(255, 2, 209, 0.6) 85%
			);
			top: -100px;
			right: -100px;
		}

		&topleft {
			height: 400px;
			width: 400px;
			transform: rotate(45deg);

			background-image: linear-gradient(
				-90deg,
				rgba(147, 238, 255, 0.6) 13%,
				rgba(255, 2, 209, 0.6) 85%
			);
			top: -100px;
			left: -100px;
		}
	}
</style>