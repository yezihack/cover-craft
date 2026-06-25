<template>
  <div class="flex flex-col gap-1">
    <label class="text-xs text-slate-400">{{ label }}</label>
    <div class="flex items-center gap-2">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        class="flex-1"
        @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      />
      <span class="text-xs text-slate-300 w-10 text-right">{{ modelValue }}{{ suffix }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: number
  min: number
  max: number
  step?: number
  suffix?: string
}>()
defineEmits<{ 'update:modelValue': [value: number] }>()
</script>
