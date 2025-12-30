<template>
	<div class="flex items-start justify-between">
		<div class="flex items-center gap-4">
			<UAvatar :src="contact?.avatar_url" :alt="contact?.first_name" size="xl" />
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
					{{ contact?.first_name }} {{ contact?.last_name }}
				</h1>
				<p class="text-gray-500 dark:text-gray-400">
					{{ contact?.job_title }}
					<span v-if="contact?.organization" class="mx-1">•</span>
					<span v-if="contact?.organization" class="text-primary-500 font-medium cursor-pointer" @click="navigateToOrganization">
						{{ typeof contact.organization === 'object' ? contact.organization.name : 'Unknown Org' }}
					</span>
				</p>
				<div class="flex gap-2 mt-2">
					<UButton
						v-if="contact?.linkedin_url"
						icon="i-logos-linkedin-icon"
						size="xs"
						color="gray"
						variant="ghost"
						:to="contact.linkedin_url"
						target="_blank"
					/>
					<UButton
						v-if="contact?.twitter_handle"
						icon="i-logos-twitter"
						size="xs"
						color="gray"
						variant="ghost"
						:to="`https://twitter.com/${contact.twitter_handle}`"
						target="_blank"
					/>
				</div>
			</div>
		</div>
		<div class="flex gap-2">
			<EnrichmentButton v-if="contact?.email" :email="contact.email" @success="$emit('enriched', $event)" />
			<UButton icon="i-heroicons-pencil-square" color="gray" variant="ghost" @click="$emit('edit')" />
			<UButton icon="i-heroicons-trash" color="red" variant="ghost" @click="$emit('delete')" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Contact } from '../../../../base/types';

const props = defineProps<{
	contact: Contact | null;
}>();

const emit = defineEmits<{
	(e: 'edit'): void;
	(e: 'delete'): void;
	(e: 'enriched', data: any): void;
}>();

const navigateToOrganization = () => {
	if (props.contact?.organization && typeof props.contact.organization === 'object' && props.contact.organization.id) {
		navigateTo(`/portal/sales/companies/${props.contact.organization.id}`);
	}
};
</script>
