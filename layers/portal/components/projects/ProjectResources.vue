<template>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<!-- Integration Cards -->
		<UCard v-for="(resource, type) in resources" :key="type">
			<template #header>
				<div class="flex items-center gap-3">
					<UIcon :name="getIcon(type)" class="w-8 h-8" :class="getColor(type)" />
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-white capitalize">{{ type }}</h3>
						<p class="text-xs text-gray-500">{{ getLabel(type) }}</p>
					</div>
				</div>
			</template>

			<div v-if="resource" class="space-y-3">
				<div v-if="resource.repoName || resource.projectUrl || resource.url" class="text-sm font-medium truncate">
					{{ resource.repoName || resource.projectUrl || resource.url }}
				</div>
				<div class="flex gap-2">
					<UButton
						:to="resource.repoUrl || resource.projectUrl || resource.url || resource.fileUrl"
						target="_blank"
						size="xs"
						color="gray"
						icon="i-heroicons-arrow-top-right-on-square"
					>
						Open
					</UButton>
					<UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil" @click="openEditModal(type)" />
				</div>
			</div>

			<div v-else class="flex flex-col items-center justify-center py-4 gap-2">
				<UButton color="gray" variant="dashed" icon="i-heroicons-plus" @click="openEditModal(type)">
					Connect {{ type }}
				</UButton>
			</div>
		</UCard>

		<!-- Edit Modal -->
		<UModal v-model="modalOpen">
			<UCard>
				<template #header>
					<h3 class="font-semibold capitalize">Connect {{ activeType }}</h3>
				</template>
				<div class="p-4 space-y-4">
					<UFormGroup label="URL / Link" name="url">
						<UInput v-model="editForm.url" placeholder="https://..." />
					</UFormGroup>
					<UFormGroup v-if="activeType === 'github'" label="Repository Name" name="name">
						<UInput v-model="editForm.name" placeholder="org/repo" />
					</UFormGroup>
				</div>
				<template #footer>
					<div class="flex justify-end gap-2">
						<UButton color="gray" variant="ghost" @click="modalOpen = false">Cancel</UButton>
						<UButton color="black" @click="saveResource">Save</UButton>
					</div>
				</template>
			</UCard>
		</UModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OsProject } from '../../../../base/types';

const props = defineProps<{
	project: OsProject;
}>();

const emit = defineEmits<{
	(e: 'update', resources: any): void;
}>();

const modalOpen = ref(false);
const activeType = ref('');
const editForm = ref({ url: '', name: '' });

// Ensure resources object exists locally even if empty on project
const resources = computed(() => {
	const current = props.project.resources || {};
	return {
		github: current.github || null,
		vercel: current.vercel || null,
		supabase: current.supabase || null,
		figma: current.figma || null,
		docs: current.docs || null
	};
});

const getIcon = (type: string | number) => {
	switch (type) {
		case 'github': return 'i-logos-github-icon';
		case 'vercel': return 'i-logos-vercel-icon';
		case 'supabase': return 'i-logos-supabase-icon';
		case 'figma': return 'i-logos-figma';
		case 'docs': return 'i-heroicons-document-text';
		default: return 'i-heroicons-link';
	}
};

const getColor = (type: string | number) => {
	// Utility for icon coloring if needed, but logos usually colored via component
	return ''; 
};

const getLabel = (type: string | number) => {
	switch (type) {
		case 'github': return 'Source Code';
		case 'vercel': return 'Deployment';
		case 'supabase': return 'Database';
		case 'figma': return 'Design Files';
		case 'docs': return 'Documentation';
		default: return 'Resource';
	}
};

const openEditModal = (type: string | number) => {
	activeType.value = String(type);
	const res = props.project.resources?.[type];
	editForm.value = {
		url: res?.repoUrl || res?.projectUrl || res?.url || res?.fileUrl || '',
		name: res?.repoName || ''
	};
	modalOpen.value = true;
};

const saveResource = () => {
	if (!activeType.value) return;

	const type = activeType.value;
	let newRes: any = {};

	if (type === 'github') {
		newRes = { repoUrl: editForm.value.url, repoName: editForm.value.name };
	} else if (type === 'vercel' || type === 'supabase') {
		newRes = { projectUrl: editForm.value.url };
	} else if (type === 'figma') {
		newRes = { fileUrl: editForm.value.url };
	} else {
		newRes = { url: editForm.value.url };
	}

	const updatedResources = {
		...(props.project.resources || {}),
		[type]: newRes
	};

	emit('update', updatedResources);
	modalOpen.value = false;
};
</script>
