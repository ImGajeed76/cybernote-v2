<script lang="ts">
  import Board from "./components/Board.svelte";
  import { uploadFile } from "$lib/database";
  import { onMount } from "svelte";
  import { currentBoard, currentBoardComponents, currentSession } from "../../../../lib/database";
  import { page } from "$app/stores";

  import MixedComponent from "./components/types/MixedComponent.svelte";
  import SideBar from "./components/SideBar.svelte";
  import { writable } from "svelte/store";

  let componentsLength = 0;
  currentBoardComponents.subscribe((value) => {
    if (value.length !== componentsLength) {
      componentsLength = value.length;
    }
  });

  let containerPos = writable({ top: 0, left: 0 });

  async function loadImage(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
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

  async function loadText(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
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

  async function loadNote(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
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
      type: "note",
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

  async function loadMarkDown(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
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

  function loadContainer(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
    if (pos.left === 0 && pos.top === 0) {
      pos.left = window.innerWidth / 2 - $containerPos.left;
      pos.top = window.innerHeight / 2 - $containerPos.top;
    }
    console.log(pos)

    const response = {
      type: "container",
      name: file.name,
      pos: pos,
      size: {
        width: 400,
        height: 400
      },
      content: []
    };

    $currentBoardComponents = [...$currentBoardComponents, {
      email: $currentSession?.user?.email,
      componentUUID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      component: response,
      boardUUID: $currentBoard
    }];
  }

  async function loadCodeBlock(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
    let code;
    await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        code = e.target.result;
        resolve(code);
      };
      reader.readAsText(file);
    });

    const response = {
      type: "code_block",
      code: code,
      name: file.name,
      pos: pos,
      size: {
        width: 400,
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

  function loadToDo(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
    const response = {
      type: "todo",
      name: file.name,
      pos: pos,
      size: {
        width: 600,
        height: 200
      },
      todos: [],
      title: "To Do"
    };

    $currentBoardComponents = [...$currentBoardComponents, {
      email: $currentSession?.user?.email,
      componentUUID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      component: response,
      boardUUID: $currentBoard
    }];
  }
  function loadUnknown(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
    if (file.name.endsWith(".md")) return loadMarkDown(file, pos);
    console.log("Unknown file type", file);
  }

  function loadDrop(file, pos: { left: number, top: number } = { left: 0, top: 0 }) {
    if (pos.left === 0 && pos.top === 0) {
      pos.left = window.innerWidth / 2 - $containerPos.left;
      pos.top = window.innerHeight / 2 - $containerPos.top;
    }

    switch (file.type) {
      case "image/png":
      case "image/jpeg":
      case "image/gif":
        return loadImage(file, pos);
      case "text/plain":
        return loadText(file, pos);
      case "text/note":
        return loadNote(file, pos);
      case "text/markdown":
        return loadMarkDown(file, pos);
      case "container":
        return loadContainer(file, pos);
      case "text/code_block":
        return loadCodeBlock(file, pos);
      case "todo":
        return loadToDo(file, pos);
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

<div class="w-full h-full">
  {#if !loading}
    <Board loadDrop={loadDrop} position={containerPos}>
      {#each Array(componentsLength) as _, index}
        <MixedComponent index={index} />
      {/each}
    </Board>
    <SideBar loadDrop={loadDrop} containerPosition={$containerPos}/>
  {/if}
</div>
