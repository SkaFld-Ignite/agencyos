<script setup lang="ts">
import type { OsDeal } from '~/types';

definePageMeta({
	layout: 'portal',
	middleware: ['auth'],
});

const route = useRoute();
const dealId = route.params.id as string;

const { data: deal, status, refresh } = await useAsyncData(`deal-${dealId}`, () => {
	return useDirectus(
		readItem('os_deals', dealId, {
			fields: [
				'*',
				{
					owner: ['first_name', 'last_name', 'avatar'],
					organization: ['id', 'name'],
                    contact: ['id', 'first_name', 'last_name'], // Assuming single contact linkage or similar
                    contacts: ['contacts_id.first_name', 'contacts_id.last_name'], // If M2M
					deal_stage: ['id', 'name', 'color'],
                    // Add other relations as needed
				},
			],
		})
	);
});

const { fileUrl } = useFiles();

const formatCurrency = (amount: number | null) => {
	if (!amount) return '$0';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(amount);
};
</script>

<template>
	<PageContainer>
        <!-- Header -->
		<div class="mb-8">
            <UButton 
                to="/portal/sales" 
                variant="ghost" 
                color="gray" 
                icon="i-heroicons-arrow-left" 
                class="mb-4 pl-0"
            >
                Back to Pipeline
            </UButton>

            <div v-if="status === 'pending'" class="animate-pulse h-10 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div v-else-if="deal" class="flex items-start justify-between">
                <div>
                     <div class="flex items-center gap-3 mb-2">
                        <component 
                            :is="deal.deal_stage ? 'UBadge' : 'span'"
                            v-if="deal.deal_stage"
                            :style="{ backgroundColor: typeof deal.deal_stage !== 'string' ? deal.deal_stage.color : undefined }"
                            class="text-white"
                        >
                            {{ typeof deal.deal_stage !== 'string' ? deal.deal_stage.name : deal.deal_stage }}
                        </component>
                        <span class="text-sm text-gray-500">
                            Create {{ new Date(deal.date_created).toLocaleDateString() }}
                        </span>
                    </div>
                    <TypographyTitle>{{ deal.name }}</TypographyTitle>
                </div>
                
                <div class="flex gap-2">
                     <UButton icon="i-heroicons-pencil-square" color="gray" variant="ghost">Edit</UButton>
                     <UButton icon="i-heroicons-trash" color="red" variant="ghost">Delete</UButton>
                </div>
            </div>
		</div>

        <!-- Content -->
        <div v-if="deal" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Column -->
            <div class="lg:col-span-2 space-y-8">
                <UCard>
                    <template #header>
                        <h3 class="text-base font-semibold leading-6">About this deal</h3>
                    </template>
                    <div class="prose dark:prose-invert max-w-none">
                         <div v-if="deal.deal_notes" v-html="deal.deal_notes"></div>
                         <p v-else class="text-gray-500 italic">No notes added.</p>
                    </div>
                </UCard>

                <!-- Placeholder for Activities/Timeline -->
                <UCard>
                     <template #header>
                        <h3 class="text-base font-semibold leading-6">Timeline</h3>
                    </template>
                    <div class="text-center py-8 text-gray-500">
                        Activity timeline coming soon.
                    </div>
                </UCard>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Value Widget -->
                 <UCard>
                    <div class="text-sm text-gray-500 mb-1">Deal Value</div>
                    <div class="text-3xl font-bold text-gray-900 dark:text-white">
                        {{ formatCurrency(deal.deal_value) }}
                    </div>
                    <div v-if="deal.close_date" class="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <UIcon name="i-heroicons-calendar" />
                        <span>Closing {{ new Date(deal.close_date).toLocaleDateString() }}</span>
                    </div>
                </UCard>

                <!-- Organization Widget -->
                <UCard v-if="deal.organization">
                     <template #header>
                        <h3 class="text-sm font-semibold leading-6 text-gray-500 uppercase">Organization</h3>
                    </template>
                    <div class="flex items-center gap-3">
                        <UAvatar 
                            :alt="typeof deal.organization !== 'string' ? deal.organization.name : ''" 
                            size="md"
                        />
                         <div v-if="typeof deal.organization !== 'string'">
                            <div class="font-medium">{{ deal.organization.name }}</div>
                            <!-- <div class="text-sm text-gray-500">Global Tech Solutions</div> -->
                        </div>
                    </div>
                </UCard>

                <!-- Owner Widget -->
                <UCard v-if="deal.owner">
                     <template #header>
                        <h3 class="text-sm font-semibold leading-6 text-gray-500 uppercase">Owner</h3>
                    </template>
                     <div class="flex items-center gap-3">
                        <UserBadge :user="deal.owner" />
                    </div>
                </UCard>
            </div>
        </div>
	</PageContainer>
</template>
