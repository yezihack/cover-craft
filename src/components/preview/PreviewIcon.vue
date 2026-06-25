<template>
  <div
    class="absolute"
    :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing': isDragging }"
    :style="iconStyle"
    @mousedown="onMouseDown"
  >
    <Icon v-if="store.config.type === 'iconify' && store.config.code" :icon="store.config.code" />
    <img
      v-else-if="store.config.type === 'custom' && store.config.customUrl"
      :src="store.config.customUrl"
      class="w-full h-full object-contain"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { useIconStore } from '@/stores/icon'
import { useExportConfigStore } from '@/stores/exportConfig'
import { useDragPosition } from '@/composables/useDragPosition'

const store = useIconStore()
const { config } = storeToRefs(store)
const exportStore = useExportConfigStore()

const { isDragging, onMouseDown } = useDragPosition({
  canvasWidth: exportStore.config.width,
  canvasHeight: exportStore.config.height,
  getX: () => config.value.x,
  getY: () => config.value.y,
  onMove: (x, y) => {
    store.setX(x)
    store.setY(y)
  },
})

const iconStyle = computed(() => {
  const c = config.value
  return {
    left: `${c.x}%`,
    top: `${c.y}%`,
    transform: 'translate(-50%, -50%)',
    width: `${c.size}px`,
    height: `${c.size}px`,
    fontSize: `${c.size}px`,
    filter: c.shadowSize > 0
      ? `drop-shadow(${c.shadowSize}px ${c.shadowSize}px 0 ${c.shadowColor})`
      : 'none',
  }
})
</script>
