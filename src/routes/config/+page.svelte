<script lang="ts">
  import LabeledSelect from "$lib/components/custom/elements/labeled-select.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { currencies } from "$lib/consts/currencies";
  import { locales } from "$lib/consts/locales";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import type { Config } from "$lib/interfaces/Config";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  let config: Config | null;

  onMount(async () => {
    if (!storage?.ready) {
      await storage?.init();
    }
    config = storage?.config;
  });

  async function updateConfig() {
    if (config) {
      try {
        await storage.updateConfig(config);
        toast.success("Configuration updated successfully");
      } catch (e) {
        toast.error("Failed to update configuration");
      }
    }
  }
</script>

<div class="border w-fit p-4 rounded-md mx-auto space-y-4">
  {#if config}
    <LabeledSelect
      id="currency"
      label="Default Currency"
      bind:value={config.currency}
      options={currencies}
      key="value"
      labelKey="label"
      description="This only changes the symbol, it does not perform currency exchange calculations."
    />
    <LabeledSelect
      id="locale"
      label="Default Locale"
      bind:value={config.locale}
      options={locales}
      key="value"
      labelKey="label"
      description="Changes the spelling of certain words in some cases."
    />
    <div class="flex items-center gap-4">
      <Button href="/" variant="secondary">Go Back</Button>
      <Button on:click={async () => await updateConfig()}
        >Save Configuration</Button
      >
    </div>
  {/if}
</div>
