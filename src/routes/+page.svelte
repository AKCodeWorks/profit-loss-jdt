<script lang="ts">
  import {
    calcluateItemProfitLoss,
    calculateEpisodeProfitLoss,
    calculateSeasonGoalPercentage,
    calculateSeasonTotalProfitLoss,
    safeParseFloat,
  } from "$lib/calculations/calculate-item-profit-loss";

  //TODO: Clean up this file with some components
  import DeleteEpisodeDialog from "$lib/components/custom/dialogs/episodes/delete-episode-dialog.svelte";
  import DeleteItemDialog from "$lib/components/custom/dialogs/episodes/delete-item-dialog.svelte";
  import LabeledSelect from "$lib/components/custom/elements/labeled-select.svelte";
  import TableInput from "$lib/components/custom/table-input.svelte";
  import { Progress } from "$lib/components/ui/progress";
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  let seasons = storage?.seasons?.data;
  let selectedSeason: string = "";
  let selectedEpisode: string = "";

  onMount(async () => {
    if (!storage?.ready) {
      await storage?.init();
    }
    seasons = storage?.seasons?.data;
    selectedSeason = storage?.config?.defaultSeason || "";
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

<div class="flex items-center justify-between">
  <div class="flex items-center gap-4 mb-2">
    {#if seasons.length > 0}
      <LabeledSelect
        class="w-48"
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
    {#if selectedSeason && seasons.filter((s) => s.id === selectedSeason)[0]?.episodes.length > 0}
      <LabeledSelect
        class="w-48"
        isNullable
        clearText="All"
        options={seasons.filter((s) => s.id === selectedSeason)[0]?.episodes}
        labelKey="name"
        label="Episode"
        key="id"
        bind:value={selectedEpisode}
      />
    {/if}
  </div>
  <div>
    {#if selectedSeason}
      {@const season = seasons.filter((s) => s.id === selectedSeason)[0]}
      {@const seasonProfitLoss = calculateSeasonTotalProfitLoss(
        season,
        storage.config?.locale || "en-GB",
        storage.config?.currency || "GBP"
      )}
      <div>
        <h2
          class={cn(
            "text-right text-green-500",
            safeParseFloat(seasonProfitLoss) < 0 && "text-red-500"
          )}
        >
          {seasonProfitLoss}
        </h2>
        <small class="font-bold text-muted-foreground"
          >{season.name} Profit/Loss</small
        >
      </div>
    {/if}
  </div>
</div>

{#if selectedSeason}
  {@const season = seasons.filter((s) => s.id === selectedSeason)[0]}
  <Progress
    class="h-2 mt-4"
    max={season.goal}
    value={safeParseFloat(
      calculateSeasonTotalProfitLoss(
        season,
        storage.config?.locale || "en-GB",
        storage.config?.currency || "GBP"
      )
    )}
  />
  <strong>{calculateSeasonGoalPercentage(season)}% complete</strong>
{/if}
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
        <Table.Head>Shipping</Table.Head>
        <Table.Head>Estimated Sell Price</Table.Head>
        <Table.Head>Actual Sell Price</Table.Head>
        <Table.Head>Time Spent (H:MM)</Table.Head>
        <Table.Head class="text-right ">Profit/Loss</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each seasons as season, seasonIndex}
        {#if selectedSeason ? season.id === selectedSeason : true}
          <Table.Row class="bg-muted">
            <Table.Cell colspan={100}>
              <div class="flex items-center gap-4 justify-between">
                <h2>{season.name}</h2>
                <div>
                  <Button
                    on:click={async () => await addEpisode(season.id)}
                    size="sm"
                    variant="outline"
                    class="opacity-80 text-primary ">+ Episode</Button
                  >
                </div>
              </div>
            </Table.Cell>
          </Table.Row>

          {#each season.episodes as episode, episodeIndex}
            {#if selectedEpisode ? episode.id === selectedEpisode : true}
              <Table.Row class="border-t-2 ">
                <Table.Cell colspan={100}>
                  <div class="flex items-center gap-2">
                    <DeleteEpisodeDialog
                      on:episodeDeleted={() => (seasons = storage.seasons.data)}
                      episodeId={episode.id}
                    />
                    <TableInput
                      on:change={async () => await saveSeasons()}
                      class="ml-2 h-fit py-1 max-w-48 font-bold text-lg"
                      placeholder="Episode Name"
                      type="text"
                      noCurrency
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .name}
                    />

                    <Button
                      on:click={async () => await addItem(episode.id)}
                      size="sm"
                      variant="outline"
                      class=" ml-auto">+ Item</Button
                    >
                  </div>
                </Table.Cell>
              </Table.Row>

              {#each episode.items as item, itemIndex}
                <Table.Row class="odd:bg-muted">
                  <Table.Cell class="font-medium">
                    <div class="flex items-center gap-1">
                      <DeleteItemDialog
                        episodeId={episode.id}
                        itemId={item.id}
                        on:itemDeleted={() => (seasons = storage.seasons.data)}
                      />
                      <TableInput
                        on:change={async () => await saveSeasons()}
                        class="max-w-48 font-bold"
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
                      class="max-w-24"
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="-"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].cost}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TableInput
                      class="max-w-24"
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="-"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].expenses}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TableInput
                      class="max-w-24"
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="-"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].shippingCost}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TableInput
                      class="max-w-24"
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="-"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].estimatedSellPrice}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TableInput
                      class="max-w-24"
                      on:change={async () => await saveSeasons()}
                      step={0.01}
                      placeholder="-"
                      type="number"
                      bind:value={seasons[seasonIndex].episodes[episodeIndex]
                        .items[itemIndex].actualSellPrice}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div class="flex items-center">
                      <TableInput
                        noCurrency
                        class="w-14 text-right pr-1"
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
                        placeholder="MM"
                        type="number"
                        bind:value={seasons[seasonIndex].episodes[episodeIndex]
                          .items[itemIndex].timeSpentMinutes}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell
                    class={cn(
                      " text-right font-bold  items-center gap-4",
                      safeParseFloat(calcluateItemProfitLoss(item, true)) < 0 &&
                        "text-red-500",
                      safeParseFloat(calcluateItemProfitLoss(item, true)) > 0 &&
                        "text-green-500"
                    )}
                  >
                    <h3>
                      {calcluateItemProfitLoss(
                        item,
                        true,
                        storage.config?.locale,
                        storage.config?.currency
                      )}
                    </h3>

                    <small class="text-xs text-muted-foreground">
                      {item.actualSellPrice ? "" : "(estimated)"}
                    </small>
                  </Table.Cell>
                </Table.Row>
              {/each}
              {#if episode.items.length > 1}
                <!-- this is ugly as all get out but it works for now -->
                <Table.Row class="bg-primary/10 hover:bg-primary/10">
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell
                    ><p class="text-large text-right font-bold">
                      {episode.name} Profit/Loss:
                    </p></Table.Cell
                  >
                  <Table.Cell
                    class={cn(
                      "max-w-24  text-lg text-left font-bold",
                      safeParseFloat(
                        calculateEpisodeProfitLoss(episode, "en-GB", "GBP")
                      ) < 0 && "text-red-500",
                      safeParseFloat(
                        calculateEpisodeProfitLoss(episode, "en-GB", "GBP")
                      ) > 0 && "text-green-500"
                    )}
                  >
                    {calculateEpisodeProfitLoss(
                      episode,
                      storage.config?.locale || "en-GB",
                      storage.config?.currency || "GBP"
                    )}
                  </Table.Cell>
                </Table.Row>
              {/if}
            {/if}
          {/each}
        {/if}
      {/each}
    </Table.Body>
  </Table.Root>
{/if}
