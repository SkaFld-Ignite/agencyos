<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
		<div class="flex justify-between items-end">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Financial Overview</h1>
				<p class="mt-2 text-gray-500">Track your agency's health, revenue, and burn rate.</p>
			</div>
			
			<div class="flex gap-2">
				<USelectMenu v-model="selectedYear" :options="['2025', '2024']" />
			</div>
		</div>

		<!-- Metrics Row -->
		<FinanceMetrics
			:revenue="totalRevenue"
			:expenses="totalExpenses"
			:cash-balance="125000"
		/>

		<!-- Charts & Lists -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<ProfitLossChart :data="monthlyData" />
			<ExpenseList :expenses="expenses" @add="openExpenseModal" />
		</div>

		<!-- Add Expense Modal (Simplified/Placeholder) -->
		<UModal v-model="expenseModalOpen">
			<UCard>
				<template #header>
					<h3 class="font-semibold">Add Expense</h3>
				</template>
				<div class="p-4 space-y-4">
					<UFormGroup label="Merchant" name="merchant">
						<UInput v-model="newExpense.merchant" placeholder="e.g. Vercel" />
					</UFormGroup>
					<UFormGroup label="Amount" name="amount">
						<UInput v-model.number="newExpense.cost" type="number" placeholder="0.00">
							<template #leading>$</template>
						</UInput>
					</UFormGroup>
					<UFormGroup label="Category" name="category">
						<USelectMenu v-model="newExpense.category" :options="['Software', 'Office', 'Contractors', 'Marketing']" />
					</UFormGroup>
					<div class="flex justify-end gap-2 mt-4">
						<UButton color="gray" variant="ghost" @click="expenseModalOpen = false">Cancel</UButton>
						<UButton color="black" @click="addExpense">Save Expense</UButton>
					</div>
				</div>
			</UCard>
		</UModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OsExpense } from '../../../../base/types/os/os-expense';

const selectedYear = ref('2025');
const expenseModalOpen = ref(false);

const newExpense = ref({
	merchant: '',
	cost: 0,
	category: 'Software'
});

// MOCK DATA
const totalRevenue = ref(452000);
const totalExpenses = ref(184000);

const monthlyData = ref([
	{ label: 'Jan', revenue: 32000, expenses: 12000 },
	{ label: 'Feb', revenue: 38000, expenses: 14000 },
	{ label: 'Mar', revenue: 29000, expenses: 11000 },
	{ label: 'Apr' , revenue: 42000, expenses: 18000 },
	{ label: 'May', revenue: 51000, expenses: 22000 },
	{ label: 'Jun', revenue: 48000, expenses: 19000 },
]);

const expenses = ref<OsExpense[]>([
	{ id: '1', merchant: 'Vercel', category: 'Software', cost: 20, date: '2025-06-15' },
	{ id: '2', merchant: 'Upwork', category: 'Contractors', cost: 450, date: '2025-06-12' },
	{ id: '3', merchant: 'AWS', category: 'Software', cost: 124, date: '2025-06-01' },
	{ id: '4', merchant: 'WeWork', category: 'Office', cost: 850, date: '2025-06-01' },
]);

const openExpenseModal = () => {
	newExpense.value = { merchant: '', cost: 0, category: 'Software' };
	expenseModalOpen.value = true;
};

const addExpense = () => {
	expenses.value.unshift({
		id: Math.random().toString(),
		merchant: newExpense.value.merchant,
		category: newExpense.value.category,
		cost: newExpense.value.cost,
		date: new Date().toISOString()
	});
	totalExpenses.value += newExpense.value.cost;
	expenseModalOpen.value = false;
};
</script>
