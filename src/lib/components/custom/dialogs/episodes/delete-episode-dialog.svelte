<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { toast } from "svelte-sonner";

  export let episodeId: string;
  let open: boolean = false;

  const dispatch = createEventDispatcher();

  async function deleteSeason() {
    try {
      await storage?.deleteEpisode(episodeId);
      toast.success("Episode deleted successfully");
      dispatch("episodeDeleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete episode");
    }
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Trigger
    ><Icon
      icon="mdi:close"
      class="text-red-500 size-5 active:scale-95"
    /></AlertDialog.Trigger
  >
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Heads Up!</AlertDialog.Title>
      <AlertDialog.Description>
        Deleting this episode will also delete all associated items. This action
        cannot be undone. Are you sure you want to delete this episode?
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={async () => await deleteSeason()}
        >Continue</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
