<script lang="ts">
	import { cn } from "$lib/utils";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<a
		href="/"
		class="text-sm font-medium transition-colors hover:text-primary"
	>
		Overview
	</a>

	<a
		href="/dashboard"
		class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
	>
		Dashboard
	</a>

	<a
		href="/shadcn-datatable"
		class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
	>
		Table
	</a>

	<a
		href="/dashboard_error"
		class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
	>
		shadcn-svelte resize error
	</a>

	<a
	href="/layerchart"
	class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
	>
		layerchart
	</a>
	<a
	href="/plot"
	class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
	>
		Plot
	</a>

</nav>
