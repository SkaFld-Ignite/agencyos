<template>
	<div class="space-y-6">
		<!-- About -->
		<UCard :ui="{ body: { padding: 'p-4' } }">
			<template #header>
				<h3 class="font-semibold text-gray-900 dark:text-white">About</h3>
			</template>
			<ul class="space-y-3 text-sm">
				<li class="flex items-center gap-3">
					<UIcon name="i-heroicons-envelope" class="text-gray-400 w-5 h-5" />
					<a :href="`mailto:${contact?.email}`" class="text-primary hover:underline truncate">
						{{ contact?.email }}
					</a>
				</li>
				<li v-if="contact?.phone" class="flex items-center gap-3">
					<UIcon name="i-heroicons-phone" class="text-gray-400 w-5 h-5" />
					<a :href="`tel:${contact?.phone}`" class="hover:text-gray-900 dark:hover:text-white">
						{{ contact?.phone }}
					</a>
				</li>
				<li v-if="contact?.location" class="flex items-center gap-3">
					<UIcon name="i-heroicons-map-pin" class="text-gray-400 w-5 h-5" />
					<span class="text-gray-700 dark:text-gray-300">{{ contact?.location }}</span>
				</li>
			</ul>
		</UCard>

		<!-- Tags -->
		<UCard :ui="{ body: { padding: 'p-4' } }">
			<template #header>
				<div class="flex justify-between items-center">
					<h3 class="font-semibold text-gray-900 dark:text-white">Tags</h3>
					<UButton icon="i-heroicons-plus" size="2xs" color="gray" variant="ghost" />
				</div>
			</template>
			<div class="flex flex-wrap gap-2">
				<UBadge v-for="tag in contact?.tags" :key="tag" color="gray" variant="solid">
					{{ tag }}
				</UBadge>
				<span v-if="!contact?.tags?.length" class="text-sm text-gray-500 italic">No tags</span>
			</div>
		</UCard>

		<!-- Deals -->
		<UCard :ui="{ body: { padding: 'p-0' } }">
			<template #header>
				<div class="flex justify-between items-center">
					<h3 class="font-semibold text-gray-900 dark:text-white">Deals</h3>
					<UButton icon="i-heroicons-plus" size="2xs" color="gray" variant="ghost" />
				</div>
			</template>
			<div class="divide-y divide-gray-100 dark:divide-gray-800">
				<div v-for="deal in contact?.deals" :key="deal.id" class="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition">
					<div class="font-medium text-sm">{{ deal.title }}</div>
					<div class="flex justify-between mt-1 text-xs text-gray-500">
						<span>{{ formatCurrency(deal.value) }}</span>
						<UBadge size="xs" :color="getDragColor(deal.status)" variant="subtle">{{ deal.status }}</UBadge>
					</div>
				</div>
				<div v-if="!contact?.deals?.length" class="p-4 text-center text-sm text-gray-500 italic">
					No active deals
				</div>
			</div>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import type { Contact } from '../../../../base/types';

defineProps<{
	contact: Contact | null;
}>();

const formatCurrency = (amount: number | null | undefined) => {
	if (!amount) return '$0';
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getDragColor = (status: string | undefined): 'gray' | 'blue' | 'yellow' | 'green' | 'red' => {
	switch (status) {
		case 'new': return 'blue';
		case 'discovery': return 'yellow';
		case 'proposal': return 'orange';
		case 'negotiation': return 'purple';
		case 'won': return 'green';
		case 'lost': return 'red';
		default: return 'gray';
	}
};
</script>
