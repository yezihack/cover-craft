<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wide">图标设置</h3>

    <!-- Type -->
    <div class="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
      <button
        v-for="t in iconTypes"
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

    <!-- Iconify code -->
    <template v-if="store.config.type === 'iconify'">
      <div class="flex flex-col gap-1">
        <label class="text-xs text-slate-400">图标代码</label>
        <div class="flex gap-2">
          <input
            :value="store.config.code"
            class="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200"
            placeholder="fluent-emoji-flat:crescent-moon"
            @input="store.setCode(($event.target as HTMLInputElement).value)"
          />
          <a
            href="https://icon-sets.iconify.design/"
            target="_blank"
            class="px-2 py-1.5 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 whitespace-nowrap"
          >
            图标库 →
          </a>
        </div>
      </div>
    </template>

    <!-- Custom icon -->
    <template v-if="store.config.type === 'custom'">
      <div class="flex flex-col gap-1">
        <label class="text-xs text-slate-400">自定义图标</label>
        <input
          type="file"
          accept="image/*"
          class="text-xs text-slate-400"
          @change="onCustomIcon"
        />
      </div>
    </template>

    <SliderInput
      :model-value="store.config.size"
      label="大小"
      :min="0"
      :max="500"
      suffix="px"
      @update:model-value="store.setSize"
    />
    <SliderInput
      :model-value="store.config.shadowSize"
      label="阴影大小"
      :min="0"
      :max="200"
      suffix="px"
      @update:model-value="store.setShadowSize"
    />
    <ColorPicker
      :model-value="store.config.shadowColor"
      label="阴影颜色"
      @update:model-value="store.setShadowColor"
    />
    <SliderInput
      :model-value="store.config.x"
      label="水平位置"
      :min="0"
      :max="100"
      suffix="%"
      @update:model-value="store.setX"
    />
    <SliderInput
      :model-value="store.config.y"
      label="垂直位置"
      :min="0"
      :max="100"
      suffix="%"
      @update:model-value="store.setY"
    />
  </div>
</template>

<script setup lang="ts">
import { useIconStore } from '@/stores/icon'
import type { IconType } from '@/types/canvas'
import ColorPicker from '@/components/ui/ColorPicker.vue'
import SliderInput from '@/components/ui/SliderInput.vue'

const store = useIconStore()

const iconTypes: { key: IconType; label: string }[] = [
  { key: 'iconify', label: '图标代码' },
  { key: 'custom', label: '自定义' },
]

function onCustomIcon(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    store.setCustomUrl(reader.result as string)
  }
  reader.readAsDataURL(file)
}
</script>
