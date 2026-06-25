<template>
  <div class="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
    <button
      v-for="opt in options"
      :key="opt.key"
      class="px-3 py-1 text-xs rounded-md transition-colors"
      :class="opt.isActive.value
        ? 'bg-green-600 text-white'
        : 'text-slate-400 hover:text-slate-200'"
      @click="$emit('select', opt.key)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'

defineProps<{
  options: { key: string; label: string; isActive: ComputedRef<boolean> }[]
}>()
defineEmits<{ select: [key: string] }>()
</script>
