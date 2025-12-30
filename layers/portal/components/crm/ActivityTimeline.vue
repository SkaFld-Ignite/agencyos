<template>
	<div class="space-y-6">
		<!-- New Activity Input -->
		<UCard :ui="{ body: { padding: 'p-0' } }">
			<div class="border-b border-gray-200 dark:border-gray-800 p-2 flex gap-2">
				<UButton
					v-for="type in activityTypes"
					:key="type.value"
					:icon="type.icon"
					:label="type.label"
					:color="selectedType === type.value ? 'primary' : 'gray'"
					variant="ghost"
					size="xs"
					@click="selectedType = type.value"
				/>
			</div>
			<div class="p-4">
				<UTextarea
					v-model="noteContent"
					:placeholder="`Log a ${selectedType}...`"
					autoresize
					:rows="3"
					variant="none"
					class="w-full"
				/>
				<div class="flex justify-between items-center mt-2">
					<div class="text-xs text-gray-500">
						<span v-if="selectedType === 'email'">Subject line will be generated automatically.</span>
					</div>
					<UButton label="Log Activity" color="black" :loading="logging" @click="logActivity" />
				</div>
			</div>
		</UCard>

		<!-- Timeline Filters -->
		<div class="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
			<UButton
				v-for="filter in filters"
				:key="filter.value"
				:label="filter.label"
				:color="activeFilter === filter.value ? 'primary' : 'gray'"
				variant="ghost"
				size="xs"
				@click="activeFilter = filter.value"
			/>
		</div>

		<!-- Timeline Feed -->
		<div class="space-y-4">
			<div v-if="filteredActivities.length === 0" class="text-center text-gray-500 py-8">
				No activities found. Start interacting!
			</div>
			<div v-for="activity in filteredActivities" :key="activity.id" class="flex gap-4">
				<div class="flex flex-col items-center">
					<div
						class="w-8 h-8 rounded-full flex items-center justify-center"
						:class="{
							'bg-blue-100 text-blue-600': activity.activity_type === 'email',
							'bg-yellow-100 text-yellow-600': activity.activity_type === 'note',
							'bg-green-100 text-green-600': activity.activity_type === 'call',
							'bg-purple-100 text-purple-600': activity.activity_type === 'task',
						}"
					>
						<UIcon :name="getActivityIcon(activity.activity_type)" />
					</div>
					<div class="w-px h-full bg-gray-200 dark:bg-gray-800 my-2" v-if="activities.length > 1"></div>
				</div>
				<div class="flex-1 pb-4">
					<div class="flex justify-between items-start">
						<div>
							<span class="font-medium text-gray-900 dark:text-white capitalize">
								{{ activity.activity_type }}
							</span>
							<span class="text-gray-500 text-sm ml-2">
								by {{ formatUser(activity.user_created) }}
							</span>
						</div>
						<div class="text-xs text-gray-500">
							{{ formatDate(activity.date_created) }}
						</div>
					</div>
					<div class="mt-1 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
						{{ activity.activity_notes }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OsActivity } from '../../../../base/types';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps<{
	activities: OsActivity[];
	logging?: boolean;
}>();

const emit = defineEmits<{
	(e: 'log', payload: { type: string; notes: string }): void;
}>();

const selectedType = ref('note');
const noteContent = ref('');
const activeFilter = ref('all');

const activityTypes = [
	{ value: 'note', label: 'Note', icon: 'i-heroicons-document-text' },
	{ value: 'email', label: 'Email', icon: 'i-heroicons-envelope' },
	{ value: 'call', label: 'Call', icon: 'i-heroicons-phone' },
	{ value: 'task', label: 'Task', icon: 'i-heroicons-check-circle' },
];

const filters = [
	{ value: 'all', label: 'All' },
	{ value: 'note', label: 'Notes' },
	{ value: 'email', label: 'Emails' },
	{ value: 'call', label: 'Calls' },
	{ value: 'task', label: 'Tasks' },
];

const filteredActivities = computed(() => {
	if (activeFilter.value === 'all') return props.activities;
	return props.activities.filter((a) => a.activity_type === activeFilter.value);
});

const getActivityIcon = (type: string | null | undefined) => {
	switch (type) {
		case 'email':
			return 'i-heroicons-envelope';
		case 'call':
			return 'i-heroicons-phone';
		case 'task':
			return 'i-heroicons-check-circle';
		default:
			return 'i-heroicons-document-text';
	}
};

const formatUser = (user: any) => {
	if (typeof user === 'string') return 'User';
	return user?.first_name || 'User';
};

const formatDate = (date: string | null | undefined) => {
	if (!date) return '';
	return formatDistanceToNow(new Date(date), { addSuffix: true });
};

const logActivity = () => {
	if (!noteContent.value.trim()) return;
	emit('log', {
		type: selectedType.value,
		notes: noteContent.value,
	});
	noteContent.value = '';
};
</script>
