<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div v-if="pending" class="flex justify-center items-center h-64">
			<UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
		</div>
		<div v-else-if="error || !contact" class="flex justify-center items-center h-64 flex-col gap-4">
			<UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500" />
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Contact not found</h2>
			<UButton to="/portal/sales" color="gray" variant="ghost" icon="i-heroicons-arrow-left">
				Back to Sales
			</UButton>
		</div>
		<div v-else class="space-y-6">
			<!-- Breadcrumbs -->
			<div class="flex items-center text-sm text-gray-500">
				<UButton to="/portal/sales" variant="link" color="gray" :padded="false">Sales</UButton>
				<UIcon name="i-heroicons-chevron-right" class="w-4 h-4 mx-2" />
				<span class="text-gray-900 dark:text-white">{{ contact.first_name }} {{ contact.last_name }}</span>
			</div>

			<!-- Header -->
			<ContactHeader
				:contact="contact"
				@edit="openEditModal"
				@delete="deleteContact"
				@enriched="handleEnrichment"
			/>

			<!-- Main Content Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left/Center: Activity Feed -->
				<div class="lg:col-span-2 space-y-6">
					<ActivityTimeline :activities="extendedActivities" @log="createActivity" />
				</div>

				<!-- Right: Sidebar -->
				<div class="lg:col-span-1">
					<ContactSidebar :contact="extendedContact" />
				</div>
			</div>
		</div>

		<!-- Edit Modal (Placeholder for now) -->
		<UModal v-model="editModalOpen">
			<UCard>
				<template #header>
					<h3 class="font-semibold">Edit Contact</h3>
				</template>
				<div class="p-4">
					<p>Edit form coming soon...</p>
				</div>
			</UCard>
		</UModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { readItem, createItem, updateItem, deleteItem } from '@directus/sdk';
import type { Contact, OsActivity } from '../../../../base/types';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const contactId = route.params.id as string;
const editModalOpen = ref(false);

const { data: contact, pending, error, refresh } = await useAsyncData<Contact>(`contact-${contactId}`, async () => {
	return await useDirectus(
		readItem('os_contacts', contactId, {
			fields: ['*', 'organization.*'],
		})
	);
});

// Fetch activities separately or add to fields above if relational
// For now, let's try to keep the mock activities merged until backend activities sort is confirmed
// or fetch them if they exist.
// Let's assume we want to eventually replace this with real data.

const mockActivities = ref<OsActivity[]>([
	{
		id: '1',
		activity_type: 'email',
		activity_notes: 'Sent introduction email regarding our services.',
		date_created: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
		user_created: { first_name: 'Charles' } as any,
	},
	{
		id: '2',
		activity_type: 'call',
		activity_notes: 'Called to follow up on the proposal. Left voicemail.',
		date_created: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
		user_created: { first_name: 'Charles' } as any,
	},
]);

const extendedContact = computed(() => {
	if (!contact.value) return null;
	return {
		...contact.value,
		deals: [], // Placeholder until deals relationship is confirmed
	};
});

const extendedActivities = computed(() => {
	return [...mockActivities.value]; 
});

const openEditModal = () => {
	editModalOpen.value = true;
};

const deleteContact = async () => {
	if (!confirm('Are you sure you want to delete this contact?')) return;
	await useDirectus(deleteItem('os_contacts', contactId));
	toast.add({ title: 'Contact deleted', color: 'green' });
	router.push('/portal/sales');
};

const handleEnrichment = async (enrichedData: any) => {
	if (contact.value) {
		Object.assign(contact.value, enrichedData);
	}
	toast.add({ title: 'Contact enriched successfully', color: 'green' });
	await useDirectus(updateItem('os_contacts', contactId, enrichedData));
};

const createActivity = async (payload: { type: string; notes: string }) => {
	await useDirectus(createItem('os_activities', { ...payload, contact: contactId }));
	mockActivities.value.unshift({
		id: Math.random().toString(),
		activity_type: payload.type,
		activity_notes: payload.notes,
		date_created: new Date().toISOString(),
		user_created: { first_name: 'You' } as any,
	});
	toast.add({ title: 'Activity logged', color: 'green' });
};
</script>
