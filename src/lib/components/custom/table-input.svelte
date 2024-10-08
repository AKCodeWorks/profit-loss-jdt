<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	export let currency: { label: string; icon: string };
	export let value: unknown;
	export let type: string;
	export let noCurrency: boolean = false;
	let ele: unknown;
</script>

<div class="flex items-center">
	{#if !noCurrency}
		<span class=" font-bold mr-1">{currency.icon}</span>
	{/if}
	<Input
		bind:this={ele}
		on:focus={(e) => e?.currentTarget?.select()}
		{type}
		class="border-none shadow-none max-w-sm"
		bind:value
	/>
</div>
