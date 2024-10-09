<script lang="ts">
  import DeleteEpisodeDialog from "$lib/components/custom/dialogs/episodes/delete-episode.dialog.svelte";
  import LabeledInput from "$lib/components/custom/elements/labeled-input.svelte";
  import LabeledSelect from "$lib/components/custom/elements/labeled-select.svelte";
  import TableInput from "$lib/components/custom/table-input.svelte";
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

<Table.Root class="px-4">
  <Table.Caption>Joey's Completely Over-Engineered Spreadsheet</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Item</Table.Head>
      <Table.Head>Cost</Table.Head>
      <Table.Head>Expenses</Table.Head>
      <Table.Head>Estimated Sell Price</Table.Head>
      <Table.Head>Actual Sell Price</Table.Head>
      <Table.Head>Time Spent (H:MM)</Table.Head>
      <Table.Head class="text-right">Profit/Loss</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each seasons as season, seasonIndex}
      {#if selectedSeason ? season.id === selectedSeason : true}
        <h4 class="font-bold ml-2 mt-2">{season.name}</h4>
        {#each season.episodes as episode, episodeIndex}
          {#if selectedEpisode ? episode.id === selectedEpisode : true}
            <div class="flex items-center gap-2">
              <DeleteEpisodeDialog
                on:episodeDeleted={() => (seasons = storage.seasons.data)}
                episodeId={episode.id}
              />
              <TableInput
                class="ml-2 h-fit py-1 w-fit"
                placeholder="Episode Name"
                type="text"
                noCurrency
                bind:value={seasons[seasonIndex].episodes[episodeIndex].name}
              />
            </div>

            {#each episode.items as item, itemIndex}
              <Table.Row>
                <Table.Cell class="font-medium"></Table.Cell>
                <Table.Cell>Paid</Table.Cell>
                <Table.Cell>Credit Card</Table.Cell>
                <Table.Cell class="text-right">$250.00</Table.Cell>
              </Table.Row>
            {/each}
            <Button
              on:click={async () => await addEpisode(season.id)}
              size="sm"
              variant="ghost"
              class="opacity-50 ml-2">+ Item</Button
            >
          {/if}
        {/each}
        <div>
          <Button
            on:click={async () => await addEpisode(season.id)}
            size="sm"
            variant="ghost"
            class="opacity-80 text-primary">+ Episode</Button
          >
        </div>
      {/if}
    {/each}
  </Table.Body>
</Table.Root>
