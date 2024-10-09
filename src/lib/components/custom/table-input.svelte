<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { cn } from "$lib/utils";
  export let value: unknown;
  export let type: string;
  export let noCurrency: boolean = false;
  let ele: unknown;
  let className: string = "";
  export let placeholder: string = "";

  export { className as class };
</script>

<div class="flex items-center">
  {#if !noCurrency}
    <span class="font-bold mr-1"
      >{storage?.config?.currency == "GBP" ? "£" : "$"}</span
    >
  {/if}
  <Input
    {placeholder}
    bind:this={ele}
    on:change
    on:focus={(e) => e?.currentTarget?.select()}
    {type}
    class={cn("border-none shadow-none max-w-sm", className)}
    bind:value
  />
</div>
