<script lang="ts">
  import { onMount } from "svelte";

  export let type = "text/plain";
  export let name = "text";
  export let content = "text";

  let dragComponent;

  function initNoteDrag () {
    dragComponent.draggable = true;
    dragComponent.dataset.file = JSON.stringify({
      name: name,
      type: type,
      content: content,
    })

    dragComponent.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('application/json', event.target.dataset.file);
    });

    dragComponent.addEventListener('dragend', (event) => {
      event.dataTransfer.clearData();
    });
  }

  onMount(() => {
    initNoteDrag();
  });
</script>

<button class="w-16 h-16 p-4 rounded-box duration-100 hover:p-5 flex justify-center" bind:this={dragComponent}>
  <slot />
</button>