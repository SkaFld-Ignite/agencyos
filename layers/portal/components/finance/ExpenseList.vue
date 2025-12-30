<template>
	<UCard :ui="{ body: { padding: 'p-0' } }">
		<template #header>
			<div class="flex justify-between items-center">
				<h3 class="font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
				<UButton icon="i-heroicons-plus" size="xs" color="black" @click="$emit('add')">Add Expense</UButton>
			</div>
		</template>
		
		<div class="overflow-x-auto">
			<table class="w-full text-sm text-left">
				<thead class="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
					<tr>
						<th class="px-4 py-3">Merchant</th>
						<th class="px-4 py-3">Category</th>
						<th class="px-4 py-3">Date</th>
						<th class="px-4 py-3 text-right">Amount</th>
						<th class="px-4 py-3 text-center">Receipt</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
					<tr v-for="expense in expenses" :key="expense.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
						<td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
							{{ expense.merchant || expense.name }}
						</td>
						<td class="px-4 py-3 text-gray-500">
							<UBadge color="gray" variant="subtle" size="xs">{{ expense.category }}</UBadge>
						</td>
						<td class="px-4 py-3 text-gray-500">{{ formatDate(expense.date) }}</td>
						<td class="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
							{{ formatCurrency(expense.cost) }}
						</td>
						<td class="px-4 py-3 text-center">
							<UButton v-if="expense.file" icon="i-heroicons-paper-clip" size="2xs" color="gray" variant="ghost" />
						</td>
					</tr>
					<tr v-if="expenses.length === 0">
						<td colspan="5" class="px-4 py-8 text-center text-gray-500 italic">
							No expenses recorded.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { OsExpense } from '../../../../base/types/os/os-expense';

defineProps<{
	expenses: OsExpense[];
}>();

defineEmits<{
	(e: 'add'): void;
}>();

const formatCurrency = (val: number | null | undefined) => {
	if (val === null || val === undefined) return '$0.00';
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const formatDate = (date: string | null | undefined) => {
	if (!date) return '-';
	return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
</script>
