<template>
	<div class="py-6">
		<header class="mb-6">
			<h2 class="text-lg font-medium text-gray-900 dark:text-white">Command Center</h2>
			<p class="mt-1 text-sm text-gray-500">
				Manage developer resources, deployments, and external links for this project.
			</p>
		</header>

		<div v-if="pending" class="flex justify-center py-12">
			<UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
		</div>

		<ProjectResources v-else-if="project" :project="project" @update="updateResources" />
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const { updateItem } = useDirectusItems();
const toast = useToast();

const projectId = route.params.id as string;

// Fetch project data - ensuring we get the resources field
// In a real app, this might share state with the parent layout to avoid re-fetching
const {
	data: project,
	pending,
	refresh,
} = await useAsyncData(`project-resources-${projectId}`, () => {
	return useDirectus(readItem('os_projects', projectId));
});

const updateResources = async (newResources: any) => {
	try {
		await updateItem('os_projects', projectId, {
			resources: newResources,
		});
		await refresh();
		toast.add({ title: 'Resources updated', color: 'green' });
	} catch (e) {
		toast.add({ title: 'Failed to update resources', color: 'red' });
	}
};
</script>
