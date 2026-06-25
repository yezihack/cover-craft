<template>
  <div class="flex-1 flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
    <div class="w-full max-w-[900px]">
      <CanvasPreview ref="canvasRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CanvasPreview from '@/components/preview/CanvasPreview.vue'

const canvasRef = ref<InstanceType<typeof CanvasPreview>>()

function getCanvasEl(): HTMLElement | undefined {
  return canvasRef.value?.canvasEl
}

defineExpose({ getCanvasEl })
</script>
