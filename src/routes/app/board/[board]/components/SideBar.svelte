<script>
  import DragComponent from "./DragComponent.svelte";
</script>

<div class="absolute min-h-full pl-5 grid items-center">
  <div class="rounded-lg bg-neutral w-16 h-[50%] shadow-2xl">
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="26" height="26">
        <path
          d="M14.85 3c.63 0 1.15.52 1.14 1.15v7.7c0 .63-.51 1.15-1.15 1.15H1.15C.52 13 0 12.48 0 11.84V4.15C0 3.52.52 3 1.15 3ZM9 11V5H7L5.5 7 4 5H2v6h2V8l1.5 1.92L7 8v3Zm2.99.5L14.5 8H13V5h-2v3H9.5Z"
          fill="#fff"
        ></path>
      </svg>
    </DragComponent>
  </div>
</div>