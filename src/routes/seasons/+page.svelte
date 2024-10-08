<script lang="ts">
  import CreateSeasonDialog from "$lib/components/custom/dialogs/seasons/create-season-dialog.svelte";
  import * as Table from "$lib/components/ui/table";
  import DeleteSeasonAlert from "$lib/components/custom/dialogs/seasons/delete-season-alert.svelte";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import type { Season } from "$lib/interfaces/Season";
  import { onMount } from "svelte";
  import TableInput from "$lib/components/custom/table-input.svelte";
  import { toast } from "svelte-sonner";

  let seasons: Season[] = storage?.seasons?.data;
  onMount(async () => {
    if (!storage?.ready) {
      await storage?.init();
      seasons = storage?.seasons?.data;
    }
  });

  function calculateNumberOfItems(season: Season) {
    let items = 0;
    season.episodes.forEach((episode) => {
      items += episode.items.length;
    });
    return items;
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

  $: if (storage.seasons) {
    seasons = storage.seasons.data;
  }
</script>

<div class="flex items-center gap-4 justify-between">
  <div>
    <h2>Season Management</h2>
    <small class="text-muted-foreground"
      >Add or edit season settings here.</small
    >
  </div>

  <CreateSeasonDialog
    on:seasonCreated={() => (seasons = storage.seasons.data)}
  />
</div>

{#if storage.ready && seasons.length}
  <Table.Root>
    <Table.Caption>A list of your created seasons.</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head>Season Name</Table.Head>
        <Table.Head>Goal</Table.Head>
        <Table.Head># of Episodes</Table.Head>
        <Table.Head># of Items</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each seasons as season, index}
        <Table.Row>
          <Table.Cell class="font-bold">
            <div class="flex items-center gap-2">
              <DeleteSeasonAlert
                on:seasonDeleted={() => (seasons = storage.seasons.data)}
                seasonId={season.id}
              /><TableInput
                on:change={async () => await saveSeasons()}
                noCurrency
                type="text"
                bind:value={seasons[index].name}
              />
            </div>
          </Table.Cell>
          <Table.Cell>
            <TableInput
              on:change={async () => await saveSeasons()}
              type="number"
              bind:value={seasons[index].goal}
            />
          </Table.Cell>
          <Table.Cell>{season.episodes.length}</Table.Cell>
          <Table.Cell>{calculateNumberOfItems(season)}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
{:else}
  <div class="space-y-4">
    <h3 class="mt-4">Create a season to get started!</h3>
  </div>
{/if}
