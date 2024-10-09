<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import Icon from "@iconify/svelte";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { toast } from "svelte-sonner";
  import { createEventDispatcher } from "svelte";

  export let episodeId: string;
  export let itemId: string;

  let open: boolean = false;

  const dispatch = createEventDispatcher();

  async function deleteItem() {
    try {
      await storage?.removeItemFromEpisode(episodeId, itemId);
      toast.success("Item removed successfully");
      dispatch("itemDeleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item");
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
      <AlertDialog.Title>Confirm Delete Item</AlertDialog.Title>
      <AlertDialog.Description>
        Are you sure you want to delete this item? This cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={async () => await deleteItem()}
        >Continue</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
