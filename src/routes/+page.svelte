<script lang="ts">
  import LabeledSelect from "$lib/components/custom/elements/labeled-select.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { onMount } from "svelte";

  let seasons = storage?.seasons?.data;
  let selectedSeason: string = "";
  let selectedEpisode: string = "";
  $: if (storage.seasons) {
    seasons = storage.seasons.data;
  }

  onMount(async () => {
    if (!storage?.ready) {
      await storage?.init();
    }
    seasons = storage?.seasons?.data;
  });

  async function addEpisode(seasonId: string) {
    const success = await storage?.createEpisode(seasonId);
    if (success) {
      seasons = storage?.seasons?.data;
    }
  }

  $: {
    if (!selectedSeason) {
      selectedEpisode = "";
    }
    if (selectedSeason) {
      selectedEpisode = "";
    }
  }
</script>

<div class="flex items-center gap-4">
  <LabeledSelect
    class="max-w-48"
    isNullable
    clearText="All"
    placeholder="Select a Season"
    options={seasons}
    labelKey="name"
    label="Season"
    key="id"
    bind:value={selectedSeason}
  />

  {#if selectedSeason && seasons.filter((s) => s.id === selectedSeason)[0].episodes.length > 0}
    <LabeledSelect
      class="max-w-48"
      isNullable
      clearText="All"
      options={seasons.filter((s) => s.id === selectedSeason)[0].episodes}
      labelKey="name"
      label="Episode"
      key="id"
      bind:value={selectedEpisode}
    />
  {/if}
</div>

<Table.Root>
  <Table.Caption>Joey's Completely Over-Engineered Spreadsheet</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Item</Table.Head>
      <Table.Head>Cost</Table.Head>
      <Table.Head>Expenses</Table.Head>
      <Table.Head>Estimated Sell Price</Table.Head>
      <Table.Head>Actual Sell Price</Table.Head>
      <Table.Head>Time Spent (H:MM)</Table.Head>
      <Table.Head class="text-right">Profit/Loss</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each seasons as season, index}
      {#if selectedSeason ? season.id === selectedSeason : true}
        <p class="font-bold ml-2 mt-2">{season.name}</p>
        {#each season.episodes as episode, index}
          {#if selectedEpisode ? episode.id === selectedEpisode : true}
            <Table.Row>
              <Table.Cell class="font-medium">INV001</Table.Cell>
              <Table.Cell>Paid</Table.Cell>
              <Table.Cell>Credit Card</Table.Cell>
              <Table.Cell class="text-right">$250.00</Table.Cell>
            </Table.Row>
          {/if}
        {/each}
        <Button
          on:click={async () => await addEpisode(season.id)}
          size="sm"
          variant="ghost"
          class="opacity-50">+ Episode</Button
        >
      {/if}
    {/each}
  </Table.Body>
</Table.Root>
