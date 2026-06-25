<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wide">水印设置</h3>

    <div class="flex flex-col gap-1">
      <label class="text-xs text-slate-400">水印文本</label>
      <input
        :value="store.config.text"
        class="bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200"
        @input="store.update('text', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <SelectInput
      :model-value="store.config.font"
      label="字体"
      :options="fontOptions"
      @update:model-value="(v: string) => store.update('font', v)"
    />

    <div class="flex gap-4">
      <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
        <input
          type="checkbox"
          :checked="store.config.bold"
          class="accent-green-600"
          @change="store.update('bold', ($event.target as HTMLInputElement).checked)"
        />
        加粗
      </label>
      <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
        <input
          type="checkbox"
          :checked="store.config.italic"
          class="accent-green-600"
          @change="store.update('italic', ($event.target as HTMLInputElement).checked)"
        />
        斜体
      </label>
      <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
        <input
          type="checkbox"
          :checked="store.config.uppercase"
          class="accent-green-600"
          @change="store.update('uppercase', ($event.target as HTMLInputElement).checked)"
        />
        大写
      </label>
    </div>

    <SliderInput
      :model-value="store.config.fontSize"
      label="字体大小"
      :min="8"
      :max="100"
      suffix="px"
      @update:model-value="(v: number) => store.update('fontSize', v)"
    />

    <SliderInput
      :model-value="store.config.opacity"
      label="透明度"
      :min="0"
      :max="100"
      suffix="%"
      @update:model-value="(v: number) => store.update('opacity', v)"
    />

    <ColorPicker
      :model-value="store.config.color"
      label="颜色"
      @update:model-value="(v: string) => store.update('color', v)"
    />

    <SliderInput
      :model-value="store.config.x"
      label="水平位置"
      :min="0"
      :max="100"
      suffix="%"
      @update:model-value="(v: number) => store.update('x', v)"
    />

    <SliderInput
      :model-value="store.config.y"
      label="垂直位置"
      :min="0"
      :max="100"
      suffix="%"
      @update:model-value="(v: number) => store.update('y', v)"
    />
  </div>
</template>

<script setup lang="ts">
import { useWatermarkStore } from '@/stores/watermark'
import { FONT_LIST } from '@/constants/fonts'
import ColorPicker from '@/components/ui/ColorPicker.vue'
import SliderInput from '@/components/ui/SliderInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'

const store = useWatermarkStore()
const fontOptions = FONT_LIST.map(f => ({ value: f, label: f }))
</script>
