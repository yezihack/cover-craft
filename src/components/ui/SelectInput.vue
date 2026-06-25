<template>
  <div class="flex flex-col gap-1">
    <label class="text-xs text-slate-400">{{ label }}</label>
    <select
      :value="modelValue"
      class="bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
  options: { value: string; label: string }[]
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
