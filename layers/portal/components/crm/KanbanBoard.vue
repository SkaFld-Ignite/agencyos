<script setup lang="ts">
import draggable from 'vuedraggable';
import { updateItem } from '@directus/sdk';
import type { OsDeal, OsDealStage } from '~/types';

const props = defineProps<{
	stages: OsDealStage[];
	deals: OsDeal[];
}>();

const emit = defineEmits(['refresh']);

// Local state for drag and drop
const localDealsByStage = ref<Record<string, OsDeal[]>>({});
const isLoading = ref(false);

const { fileUrl } = useFiles();

// Initialize local state from props
watchEffect(() => {
	const grouped: Record<string, OsDeal[]> = {};
	
	// Initialize all stages
	props.stages.forEach(stage => {
		if (stage.id) grouped[stage.id] = [];
	});
	
	// Sort deals into stages
	props.deals.forEach(deal => {
		const stageId = typeof deal.deal_stage === 'string' 
			? deal.deal_stage 
			: deal.deal_stage?.id;
			
		if (stageId && grouped[stageId]) {
			grouped[stageId].push(deal);
		}
	});
	
	localDealsByStage.value = grouped;
});

const getStageColor = (color: string | undefined | null) => {
	return color || '#94a3b8'; // Default slate-400
};

const formatCurrency = (amount: number | null) => {
	if (!amount) return '$0';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(amount);
};

const handleDragChange = async (event: any, newStageId: string) => {
	// We only care about the 'added' event, which happens when an item is dropped into a new list
	if (event.added) {
		const deal = event.added.element;
		isLoading.value = true;
		
		try {
			await useDirectus(updateItem('os_deals', deal.id, {
				deal_stage: newStageId
			}));
			// Success - emit refresh to ensure data consistency
			emit('refresh');
		} catch (error) {
			console.error('Failed to update deal stage', error);
			// Optionally revert the move here if needed, but for now we'll rely on refresh
			useToast().add({
				title: 'Error',
				description: 'Failed to update deal stage.',
				color: 'red'
			});
			emit('refresh'); // Refresh to revert state
		} finally {
			isLoading.value = false;
		}
	}
};
</script>

<template>
	<div class="flex h-full gap-6 overflow-x-auto pb-6">
		<div 
			v-for="stage in stages" 
			:key="stage.id"
			class="flex-shrink-0 w-80 flex flex-col gap-4"
		>
			<!-- Stage Header -->
			<div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
				<div class="flex items-center gap-2">
					<div 
						class="w-3 h-3 rounded-full"
						:style="{ backgroundColor: getStageColor(stage.color) }"
					/>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100">
						{{ stage.name }}
					</h3>
					<span class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
						{{ localDealsByStage[stage.id]?.length || 0 }}
					</span>
				</div>
			</div>

			<!-- Kanban Column -->
			<div class="flex flex-col flex-1 min-h-[200px]">
				<draggable
					v-model="localDealsByStage[stage.id]"
					group="deals"
					item-key="id"
					class="flex flex-col gap-3 min-h-[100px]"
					ghost-class="opacity-50"
					drag-class="cursor-grabbing"
					@change="(e) => handleDragChange(e, stage.id)"
				>
					<template #item="{ element: deal }">
						<div 
							class="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
							@click="$router.push(`/portal/sales/deals/${deal.id}`)"
						>
							<div class="flex justify-between items-start mb-2">
								<span class="text-xs font-medium text-gray-500 uppercase">
									{{ deal.organization?.name || 'No Org' }}
								</span>
								<!-- Owner Avatar (if exists) -->
								<UAvatar 
									v-if="deal.owner"
									:src="safeRelationId(deal.owner?.avatar) ? fileUrl(safeRelationId(deal.owner?.avatar)) : undefined"
									:alt="deal.owner?.first_name || ''"
									size="xs"
								/>
							</div>
							
							<h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-500">
								{{ deal.name }}
							</h4>
							
							<div class="flex justify-between items-center text-sm">
								<span class="font-semibold text-gray-900 dark:text-gray-100">
									{{ formatCurrency(deal.deal_value) }}
								</span>
								<span 
									v-if="deal.close_date"
									class="text-xs text-gray-500"
								>
									{{ new Date(deal.close_date).toLocaleDateString() }}
								</span>
							</div>
						</div>
					</template>
				</draggable>

				<!-- Empty State Helper -->
				<div 
					v-if="!localDealsByStage[stage.id]?.length"
					class="h-full border-2 border-dashed border-gray-100 dark:border-gray-800/50 rounded-lg flex items-center justify-center text-gray-400 text-sm m-1"
				>
					<span class="opacity-50">Drop here</span>
				</div>
			</div>
		</div>
	</div>
</template>
