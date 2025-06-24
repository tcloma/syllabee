<script lang="ts">
import "../app.css";

// biome-ignore lint/correctness/noUnusedVariables: <false positive, used below as a function>
const { children } = $props();
</script>

{@render children()}
