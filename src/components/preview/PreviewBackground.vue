<template>
  <div class="absolute inset-0" :style="bgStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBackgroundStore } from '@/stores/background'

const store = useBackgroundStore()
const { config: bgConfig } = storeToRefs(store)

const gradientDirectionMap: Record<string, string> = {
  'to-right': 'to right',
  'to-bottom': 'to bottom',
  'to-bottom-right': 'to bottom right',
  'to-bottom-left': 'to bottom left',
  'to-top': 'to top',
  'to-left': 'to left',
}

const bgStyle = computed(() => {
  const c = bgConfig.value
  const opacity = c.opacity / 100
  const style: Record<string, string> = {
    opacity: String(opacity),
  }

  if (c.type === 'solid') {
    style.background = c.solidColor
  } else if (c.type === 'gradient') {
    const dir = gradientDirectionMap[c.gradient.direction] || 'to bottom'
    style.background = `linear-gradient(${dir}, ${c.gradient.start}, ${c.gradient.end})`
  } else if (c.type === 'image' && c.imageUrl) {
    style.backgroundImage = `url(${c.imageUrl})`
    style.backgroundSize = c.imageFit
    style.backgroundPosition = 'center'
    style.backgroundRepeat = 'no-repeat'
  }

  return style
})
</script>
