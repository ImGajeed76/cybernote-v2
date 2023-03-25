<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(() => {
    const currentPath = window.location.pathname;
    goto(`${currentPath}/general`);
  })
</script>