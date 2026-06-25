<template>
  <div class="flex flex-col gap-1">
    <label class="text-xs text-slate-400">{{ label }}</label>
    <div class="flex items-center gap-1">
      <button
        class="w-7 h-7 flex items-center justify-center bg-slate-700 rounded text-slate-300 hover:bg-slate-600 text-sm"
        @click="decrement"
      >−</button>
      <input
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        class="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 text-center"
        @input="onInput"
      />
      <button
        class="w-7 h-7 flex items-center justify-center bg-slate-700 rounded text-slate-300 hover:bg-slate-600 text-sm"
        @click="increment"
      >+</button>
      <span v-if="suffix" class="text-xs text-slate-500 ml-1">{{ suffix }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: number
  min?: number
  max?: number
  step?: number
  suffix?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const step = props.step ?? 1

function decrement() {
  const val = props.modelValue - step
  if (props.min !== undefined && val < props.min) return
  emit('update:modelValue', val)
}

function increment() {
  const val = props.modelValue + step
  if (props.max !== undefined && val > props.max) return
  emit('update:modelValue', val)
}

function onInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  if (!isNaN(val)) {
    let clamped = val
    if (props.min !== undefined && clamped < props.min) clamped = props.min
    if (props.max !== undefined && clamped > props.max) clamped = props.max
    emit('update:modelValue', clamped)
  }
}
</script>
