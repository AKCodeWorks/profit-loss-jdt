<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageServerData } from '../../../routes/$types';
	import * as Dialog from '$lib/components/ui/dialog';
	import LabeledInput from './elements/labeled-input.svelte';
	import LabeledCheckbox from './elements/labeled-checkbox.svelte';
	import { Button } from '$lib/components/ui/button';
	export let data: PageServerData;
	import { fade } from 'svelte/transition';
	import SuperDebug from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	const { form, enhance, submitting, errors } = superForm(data.createItemForm, {
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Item created successfully.');
			} else {
				// @ts-ignore
				toast.error(result?.data?.message || 'Failed to create item.');
			}
		}
	});
</script>

<Dialog.Root>
	<Dialog.Trigger autofocus={false}>
		<Button>Add Item</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add a New Item</Dialog.Title>
			<Dialog.Description>Let's see how we made out.</Dialog.Description>
			<!-- <SuperDebug data={$form} /> -->
			<form
				use:enhance
				action="?/createItem"
				class="space-y-3 transition-all duration-200"
				method="post"
			>
				<LabeledInput error={$errors.name} bind:value={$form.name} id="name" label="Item Name" />
				<LabeledInput
					id="price"
					error={$errors.price}
					label="Purchase Price"
					description="Initial purchase price."
					type=""
					step={0.01}
					on:focus={(e) => e.currentTarget.select()}
					bind:value={$form.price}
				/>
				<LabeledInput
					id="expenses"
					label="Other Expenses"
					description="Parts, consumables, etc."
					type="number"
					step={0.01}
					on:focus={(e) => e.currentTarget.select()}
					bind:value={$form.expenses}
				/>
				<LabeledInput
					id="estimatedSellPrice"
					label="Estimated Sell Price"
					description="What you think it can sell for."
					type="number"
					step={0.01}
					on:focus={(e) => e.currentTarget.select()}
					bind:value={$form.estimatedSellPrice}
				/>
				<LabeledCheckbox
					bind:checked={$form.isSold}
					id="isSold"
					label="I have already sold this item."
				/>
				{#if $form.isSold}
					<div transition:fade={{ delay: 250, duration: 300 }}>
						<LabeledInput
							type="number"
							id="actualSellPrice"
							label="Actual Sell Price"
							description="What it actually sold for."
							step={0.01}
							on:focus={(e) => e.currentTarget.select()}
							bind:value={$form.actualSellPrice}
						/>
					</div>
				{/if}
				<Button type="submit" class="w-full">Save</Button>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
