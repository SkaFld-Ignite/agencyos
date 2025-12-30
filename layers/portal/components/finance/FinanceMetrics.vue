<template>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<UCard v-for="metric in metrics" :key="metric.label">
			<div class="flex flex-col">
				<span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ metric.label }}</span>
				<div class="mt-2 flex items-baseline gap-2">
					<span class="text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</span>
					<span
						v-if="metric.trend"
						class="text-xs font-medium"
						:class="metric.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
					>
						{{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
					</span>
				</div>
				<span class="text-xs text-gray-500 mt-1">{{ metric.subtext }}</span>
			</div>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	revenue: number;
	expenses: number;
	cashBalance: number;
}>();

const profit = computed(() => props.revenue - props.expenses);
const runway = computed(() => {
	if (props.expenses <= 0) return 'Infinite';
	return (props.cashBalance / props.expenses).toFixed(1) + ' months';
});

const formatCurrency = (val: number) => {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

const metrics = computed(() => [
	{
		label: 'Total Profit',
		value: formatCurrency(profit.value),
		trend: 12.5,
		subtext: 'Net income this month',
	},
	{
		label: 'Total Revenue',
		value: formatCurrency(props.revenue),
		trend: 8.2,
		subtext: 'Invoiced & Paid',
	},
	{
		label: 'Total Expenses',
		value: formatCurrency(props.expenses),
		trend: -2.4,
		subtext: 'Outgoing costs',
	},
	{
		label: 'Runway',
		value: runway.value,
		trend: 0,
		subtext: 'Based on current burn',
	},
]);
</script>
