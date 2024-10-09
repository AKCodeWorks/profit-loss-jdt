<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  export let value: unknown;
  export let type: string;
  export let noCurrency: boolean = false;
  let ele: unknown;
  import { storage } from "$lib/helpers/storage/StorageManager";
</script>

<div class="flex items-center">
  {#if !noCurrency}
    <span class="font-bold mr-1"
      >{storage?.config?.currency == "GBP" ? "£" : "$"}</span
    >
  {/if}
  <Input
    bind:this={ele}
    on:change
    on:focus={(e) => e?.currentTarget?.select()}
    {type}
    class="border-none shadow-none max-w-sm"
    bind:value
  />
</div>
