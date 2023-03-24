<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let loadDrop;

  export let position = writable({ left: 0, top: 0 });

  let pattern;
  let background;
  let container;

  function setPos(pos: { left: number; top: number }) {
    requestAnimationFrame(() => {
      container.style.left = `${pos.left}px`;
      container.style.top = `${pos.top}px`;

      pattern.style.backgroundPosition = `${pos.left}px ${pos.top}px`;
      position.set(pos);
    });
  }

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

      setPos({ left, top });

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
      let data = event.dataTransfer.getData("application/json");

      for (const file of files) {
        const pos = {
          left: event.clientX - container.offsetLeft,
          top: event.clientY - container.offsetTop
        };

        console.log(file, pos);
        loadDrop(file, pos);
      }

      if (data) {
        const dropData = JSON.parse(data);
        const pos = {
          left: event.clientX - container.offsetLeft,
          top: event.clientY - container.offsetTop
        };
        const blob = new Blob([dropData.content], { type: dropData.type });

        console.log(blob, pos);
        loadDrop(blob, pos);
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

    setPos({
      left: window.innerWidth / 2 - container.offsetWidth / 2,
      top: window.innerHeight / 2 - container.offsetHeight / 2
    });
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
<div class="fixed" bind:this={container} style="pointer-events: none">
  <slot />
</div>