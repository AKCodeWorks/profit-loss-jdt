<script lang="ts">
  //TODO: Clean up this file with some components
  import DeleteEpisodeDialog from "$lib/components/custom/dialogs/episodes/delete-episode-dialog.svelte";
  import DeleteItemDialog from "$lib/components/custom/dialogs/episodes/delete-item-dialog.svelte";
  import LabeledSelect from "$lib/components/custom/elements/labeled-select.svelte";
  import TableInput from "$lib/components/custom/table-input.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

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

  async function addItem(episodeId: string) {
    const success = await storage?.addItemToEpisode(episodeId);
    if (success) {
      seasons = storage?.seasons?.data;
      toast.success("Item added to episode.");
    }
  }

  async function saveSeasons() {
    console.log("saving seasons");
    try {
      await storage?.saveAllSeasons({ data: seasons });
      toast.success("Saved Changes");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save seasons");
    }
  }

  $: {
    // this looks dumb but basically it just changes the text on the input when its cleared
    if (!selectedSeason) {
      selectedEpisode = "";
    }
    if (selectedSeason) {
      selectedEpisode = "";
    }
  }
</script>

<div class="flex items-center gap-4">
  {#if seasons.length > 0}
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
  {/if}
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
{#if seasons.length <= 0}
  <div class="flex flex-col items-center justify-center h-48">
    <h2 class="text-2xl mb-4">
      Looks like you haven't created any seasons yet.
    </h2>
    <Button href="/seasons">Manage Seasons</Button>
  </div>
{:else}
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
                  on:change={async () => await saveSeasons()}
                  class="ml-2 h-fit py-1 w-fit"
                  placeholder="Episode Name"
                  type="text"
                  noCurrency
                  bind:value={seasons[seasonIndex].episodes[episodeIndex].name}
                />
              </div>

              {#each episode.items as item, itemIndex}
                <Table.Row>
                  <Table.Cell class="font-medium">
                    <div class="flex items-center gap-1">
                      <DeleteItemDialog
                        episodeId={episode.id}
                        itemId={item.id}
                        on:itemDeleted={() => (seasons = storage.seasons.data)}
                      />
                      <TableInput
                        on:change={async () => await saveSeasons()}
                        class="w-48 font-bold"
                        placeholder="Item Name"
                        type="text"
                        noCurrency
                        bind:value={seasons[seasonIndex].episodes[episodeIndex]
                          .items[itemIndex].name}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <TableInput
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="Cost"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].cost}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TableInput
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="Expenses"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].expenses}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TableInput
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="Estimated Sell Price"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].estimatedSellPrice}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TableInput
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="Actual Sell Price"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].actualSellPrice}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div class="flex items-center">
                      <TableInput
                        noCurrency
                        class="w-12"
                        on:change={async () => await saveSeasons()}
                        placeholder="H"
                        type="number"
                        bind:value={seasons[seasonIndex].episodes[episodeIndex]
                          .items[itemIndex].timeSpentHours}
                      />
                      :
                      <TableInput
                        noCurrency
                        class="w-16"
                        on:change={async () => await saveSeasons()}
                        step={1}
                        placeholder="Minutes"
                        type="number"
                        bind:value={seasons[seasonIndex].episodes[episodeIndex]
                          .items[itemIndex].timeSpentMinutes}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              {/each}
              <Button
                on:click={async () => await addItem(episode.id)}
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
{/if}
