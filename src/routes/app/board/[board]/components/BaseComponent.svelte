<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { currentBoardComponents, deleteDBComponent } from "../../../../../lib/database";
  import { zoom } from "$lib/stores";

  export let componentPosition = writable({ left: 0, top: 0 });
  componentPosition.subscribe((value) => {
    setPos(value);
  });
  export let componentSize = writable({ width: 200, height: 200 });
  componentSize.subscribe((value) => {
    setSize(value);
  });

  export let index = 0;

  let baseComponent;
  let background;
  let foreground;
  let resize_nw;
  let resize_ne;
  let resize_sw;
  let resize_se;

  function blur() {
    baseComponent.classList.remove("outline-1");
    baseComponent.classList.add("outline-0");

    background.classList.add("hidden");

    document.activeElement.blur();
  }

  function focus() {
    baseComponent.classList.remove("outline-0");
    baseComponent.classList.add("outline-1");

    background.classList.remove("hidden");
  }

  let activeElement = writable(0);
  activeElement.subscribe((value) => {
    if (!baseComponent) return;

    switch (value) {
      case 0:
        blur();
        foreground.classList.remove("hidden");
        break;
      case 1:
        focus();
        foreground.classList.remove("hidden");
        break;
      case 2:
        focus();
        foreground.classList.add("hidden");
        break;
    }
  });

  function initClicks() {
    background.addEventListener("click", () => {
      activeElement.set(1);
    });

    foreground.addEventListener("click", () => {
      if ($activeElement === 0) activeElement.set(1);
      else if ($activeElement === 1) activeElement.set(2);
    });

    window.addEventListener("click", (event) => {
      if (!baseComponent) return;
      if (event.target === baseComponent || baseComponent.contains(event.target)) return;
      if (event.target.getAttribute("contenteditable") === "true") return;
      blur();
      activeElement.set(0);
    });
  }

  function setPos(pos: { left: number; top: number }) {
    try {
      requestAnimationFrame(() => {
        if (!baseComponent || !baseComponent.style) return;
        baseComponent.style.left = `${pos.left}px`;
        baseComponent.style.top = `${pos.top}px`;
      });
    } catch (_) {
      return;
    }
  }

  function setSize(size: { width: number; height: number }) {
    try {
      requestAnimationFrame(() => {
        if (!baseComponent || !baseComponent.style) return;
        baseComponent.style.width = `${size.width}px`;
        baseComponent.style.height = `${size.height}px`;
      });
    } catch (_) {
      return;
    }
  }

  function drag(clientX, clientY) {
    const componentStartPos = {
      left: baseComponent.offsetLeft,
      top: baseComponent.offsetTop
    };

    const mouseStartPos = {
      left: clientX / $zoom,
      top: clientY / $zoom
    };

    window.onmousemove = (event) => {
      event.preventDefault();

      const mousePos = {
        left: event.clientX / $zoom,
        top: event.clientY / $zoom
      };

      const componentPos = {
        left: (componentStartPos.left + mousePos.left - mouseStartPos.left),
        top: (componentStartPos.top + mousePos.top - mouseStartPos.top)
      };

      setPos(componentPos);
      document.body.style.cursor = "grabbing";
    };

    window.onmouseup = () => {
      window.onmousemove = null;
      window.onmouseup = null;
      document.body.style.cursor = "auto";

      const endPos = {
        left: baseComponent.offsetLeft,
        top: baseComponent.offsetTop
      };

      if (endPos.left !== componentStartPos.left || endPos.top !== componentStartPos.top) {
        activeElement.set(0);
      }

      componentPosition.set(endPos);
    };
  }

  function initDrag() {
    baseComponent.onmousedown = (event) => {
      if (!baseComponent) return;
      if (background.contains(event.target)) return;
      if ($activeElement === 2) return;
      drag(event.clientX, event.clientY);
    };

    baseComponent.ontouchstart = (event) => {
      if (!baseComponent) return;
      if (background.contains(event.target)) return;
      if ($activeElement === 2) return;
      const touch = event.touches[0];
      drag(touch.clientX, touch.clientY);
    };
  }

  function resize(event, direction: { x: number; y: number }, clientX, clientY) {
    const componentStartSize = {
      width: baseComponent.offsetWidth,
      height: baseComponent.offsetHeight
    };

    const componentStartPos = {
      left: baseComponent.offsetLeft,
      top: baseComponent.offsetTop
    };

    const mouseStartPos = {
      left: clientX / $zoom,
      top: clientY / $zoom
    };

    const posOffset = { x: 0, y: 0 };

    window.onmousemove = (event) => {
      event.preventDefault();

      const mousePos = {
        left: event.clientX / $zoom,
        top: event.clientY / $zoom
      };

      if (componentStartSize.width + (mousePos.left - mouseStartPos.left) * direction.x < 0) {
        direction.x *= -1;
        mouseStartPos.left = mousePos.left;
        componentStartSize.width = 0;
      }
      if (componentStartSize.height + (mousePos.top - mouseStartPos.top) * direction.y < 0) {
        direction.y *= -1;
        mouseStartPos.top = mousePos.top;
        componentStartSize.height = 0;
      }


      const componentSize = {
        width: componentStartSize.width + (mousePos.left - mouseStartPos.left) * direction.x,
        height: componentStartSize.height + (mousePos.top - mouseStartPos.top) * direction.y
      };

      const componentPos = {
        left: componentStartPos.left + (mousePos.left - mouseStartPos.left) * (1 - direction.x) / 2 + posOffset.x,
        top: componentStartPos.top + (mousePos.top - mouseStartPos.top) * (1 - direction.y) / 2 + posOffset.y
      };

      setSize(componentSize);
      setPos(componentPos);
    };

    window.onmouseup = () => {
      window.onmousemove = null;
      window.onmouseup = null;
      document.body.style.cursor = "auto";

      const endSize = {
        width: baseComponent.offsetWidth,
        height: baseComponent.offsetHeight
      };

      const endPos = {
        left: baseComponent.offsetLeft,
        top: baseComponent.offsetTop
      };

      if (endSize.width !== componentStartSize.width || endSize.height !== componentStartSize.height) {
        activeElement.set(0);
      }

      componentSize.set(endSize);
      componentPosition.set(endPos);
    };
  }

  function initResize() {
    const handleResize = (event, direction) => {
      event.preventDefault();
      const clientX = event.clientX || event.touches[0].clientX;
      const clientY = event.clientY || event.touches[0].clientY;
      resize(event, direction, clientX, clientY);
    };

    resize_sw.onmousedown = (event) => handleResize(event, { x: -1, y: 1 });
    resize_sw.ontouchstart = (event) => handleResize(event, { x: -1, y: 1 });

    resize_se.onmousedown = (event) => handleResize(event, { x: 1, y: 1 });
    resize_se.ontouchstart = (event) => handleResize(event, { x: 1, y: 1 });

    resize_nw.onmousedown = (event) => handleResize(event, { x: -1, y: -1 });
    resize_nw.ontouchstart = (event) => handleResize(event, { x: -1, y: -1 });

    resize_ne.onmousedown = (event) => handleResize(event, { x: 1, y: -1 });
    resize_ne.ontouchstart = (event) => handleResize(event, { x: 1, y: -1 });
  }

  function handleKeyPress(event) {
    if ((event.key === "Delete" || event.key === "Backspace") && $activeElement === 1) {
      deleteComponent();
    }
  }

  async function deleteComponent() {
    if (!$currentBoardComponents[index]) return;
    await deleteDBComponent($currentBoardComponents[index].componentUUID);
    $currentBoardComponents = $currentBoardComponents.filter((_, i) => i !== index);
  }


  onMount(() => {
    initClicks();
    initDrag();
    initResize();

    setTimeout(() => {
      setPos($componentPosition);
      setSize($componentSize);
    }, 1);

    window.addEventListener("keyup", handleKeyPress);
  });
