<script setup lang="ts">
import type { OsDeal, OsDealStage } from '~/types';

definePageMeta({
	layout: 'portal',
	middleware: ['auth'],
});

const isModalOpen = ref(false);

const { data, status, refresh } = await useAsyncData('sales-pipeline', async () => {
	const [stages, deals] = await Promise.all([
		useDirectus(
			readItems('os_deal_stages', {
				sort: ['sort'],
			}),
		),
		useDirectus(
			readItems('os_deals', {
				fields: [
					'*',
					{
						owner: ['first_name', 'last_name', 'avatar'],
						organization: ['name'],
						deal_stage: ['id'],
					},
				],
				filter: {
					status: { _neq: 'archived' },
				},
			}),
		),
	]);

	return { 
        stages: stages as OsDealStage[], 
        deals: deals as OsDeal[] 
    };
});

const handleRefresh = () => {
    refresh();
};
</script>

<template>
	<PageContainer>
		<div class="flex items-center justify-between mb-8">
            <div>
                <TypographyTitle>Sales Pipeline</TypographyTitle>
                <TypographyHeadline content="Manage your deals and track progress throughout the sales cycle." size="sm" class="text-gray-500" />
            </div>
			<UButton label="New Deal" icon="i-heroicons-plus" color="primary" @click="isModalOpen = true" />
		</div>

		<div v-if="status === 'pending'" class="flex items-center justify-center py-12">
			<UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
		</div>

		<div v-else-if="data" class="h-[calc(100vh-250px)]">
			<PortalCrmKanbanBoard 
                :stages="data.stages || []" 
                :deals="data.deals || []" 
                @refresh="handleRefresh"
            />
		</div>

        <PortalCrmDealModal 
            v-if="isModalOpen" 
            :stages="data?.stages || []" 
            @close="isModalOpen = false" 
            @refresh="handleRefresh" 
        />
	</PageContainer>
</template>
