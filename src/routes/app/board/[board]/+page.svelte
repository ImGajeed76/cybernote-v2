<script lang="ts">
  import Board from "./components/Board.svelte";
  import { uploadFile } from "$lib/database";
  import { onMount } from "svelte";
  import { currentBoard, currentBoardComponents, currentSession } from "../../../../lib/database";
  import { page } from "$app/stores";

  import MixedComponent from "./components/MixedComponent.svelte";

  let componentsLength = 0;
  currentBoardComponents.subscribe((value) => {
    if (value.length !== componentsLength) {
      componentsLength = value.length;
      console.log("componentsLength", componentsLength);
    }
  });

  async function loadImage(file, pos: { x: number, y: number } = { x: 0, y: 0 }) {
    const newName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const { data, error } = await uploadFile(file, "files", newName);
    if (error) return console.log(error);

    const response = {
      type: "image",
      path: data.path,
      name: file.name,
      pos: pos,
      size: {
        width: 200,
        height: 200
      }
    };

    $currentBoardComponents = [...$currentBoardComponents, {
      email: $currentSession?.user?.email,
      componentUUID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      component: response,
      boardUUID: $currentBoard
    }];
  }

  async function loadText(file, pos: { x: number, y: number } = { x: 0, y: 0 }) {
    let text;
    await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        text = e.target.result;
        resolve(text);
      };
      reader.readAsText(file);
    });

    const response = {
      type: "text",
      text: text,
      name: file.name,
      pos: pos,
      size: {
        width: 200,
        height: 200
      }
    };

    $currentBoardComponents = [...$currentBoardComponents, {
      email: $currentSession?.user?.email,
      componentUUID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      component: response,
      boardUUID: $currentBoard
    }];
  }

  async function loadMarkDown(file, pos: { x: number, y: number } = { x: 0, y: 0 }) {
    let markdown;
    await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        markdown = e.target.result;
        resolve(markdown);
      };
      reader.readAsText(file);
    });

    const response = {
      type: "markdown",
      markdown: markdown,
      name: file.name,
      pos: pos,
      size: {
        width: 200,
        height: 200
      }
    };

    $currentBoardComponents = [...$currentBoardComponents, {
      email: $currentSession?.user?.email,
      componentUUID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      component: response,
      boardUUID: $currentBoard
    }];
  }

  function loadUnknown(file, pos: { x: number, y: number } = { x: 0, y: 0 }) {
    if (file.name.endsWith(".md")) return loadMarkDown(file, pos);
    console.log("Unknown file type", file);
  }

  function loadDrop(file, pos: { x: number, y: number } = { x: 0, y: 0 }) {
    switch (file.type) {
      case "image/png":
      case "image/jpeg":
      case "image/gif":
        return loadImage(file, pos);
      case "text/plain":
        return loadText(file, pos);
      default:
        return loadUnknown(file, pos);
    }
  }

  async function untilBoardIsSet() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if ($currentBoard) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  let loading = true;

  onMount(async () => {
    currentBoard.set($page.params.board);
    await untilBoardIsSet();
    loading = false;
  });
</script>

{#if !loading}
  <Board loadDrop={loadDrop}>
    {#each Array(componentsLength) as _, index}
      <MixedComponent index={index} />
    {/each}
  </Board>
{/if}
