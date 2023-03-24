<script lang="ts">
  import { writable } from "svelte/store";
  import BaseComponent from "../BaseComponent.svelte";
  import { currentBoardComponents } from "$lib/database";
  import { marked } from "marked";

  export let index = 0;

  let component = $currentBoardComponents[index];
  currentBoardComponents.subscribe((components) => {
    component = components[index];
  });

  let position = writable({ ...component.component.pos });
  let size = writable({ ...component.component.size });
  let text = writable(component.component.markdown);
  let innerHTML = "";

  let lastPosition = { ...component.component.pos };
  let lastSize = { ...component.component.size };

  let isEditing = false;

  let textarea;
  let nonEditingDiv;

  function update() {
    currentBoardComponents.update((components) => {
      components[index].component.pos = { ...$position };
      components[index].component.size = { ...$size };
      components[index].component.markdown = $text;
      return components;
    });
  }

  function startEditing() {
    isEditing = true;
    textarea.classList.remove("hidden");
    nonEditingDiv.classList.add("hidden");
    textarea.focus();
  }

  function stopEditing() {
    isEditing = false;
    innerHTML = marked($text);
    textarea.classList.add("hidden");
    nonEditingDiv.classList.remove("hidden");
    update();
  }

  text.subscribe((value) => {
    innerHTML = marked(value);
  });

  position.subscribe(() => {
    if (JSON.stringify(lastPosition) !== JSON.stringify($position)) {
      lastPosition = { ...$position };
      update();
    }
  });

  size.subscribe(() => {
    if (JSON.stringify(lastSize) !== JSON.stringify($size)) {
      lastSize = { ...$size };
      update();
    }
  });

  function handleClick(event) {
    event.stopPropagation();
    startEditing();
  }
</script>

<BaseComponent componentPosition={position} componentSize={size} index={index}>
  <div
    tabindex="0"
    class="absolute top-0 left-0 duration-100 outline-0 max-w-full w-full h-full bg-neutral p-3 rounded shadow prose"
    style="overflow: hidden"
    on:click={handleClick}
    bind:this={nonEditingDiv}
  >
    {@html innerHTML}
  </div>
  <textarea
    class="absolute top-0 left-0 hidden duration-100 outline-0 max-w-full w-full h-full bg-neutral p-3 rounded shadow"
    style="overflow: hidden; resize: none"
    bind:value={$text}
    bind:this={textarea}
    on:blur={stopEditing}
  ></textarea>
</BaseComponent>
