<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wide">背景设置</h3>

    <!-- Type selector -->
    <div class="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
      <button
        v-for="t in bgTypes"
        :key="t.key"
        class="flex-1 px-2 py-1 text-xs rounded-md transition-colors"
        :class="store.config.type === t.key
          ? 'bg-green-600 text-white'
          : 'text-slate-400 hover:text-slate-200'"
        @click="store.setType(t.key)"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Solid -->
    <template v-if="store.config.type === 'solid'">
      <ColorPicker v-model="solidColor" label="纯色" />
    </template>

    <!-- Gradient -->
    <template v-if="store.config.type === 'gradient'">
      <ColorPicker :model-value="store.config.gradient.start" label="起始颜色" @update:model-value="store.setGradientStart" />
      <ColorPicker :model-value="store.config.gradient.end" label="结束颜色" @update:model-value="store.setGradientEnd" />
      <SelectInput
        v-model="gradientDirection"
        label="渐变方向"
        :options="directionOptions"
      />
    </template>

    <!-- Image -->
    <template v-if="store.config.type === 'image'">
      <div class="flex flex-col gap-1">
        <label class="text-xs text-slate-400">上传图片</label>
        <input
          type="file"
          accept="image/*"
          class="text-xs text-slate-400"
          @change="onImageUpload"
        />
      </div>
      <SelectInput
        v-model="imageFit"
        label="填充方式"
        :options="fitOptions"
      />
    </template>

    <SliderInput
      v-model="opacity"
      label="背景透明度"
      :min="0"
      :max="100"
      suffix="%"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBackgroundStore } from '@/stores/background'
import type { BgType, GradientDirection } from '@/types/canvas'
import ColorPicker from '@/components/ui/ColorPicker.vue'
import SliderInput from '@/components/ui/SliderInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'

const store = useBackgroundStore()

const bgTypes: { key: BgType; label: string }[] = [
  { key: 'solid', label: '纯色' },
  { key: 'gradient', label: '渐变' },
  { key: 'image', label: '图片' },
]

const directionOptions = [
  { value: 'to-bottom', label: '↓ 向下' },
  { value: 'to-right', label: '→ 向右' },
  { value: 'to-bottom-right', label: '↘ 右下' },
  { value: 'to-bottom-left', label: '↙ 左下' },
  { value: 'to-top', label: '↑ 向上' },
  { value: 'to-left', label: '← 向左' },
]

const fitOptions = [
  { value: 'cover', label: 'Cover 覆盖' },
  { value: 'contain', label: 'Contain 包含' },
  { value: 'fill', label: 'Fill 填充' },
]

const solidColor = computed({
  get: () => store.config.solidColor,
  set: (v: string) => store.setSolidColor(v),
})

const gradientDirection = computed({
  get: () => store.config.gradient.direction,
  set: (v: string) => store.setGradientDirection(v as GradientDirection),
})

const imageFit = computed({
  get: () => store.config.imageFit,
  set: (v: string) => store.setImageFit(v as 'cover' | 'contain' | 'fill'),
})

const opacity = computed({
  get: () => store.config.opacity,
  set: (v: number) => store.setOpacity(v),
})

function onImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  store.setImageUrl(url)
}
</script>
