<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import Icon from "@iconify/svelte";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { toast } from "svelte-sonner";
  export let seasonId: string;
  let open: boolean = false;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  async function deleteSeason() {
    try {
      await storage?.deleteSeason(seasonId);
      toast.success("Season deleted successfully");
      dispatch("seasonDeleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete season");
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
        Deleting this season will also delete all associated episodes and items!
        This action CANNOT be undone! Are you sure you want to delete this
        season?
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
