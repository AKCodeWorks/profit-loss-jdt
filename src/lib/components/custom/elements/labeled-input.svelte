<script lang="ts">
  import { Input, type InputEvents } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { cn } from "$lib/utils";
  import type { HTMLInputAttributes } from "svelte/elements";

  type $$Events = InputEvents;

  let className: HTMLInputAttributes["class"] = undefined;

  export let value: HTMLInputAttributes["value"] = undefined;
  export { className as class };
  export let id: string = "";
  export let description: string = "";
  export let type: HTMLInputAttributes["type"] = "text";
  export let placeholder: string = "";
  export let label: string = "";
  export let error: string[] | undefined = undefined;
</script>

<div class="flex w-full flex-col gap-1.5">
  {#if label}
    <Label class="font-bold" for={id}>{label}</Label>
  {/if}
  <Input
    bind:value
    on:blur
    on:change
    on:click
    on:focus
    on:focusin
    on:focusout
    on:keydown
    on:keypress
    on:keyup
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:mousemove
    on:paste
    on:input
    {...$$restProps}
    {type}
    {id}
    {placeholder}
    name={id}
    class={cn(className)}
  />
  {#if description}
    <p class="text-muted-foreground text-sm">{description}</p>
  {/if}
  {#if error}
    <small class="text-red-500">{error.join(", ")}</small>
  {/if}
</div>
