<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { defaultSeason } from "$lib/defaults/defaultSeason";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import type { Season } from "$lib/interfaces/Season";
  import { toast } from "svelte-sonner";
  import LabeledInput from "../elements/labeled-input.svelte";
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher } from "svelte";
  import type { Config } from "$lib/interfaces/Config";
  const dispatch = createEventDispatcher();
  let open: boolean = false;
  let seasonToAdd: Season = defaultSeason;
  let config: Config | null = storage?.config;

  async function createSeason() {
    try {
      await storage?.addSeason(seasonToAdd);
      toast.success("Season created successfully");
      seasonToAdd = defaultSeason;
      dispatch("seasonCreated");
      open = false;
    } catch (error) {
      console.error(error);
      toast.error("Failed to create season");
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    ><Button size="sm" on:click={() => (seasonToAdd = defaultSeason)}
      >Create a Season</Button
    ></Dialog.Trigger
  >
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add a New Season</Dialog.Title>
      <Dialog.Description>
        Once you create a season you can add episodes to it.
      </Dialog.Description>
      <div class="w-full space-y-4">
        <LabeledInput bind:value={seasonToAdd.name} label="Season Name" />
        <LabeledInput
          type="number"
          step="0.01"
          bind:value={seasonToAdd.goal}
          label={`Goal ${config?.currency == "GBP" ? "£" : "$"}`}
        />
        <Button on:click={async () => await createSeason()}
          >Create Season</Button
        >
      </div>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
