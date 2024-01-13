<script>
	import '../app.pcss';
	import { MainNav } from "$lib/components/main-nav";
	import { Search } from "$lib/components/main-nav";
	import { UserNav } from "$lib/components/main-nav";
</script>

<div class="relative flex min-h-screen flex-col" id="page">
	<div class="border-b">
		<div class="flex h-16 items-center px-4">
			<MainNav class="mx-6" />
			<div class="ml-auto flex items-center space-x-4">
				<Search />
				<UserNav />
			</div>
		</div>
	</div>
	<div class="flex-1">
		<slot />
	</div>
</div>

