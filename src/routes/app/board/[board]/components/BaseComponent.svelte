<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let data: {
    focus: () => void;
    blur: () => void;
    position: () => { x: number; y: number };
    size: () => { width: number; height: number };
  };

  let background;
  let front;
  let resizeDiv;

  let lastPos = { x: 0, y: 0 };
  let lastSize = { width: 0, height: 0 };

  const focusedElement = writable(0);
  focusedElement.subscribe((value) => {
    if (!background) return;
    if (!front) return;

    switch (value) {
      case 0:
        blur();
        if (data) data.blur();
        break;
      case 1:
        focus();
        if (data) data.blur();
        break;
      case 2:
        blur();
        if (data) data.focus();
        else focus();
        break;
    }
  });

  function hasActiveElement() {
    return document.activeElement === background || background.contains(document.activeElement) || $focusedElement === 2;
  }

  function setPos(pos: { x: number; y: number }) {
    if (pos.x === lastPos.x && pos.y === lastPos.y) return;

    requestAnimationFrame(() => {
      background.style.left = `${pos.x}px`;
      background.style.top = `${pos.y}px`;
    });

    lastPos = { ...pos };
  }

  function setSize(size: { width: number; height: number }) {
    if (size.width === lastSize.width && size.height === lastSize.height) return;

    requestAnimationFrame(() => {
      background.style.width = `${size.width}px`;
      background.style.height = `${size.height}px`;
    });

    lastSize = { ...size };
  }

  function focus() {
    background.focus();
    background.classList.remove("outline-0");
    background.classList.add("outline-1");
  }

  function blur() {
    background.blur();
    background.classList.remove("outline-1");
    background.classList.add("outline-0");
  }

  function drag(event) {
    event = event || window.event;
    event.preventDefault();

    const startPos = {
      x: event.clientX,
      y: event.clientY
    };

    const backgroundStartPos = {
      x: background.offsetLeft,
      y: background.offsetTop
    };

    document.body.onmousemove = (event) => {
      event.preventDefault();

      const position = {
        x: event.clientX - startPos.x + backgroundStartPos.x,
        y: event.clientY - startPos.y + backgroundStartPos.y
      };

      setPos(position);
      document.body.style.cursor = "grabbing";
    };

    document.body.onmouseup = () => {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      document.body.style.cursor = "grab";

      if (data) data.position = { ...lastPos } as any;
      if (data) data.size = { ...lastSize } as any;
    };
  }

  function initMouse() {
    front.onmousedown = (event) => {
      if (hasActiveElement()) return;
      drag(event);
    };
    front.onmouseleave = () => {
      document.body.style.cursor = "auto";
    };
    front.onmouseenter = () => document.body.style.cursor = "grab";

    front.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      focusedElement.update((value) => (value + 1) % 3);
    };

    front.ondblclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      focusedElement.set(2);
    };
  }

  function resize(event) {
    event = event || window.event;
    event.preventDefault();

    focusedElement.set(1);

    const startPos = {
      x: event.clientX,
      y: event.clientY
    };

    const backgroundStartSize = {
      width: background.offsetWidth,
      height: background.offsetHeight
    };

    document.body.onmousemove = (event) => {
      event.preventDefault();

      const size = {
        width: event.clientX - startPos.x + backgroundStartSize.width,
        height: event.clientY - startPos.y + backgroundStartSize.height
      };

      setSize(size);
      document.body.style.cursor = "nwse-resize";
    };

    document.body.onmouseup = () => {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      document.body.style.cursor = "auto";

      if (data) data.position = { ...lastPos } as any;
      if (data) data.size = { ...lastSize } as any;
    };
  }

  function initResize() {
    resizeDiv.onmouseenter = () => document.body.style.cursor = "nwse-resize";
    resizeDiv.onmouseleave = () => document.body.style.cursor = "auto";
    resizeDiv.onmousedown = resize;
  }

  onMount(() => {
    initMouse();
    initResize();
  });
</script>

<div class="p-3 outline outline-0 rounded relative" bind:this={background} style="overflow: hidden">
  <slot />
  <div class="absolute w-full h-full left-0 top-0" bind:this={front}></div>
  <div class="absolute w-[20px] h-[20px] bottom-0 right-0" bind:this={resizeDiv} style="z-index: 1">
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M10 20L20 20L20 10" stroke="#fff" stroke-width="2"></path>
        <path d="M12 17L17 17L17 12" stroke="#fff" stroke-width="2"></path>
      </g>
    </svg>
  </div>
</div>