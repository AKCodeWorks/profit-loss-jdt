<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import {
    exists,
    BaseDirectory,
    writeTextFile,
    readTextFile,
    create,
    mkdir,
  } from "@tauri-apps/plugin-fs";
  import { onMount } from "svelte";

  async function writeConfig() {
    await writeTextFile("config.json", JSON.stringify(myConfig), {
      baseDir: BaseDirectory.AppLocalData,
    });

    const file = await readTextFile("config.json", {
      baseDir: BaseDirectory.AppLocalData,
    });
    console.log(JSON.parse(file));
  }

  const myConfig = {
    title: "Joey Does Tech",
    description:
      "Joey Does Tech is a blog about technology, programming, and software development.",
    image: "https://joeydoestech.com/images/joey-does-tech.png",
    url: "https://joeydoestech.com",
    twitter: "@joeydoestech",
  };
</script>

<svelte:head>
  <title>Joey Does Tech</title>
</svelte:head>

<Button on:click={async () => await writeConfig()}>Write Config to Disk</Button>
