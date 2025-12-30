<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import type { OsDeal, OsDealStage, Organization, Contact } from '../../../../base/types';

const props = defineProps<{
	stages: OsDealStage[];
}>();

const emit = defineEmits(['close', 'refresh']);

const { $directus } = useNuxtApp();
const isOpen = ref(true);
const isLoading = ref(false);

const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	deal_value: z.number().optional(),
	close_date: z.string().optional(),
	deal_stage: z.string().min(1, 'Stage is required'),
	organization: z.string().optional(),
	contact: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
	name: undefined,
	deal_value: undefined,
	close_date: undefined,
	deal_stage: props.stages[0]?.id,
	organization: undefined,
	contact: undefined,
});

// Fetch options for SelectMenus
const { data: organizations } = await useAsyncData('organizations-list', () => {
	return useDirectus(
		readItems('organizations', {
			fields: ['id', 'name'],
			sort: ['name'],
			limit: 100, // Simple limit for now
		})
	);
});

const { data: contacts } = await useAsyncData('contacts-list', () => {
	return useDirectus(
		readItems('contacts', {
			fields: ['id', 'first_name', 'last_name'],
			sort: ['first_name'],
			limit: 100,
		})
	);
});

const contactOptions = computed(() => {
	return contacts.value?.map((c: Contact) => ({
		id: c.id,
		label: `${c.first_name} ${c.last_name}`,
	})) || [];
});

const organizationOptions = computed(() => {
	return organizations.value?.map((o: Organization) => ({
		id: o.id,
		label: o.name,
	})) || [];
});

const stageOptions = computed(() => {
	return props.stages.map((s) => ({
		id: s.id,
		label: s.name,
	}));
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	isLoading.value = true;
	try {
        // @ts-ignore
		await createItem($directus, 'os_deals', {
			...event.data,
            // Ensure numbers are numbers
            deal_value: event.data.deal_value ? Number(event.data.deal_value) : null,
		});

		useToast().add({ title: 'Success', description: 'Deal created successfully', color: 'green' });
		emit('refresh');
		isOpen.value = false;
        emit('close');
	} catch (error) {
		console.error(error);
		useToast().add({ title: 'Error', description: 'Failed to create deal', color: 'red' });
	} finally {
		isLoading.value = false;
	}
};

const handleClose = () => {
    isOpen.value = false;
    emit('close');
}

const handleEnrichment = (data: any) => {
    if (data.first_name && data.last_name) {
        // Find contact if exists or propose creating one (complex, for now just fill what we can)
        console.log('Enrichment Data:', data);
        useToast().add({ title: 'Enriched', description: `Found ${data.first_name} ${data.last_name}`, color: 'green' });
    }
}
</script>

<template>
	<UModal v-model="isOpen" @close="handleClose">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
						Create New Deal
					</h3>
					<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" />
				</div>
			</template>

			<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormGroup label="Deal Name" name="name" required>
					<UInput v-model="state.name" placeholder="e.g. Website Redesign" autofocus />
				</UFormGroup>

				<div class="grid grid-cols-2 gap-4">
					<UFormGroup label="Value" name="deal_value">
						<UInput v-model="state.deal_value" type="number" placeholder="0.00">
							<template #leading>
								<span class="text-gray-500 dark:text-gray-400 text-xs">$</span>
							</template>
						</UInput>
					</UFormGroup>

					<UFormGroup label="Close Date" name="close_date">
						<UInput v-model="state.close_date" type="date" />
					</UFormGroup>
				</div>

				<UFormGroup label="Deal Stage" name="deal_stage">
					<USelectMenu
						v-model="state.deal_stage"
						:options="stageOptions"
						value-attribute="id"
						option-attribute="label"
					/>
				</UFormGroup>

				<UFormGroup label="Organization" name="organization">
					<USelectMenu
						v-model="state.organization"
						:options="organizationOptions"
						value-attribute="id"
						option-attribute="label"
						searchable
                        placeholder="Select Organization"
					/>
				</UFormGroup>

				<UFormGroup label="Contact" name="contact">
					<div class="flex gap-2">
						<USelectMenu
							v-model="state.contact"
							:options="contactOptions"
							value-attribute="id"
							option-attribute="label"
							searchable
							placeholder="Select Contact"
							class="flex-1"
						/>
						<EnrichmentButton 
							v-if="state.contact === undefined"
							:email="null /* In a real app we would capture email here */" 
							@success="handleEnrichment"
						/>
					</div>
				</UFormGroup>

				<div class="flex justify-end gap-3 pt-4">
					<UButton label="Cancel" color="gray" variant="ghost" @click="handleClose" />
					<UButton type="submit" label="Create Deal" color="primary" :loading="isLoading" />
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>
