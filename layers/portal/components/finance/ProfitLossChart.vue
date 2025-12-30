<template>
	<UCard>
		<template #header>
			<h3 class="font-semibold text-gray-900 dark:text-white">Profit & Loss</h3>
		</template>
		<div class="h-64 flex items-end justify-between gap-2 px-2">
			<div v-for="(month, index) in data" :key="month.label" class="w-full flex flex-col items-center gap-2 group">
				<!-- Tooltip -->
				<div class="opacity-0 group-hover:opacity-100 transition absolute mb-24 bg-gray-900 text-white text-xs rounded py-1 px-2 z-10">
					<div>Rev: {{ formatCurrency(month.revenue) }}</div>
					<div>Exp: {{ formatCurrency(month.expenses) }}</div>
				</div>
				
				<!-- Bars -->
				<div class="w-full max-w-[40px] flex gap-1 items-end h-[200px]">
					<div
						class="w-1/2 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-400"
						:style="{ height: `${(month.revenue / maxVal) * 100}%` }"
					></div>
					<div
						class="w-1/2 bg-red-400 rounded-t transition-all duration-500 hover:bg-red-300"
						:style="{ height: `${(month.expenses / maxVal) * 100}%` }"
					></div>
				</div>
				<span class="text-xs text-gray-500">{{ month.label }}</span>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	data: { label: string; revenue: number; expenses: number }[];
}>();

const maxVal = computed(() => {
	return Math.max(...props.data.map((d) => Math.max(d.revenue, d.expenses))) * 1.1;
});

const formatCurrency = (val: number) => {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};
</script>