</script>

<div class="outline outline-0 outline-white absolute w-40 h-40" bind:this={baseComponent} style="pointer-events: all">
  <div class="absolute w-full h-full hidden" bind:this={background} style="cursor: pointer">
    <div
      class="rounded-full w-[0.6rem] h-[0.6rem] bg-base-100 outline outline-white outline-1 absolute left-[-0.3rem] top-[-0.3rem]"
      style="cursor: nw-resize; z-index: 99" bind:this={resize_nw}></div>
    <div
      class="rounded-full w-[0.6rem] h-[0.6rem] bg-base-100 outline outline-white outline-1 absolute right-[-0.3rem] top-[-0.3rem]"
      style="cursor: ne-resize; z-index: 99" bind:this={resize_ne}></div>
    <div
      class="rounded-full w-[0.6rem] h-[0.6rem] bg-base-100 outline outline-white outline-1 absolute left-[-0.3rem] bottom-[-0.3rem]"
      style="cursor: sw-resize; z-index: 99" bind:this={resize_sw}></div>
    <div
      class="rounded-full w-[0.6rem] h-[0.6rem] bg-base-100 outline outline-white outline-1 absolute right-[-0.3rem] bottom-[-0.3rem]"
      style="cursor: se-resize; z-index: 99" bind:this={resize_se}></div>
  </div>

  <div class="absolute w-full h-full p-3" style="overflow: hidden; pointer-events: none">
    <div class="w-full h-full" style="pointer-events: all">
      <slot />
    </div>
  </div>

  <div class="absolute w-full h-full p-1" style="pointer-events: none">
    <div class="w-full h-full" bind:this={foreground} style="pointer-events: all"></div>
  </div>

  <div class="absolute h-[4rem] w-full top-[-5rem] flex justify-center items-center {$activeElement !== 0 ? '' : 'hidden'} duration-300" style="pointer-events: none">
    <div class="rounded bg-neutral h-full w-fit" style="pointer-events: all">
      <button class="btn h-full" on:click={deleteComponent}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path
            d="M16 1.75V3h5.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75Zm-6.5 0V3h5V1.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM4.997 6.178a.75.75 0 1 0-1.493.144L4.916 20.92a1.75 1.75 0 0 0 1.742 1.58h10.684a1.75 1.75 0 0 0 1.742-1.581l1.413-14.597a.75.75 0 0 0-1.494-.144l-1.412 14.596a.25.25 0 0 1-.249.226H6.658a.25.25 0 0 1-.249-.226L4.997 6.178Z"
            fill="#E57373"
          ></path>
          <path
            d="M9.206 7.501a.75.75 0 0 1 .793.705l.5 8.5A.75.75 0 1 1 9 16.794l-.5-8.5a.75.75 0 0 1 .705-.793Zm6.293.793A.75.75 0 1 0 14 8.206l-.5 8.5a.75.75 0 0 0 1.498.088l.5-8.5Z"
            fill="#E57373"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</div>