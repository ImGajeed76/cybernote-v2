<script lang="ts">
  import Board from "./components/Board.svelte";
  import { getImage, uploadFile } from "$lib/database";
  import { onMount } from "svelte";
  import { currentBoard, currentBoardComponents, currentSession } from "../../../../lib/database";
  import { page } from "$app/stores";

  import BaseComponent from "./components/BaseComponent.svelte";

  let components;
  currentBoardComponents.subscribe((value) => {
    components = value;
  });

  async function loadImage(file) {
    const newName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const { data, error } = await uploadFile(file, "files", newName);
    if (error) return console.log(error);

    const response = {
      type: "image",
      path: data.path,
      name: file.name,
      pos: {
        x: 0,
        y: 0
      },
      size: {
        width: 0,
        height: 0
      }
    };

    $currentBoardComponents = [...$currentBoardComponents, {
      email: $currentSession?.user?.email,
      componentUUID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      component: response,
      boardUUID: $currentBoard
    }];
  }

  async function loadText(file) {
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
      pos: {
        x: 0,
        y: 0
      },
      size: {
        width: 0,
        height: 0
      }
    };

    $currentBoardComponents = [...$currentBoardComponents, {
      email: $currentSession?.user?.email,
      componentUUID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      component: response,
      boardUUID: $currentBoard
    }];
  }

  async function loadMarkDown(file) {
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
      pos: {
        x: 0,
        y: 0
      },
      size: {
        width: 0,
        height: 0
      }
    };

    $currentBoardComponents = [...$currentBoardComponents, {
      email: $currentSession?.user?.email,
      componentUUID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      component: response,
      boardUUID: $currentBoard
    }];
  }

  function loadUnknown(file) {
    if (file.name.endsWith(".md")) return loadMarkDown(file);
    console.log("Unknown file type", file);
  }

  function loadDrop(file) {
    switch (file.type) {
      case "image/png":
      case "image/jpeg":
      case "image/gif":
        return loadImage(file);
      case "text/plain":
        return loadText(file);
      default:
        return loadUnknown(file);
    }
  }

  onMount(() => {
    currentBoard.set($page.params.board);
  });
</script>

<Board loadDrop={loadDrop}>
  <BaseComponent>
    <h1>My App</h1>
    <p>Here's some cool text</p>
    <input class="input" placeholder="test">
  </BaseComponent>
</Board>
