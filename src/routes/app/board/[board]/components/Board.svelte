<script lang="ts">
  import { onMount } from "svelte";
  export let loadDrop;

  let pattern;
  let background;
  let container;

  function drag(event) {
    event = event || window.event;
    event.preventDefault();

    let startX = event.clientX;
    let startY = event.clientY;

    let startLeft = parseFloat(getComputedStyle(container).left);
    let startTop = parseFloat(getComputedStyle(container).top);

    document.body.onmousemove = (event) => {
      event.preventDefault();

      let left = startLeft + event.clientX - startX;
      let top = startTop + event.clientY - startY;

      requestAnimationFrame(() => {
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;

        pattern.style.backgroundPosition = `${left}px ${top}px`;
      });

      document.body.style.cursor = "grabbing";
    };

    document.body.onmouseup = () => {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      document.body.style.cursor = "auto";
    };
  }

  function initDrag() {
    background.onmousedown = (event) => {
      if (background === event.target) drag(event);
    };
  }

  function drop(event) {
    event = event || window.event;
    event.preventDefault();

    if (event.type === "dragenter" || event.type === "dragover") background.classList.add("bg-neutral/30");
    if (event.type === "dragleave" || event.type === "drop") background.classList.remove("bg-neutral/30");

    if (event.type === "drop") {
      let files = event.dataTransfer.files;

      for (const file of files) {
        loadDrop(file);
      }
    }
  }

  function initDrop() {
    background.ondragenter = drop;
    background.ondragover = drop;
    background.ondragleave = drop;
    background.ondrop = drop;
  }

  onMount(() => {
    initDrag();
    initDrop();
  });
</script>

<style>
    .bg-pattern {
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
    }
</style>

<div class="bg-pattern w-screen h-screen fixed" bind:this={pattern}></div>
<div class="w-screen h-screen fixed duration-200" bind:this={background}></div>
<div class="fixed" bind:this={container}>
  <slot />
</div>