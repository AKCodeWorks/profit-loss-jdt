<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button";
  import DeleteEpisodeDialog from "../dialogs/episodes/delete-episode-dialog.svelte";
  import DeleteItemDialog from "../dialogs/episodes/delete-item-dialog.svelte";
  import { toast } from "svelte-sonner";
  import TableInput from "../table-input.svelte";
  import { cn } from "$lib/utils";

  import {
    calcluateItemProfitLoss,
    calculateEpisodeProfitLoss,
    calculateEpisodeProfitPerHour,
    calculateEpisodeTimeSpent,
    safeParseFloat,
  } from "$lib/calculations";

  export let selectedSeason: string;
  export let selectedEpisode: string;
  export let seasons: any;
  export let storage: any;

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
</script>

<Table.Root class="px-4">
  <Table.Caption>Sally's Completely Over-Engineered Spreadsheet</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Item</Table.Head>
      <Table.Head>Cost</Table.Head>
      <Table.Head>Consumables</Table.Head>
      <Table.Head>Postage</Table.Head>
      <Table.Head>Estimated Sell Price</Table.Head>
      <Table.Head>Actual Sell Price</Table.Head>
      <Table.Head>Time Spent</Table.Head>
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
                  <TableInput
                    noCurrency
                    step={0.25}
                    class="max-w-24"
                    on:change={async () => await saveSeasons()}
                    placeholder="-"
                    type="number"
                    bind:value={seasons[seasonIndex].episodes[episodeIndex]
                      .items[itemIndex].timeSpent}
                  />
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
                      storage.config?.currency,
                      storage.config?.sellerRate
                    )}
                  </h3>

                  <small class="text-xs text-muted-foreground">
                    {item.actualSellPrice ? "" : "(estimated)"}
                  </small>
                </Table.Cell>
              </Table.Row>
            {/each}
            {#if episode.items.length > 0}
              <Table.Row class="bg-primary/10 hover:bg-primary/10">
                <Table.Cell
                  colspan={8}
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
                  <div class="flex items-center gap-4 justify-between px-4">
                    <p class="text-muted-foreground text-sm">
                      {episode.name} Total
                    </p>
                    <div
                      class="flex items-center gap-8 mt-1 justify-end text-right"
                    >
                      <p class="leading-none text-secondary-foreground">
                        {calculateEpisodeTimeSpent(episode)}
                        <br />
                        <small class="text-xs text-muted-foreground"
                          >hours</small
                        >
                      </p>

                      <p class=" leading-none">
                        {calculateEpisodeProfitLoss(
                          episode,
                          storage.config?.locale || "en-GB",
                          storage.config?.currency || "GBP"
                        )}
                        <br />
                        <small class="text-xs text-muted-foreground">
                          Profit/Loss
                        </small>
                      </p>
                      <p class="leading-none">
                        {calculateEpisodeProfitPerHour(episode)}
                        <br />
                        <small class="text-muted-foreground text-xs">
                          Profit/Hour
                        </small>
                      </p>
                    </div>
                  </div>
                </Table.Cell>
              </Table.Row>
            {/if}
          {/if}
        {/each}
      {/if}
    {/each}
  </Table.Body>
</Table.Root>
