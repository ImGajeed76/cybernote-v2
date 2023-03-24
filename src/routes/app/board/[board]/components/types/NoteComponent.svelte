<script lang="ts">
  import { writable } from "svelte/store";
  import BaseComponent from "../BaseComponent.svelte";
  import { currentBoardComponents } from "$lib/database";
  import { onMount } from "svelte";

  export let index = 0;

  let component = $currentBoardComponents[index];
  currentBoardComponents.subscribe((components) => {
    component = components[index];
  });

  let position = writable({ ...component.component.pos });
  let size = writable({ ...component.component.size });
  let text = writable(component.component.text);

  let lastPosition = { ...component.component.pos };
  let lastSize = { ...component.component.size };

  let isEditing = false;

  currentBoardComponents.subscribe((components) => {
    component = components[index];
    if (!component || !component.component) return;
    position.set({ ...component.component.pos });
    size.set({ ...component.component.size });
    if (!isEditing) text.set(component.component.text);
  });

  let textarea;
  let placeholder;

  function update() {
    currentBoardComponents.update((components) => {
      components[index].component.pos = { ...$position };
      components[index].component.size = { ...$size };
      components[index].component.text = $text;
      return components;
    });
  }

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

    resizeFont();
  });


  function startEditing() {
    try {
      isEditing = true;
    } catch (_) {
      return;
    }
  }

  function stopEditing() {
    try {
      isEditing = false;
      update();
    } catch (_) {
      return;
    }
  }


  function resizeFont() {
    if (!textarea) return;
    if (!placeholder) return;
    if (!component) return;

    textarea.style.fontSize = "16px";
    const containerHeight = textarea.offsetHeight;
    const maxFontSize = 100;
    const minFontSize = 10;
    const fontSize = Math.round(Math.min(maxFontSize, Math.max(minFontSize, 0.15 * containerHeight)));
    textarea.style.fontSize = fontSize + "px";
    placeholder.style.fontSize = fontSize + "px";

    if (textarea.innerHTML === "" || textarea.innerHTML === "<br>") {
      textarea.innerHTML = "<br>";
      placeholder.innerHTML = "some text";
    } else {
      placeholder.innerHTML = "";
    }
  }

  onMount(() => {
    setTimeout(() => {
      resizeFont();
    }, 100);
  });
</script>

<BaseComponent componentPosition={position} componentSize={size} index={index}>
  <div bind:this={placeholder}
       class="duration-100 left-0 top-0 text-white/30 w-full h-full absolute bg-transparent justify-center content-center text-center flex flex-col"
       style="pointer-events: none; overflow: hidden">some text
  </div>
  <div contenteditable="true"
       class="duration-100 outline-0 w-full h-full bg-neutral p-3 rounded shadow justify-center content-center text-center flex flex-col"
       style="overflow: hidden" bind:innerHTML={$text} bind:this={textarea} on:focus={startEditing}
       on:blur={stopEditing}></div>

</BaseComponent>