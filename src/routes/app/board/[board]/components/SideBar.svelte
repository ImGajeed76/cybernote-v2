<script>
  import DragComponent from "./DragComponent.svelte";
  import { onMount } from "svelte";

  export let loadDrop;
  export let containerPosition;

  let imageInput;
  let imageComponent;

  function loadImage(event = null) {
    const selectedFile = imageInput.files[0];

    let pos = {
      left: containerPosition.left / 2,
      top: containerPosition.top / 2
    };

    if (event) {
      pos = {
        left: event.clientX - containerPosition.left,
        top: event.clientY - containerPosition.top
      };
    }

    loadDrop(selectedFile, pos);
    imageInput.value = "";
    imageInput.onchange = () => loadImage();
  }

  function openFileDialog(event) {
    imageInput.onchange = () => loadImage(event);
    imageInput.click();
  }

  function initNoteDrag() {
    imageComponent.draggable = true;
    imageComponent.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("no-data", {});
    });

    imageComponent.addEventListener("dragend", (event) => {
      event.dataTransfer.clearData();
      openFileDialog(event);
    });
  }

  onMount(() => {
    initNoteDrag();
    imageInput.onchange = () => loadImage();
  });
</script>

<div class="absolute min-h-full pl-5 grid items-center" style="pointer-events: none">
  <div class="rounded-lg bg-neutral w-16 h-[50%] shadow-2xl" style="pointer-events: all">
    <DragComponent name="note" type="text/note" content="A new note">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M20 14V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V17C4 18.6569 5.34315 20 7 20H13.5M20 14L13.5 20M20 14H15.5C14.3954 14 13.5 14.8954 13.5 16V20"
            stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
      </svg>
    </DragComponent>

    <DragComponent name="text" type="text/plain" content="Some Text">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Edit / Text">
            <path id="Vector" d="M10 19H12M12 19H14M12 19V5M12 5H6V6M12 5H18V6" stroke="#fff" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </g>
      </svg>
    </DragComponent>

    <DragComponent name="markdown" type="text/markdown" content="# Some Markdown">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24">
        <path
          d="M14.85 3c.63 0 1.15.52 1.14 1.15v7.7c0 .63-.51 1.15-1.15 1.15H1.15C.52 13 0 12.48 0 11.84V4.15C0 3.52.52 3 1.15 3ZM9 11V5H7L5.5 7 4 5H2v6h2V8l1.5 1.92L7 8v3Zm2.99.5L14.5 8H13V5h-2v3H9.5Z"
          fill="#fff"
        ></path>
      </svg>
    </DragComponent>

    <button class="w-16 h-16 p-4 rounded-box duration-100 hover:p-5 flex justify-center relative"
            bind:this={imageComponent} style="overflow: hidden">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Media / Image_01">
            <path id="Vector"
                  d="M3.00005 17.0001C3 16.9355 3 16.8689 3 16.8002V7.2002C3 6.08009 3 5.51962 3.21799 5.0918C3.40973 4.71547 3.71547 4.40973 4.0918 4.21799C4.51962 4 5.08009 4 6.2002 4H17.8002C18.9203 4 19.4801 4 19.9079 4.21799C20.2842 4.40973 20.5905 4.71547 20.7822 5.0918C21 5.5192 21 6.07899 21 7.19691V16.8031C21 17.2881 21 17.6679 20.9822 17.9774M3.00005 17.0001C3.00082 17.9884 3.01337 18.5058 3.21799 18.9074C3.40973 19.2837 3.71547 19.5905 4.0918 19.7822C4.5192 20 5.07899 20 6.19691 20H17.8036C18.9215 20 19.4805 20 19.9079 19.7822C20.2842 19.5905 20.5905 19.2837 20.7822 18.9074C20.9055 18.6654 20.959 18.3813 20.9822 17.9774M3.00005 17.0001L7.76798 11.4375L7.76939 11.436C8.19227 10.9426 8.40406 10.6955 8.65527 10.6064C8.87594 10.5282 9.11686 10.53 9.33643 10.6113C9.58664 10.704 9.79506 10.9539 10.2119 11.4541L12.8831 14.6595C13.269 15.1226 13.463 15.3554 13.6986 15.4489C13.9065 15.5313 14.1357 15.5406 14.3501 15.4773C14.5942 15.4053 14.8091 15.1904 15.2388 14.7607L15.7358 14.2637C16.1733 13.8262 16.3921 13.6076 16.6397 13.5361C16.8571 13.4734 17.0896 13.4869 17.2988 13.5732C17.537 13.6716 17.7302 13.9124 18.1167 14.3955L20.9822 17.9774M20.9822 17.9774L21 17.9996M15 10C14.4477 10 14 9.55228 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10Z"
                  stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </g>
      </svg>

      <input type="file" class="absolute left-0 file-input file-input-ghost text-transparent"
             accept="image/png, image/jpeg, image/gif"
             bind:this={imageInput}>
    </button>

    <DragComponent name="todo" type="todo" content="">
      <svg fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M2,11H8a1,1,0,0,0,1-1V4A1,1,0,0,0,8,3H2A1,1,0,0,0,1,4v6A1,1,0,0,0,2,11ZM3,5H7V9H3ZM8,21a1,1,0,0,0,1-1V14a1,1,0,0,0-1-1H2a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1ZM3,15H7v4H3ZM23,7a1,1,0,0,1-1,1H12a1,1,0,0,1,0-2H22A1,1,0,0,1,23,7Zm0,10a1,1,0,0,1-1,1H12a1,1,0,0,1,0-2H22A1,1,0,0,1,23,17Z"></path>
        </g>
      </svg>
    </DragComponent>

    <DragComponent name="code_block" type="text/code_block" content="">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M9.70711 6.29289C10.0976 6.68342 10.0976 7.31658 9.70711 7.70711L5.41421 12L9.70711 16.2929C10.0976 16.6834 10.0976 17.3166 9.70711 17.7071C9.31658 18.0976 8.68342 18.0976 8.29289 17.7071L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L8.29289 6.29289C8.68342 5.90237 9.31658 5.90237 9.70711 6.29289ZM14.2929 6.29289C14.6834 5.90237 15.3166 5.90237 15.7071 6.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L15.7071 17.7071C15.3166 18.0976 14.6834 18.0976 14.2929 17.7071C13.9024 17.3166 13.9024 16.6834 14.2929 16.2929L18.5858 12L14.2929 7.70711C13.9024 7.31658 13.9024 6.68342 14.2929 6.29289Z"
                fill="#fff"></path>
        </g>
      </svg>
    </DragComponent>

    <DragComponent name="container" type="container" content="">
      <svg fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path fill-rule="evenodd"
                d="M13.152.682a2.25 2.25 0 012.269 0l.007.004 6.957 4.276a2.276 2.276 0 011.126 1.964v7.516c0 .81-.432 1.56-1.133 1.968l-.002.001-11.964 7.037-.004.003a2.276 2.276 0 01-2.284 0l-.026-.015-6.503-4.502a2.268 2.268 0 01-1.096-1.943V9.438c0-.392.1-.77.284-1.1l.003-.006.014-.026a2.28 2.28 0 01.82-.827h.002L13.152.681zm.757 1.295h-.001L2.648 8.616l6.248 4.247a.776.776 0 00.758-.01h.001l11.633-6.804-6.629-4.074a.75.75 0 00-.75.003zM18 9.709l-3.25 1.9v7.548L18 17.245V9.709zm1.5-.878v7.532l2.124-1.25a.777.777 0 00.387-.671V7.363L19.5 8.831zm-9.09 5.316l2.84-1.66v7.552l-3.233 1.902v-7.612c.134-.047.265-.107.391-.18l.002-.002zm-1.893 7.754V14.33a2.277 2.277 0 01-.393-.18l-.023-.014-6.102-4.147v7.003c0 .275.145.528.379.664l.025.014 6.114 4.232z"></path>
        </g>
      </svg>
    </DragComponent>
  </div>
</div>