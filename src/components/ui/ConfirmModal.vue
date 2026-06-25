<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      @click.self="onCancel"
    >
      <div class="bg-slate-800 rounded-xl p-6 w-96 shadow-2xl border border-slate-700">
        <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
        <p class="text-sm text-slate-400 mb-4">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
            @click="onCancel"
          >
            取消
          </button>
          <button
            class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500"
            @click="onConfirm"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  message: string
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()

function onConfirm() { emit('confirm') }
function onCancel() { emit('cancel') }
</script>
