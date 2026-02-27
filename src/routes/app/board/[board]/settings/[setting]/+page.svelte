<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  onMount(() => {
    goto(`/app/board/${$page.params.board}/settings/general`)
  })
</script>