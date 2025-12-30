<script setup lang="ts">
const props = defineProps<{
  email?: string
}>()

const emit = defineEmits<{
  (e: 'success', data: any): void
  (e: 'error', error: any): void
}>()

const loading = ref(false)

async function enrich() {
  if (!props.email) return

  loading.value = true
  try {
    const data = await $fetch('/api/enrich/contact', {
      method: 'POST',
      body: { email: props.email }
    })
    emit('success', data)
  } catch (err) {
    emit('error', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UButton
    icon="i-heroicons-sparkles"
    color="amber"
    variant="soft"
    size="xs"
    :loading="loading"
    :disabled="!email"
    @click="enrich"
  >
    Auto-fill
  </UButton>
</template>
