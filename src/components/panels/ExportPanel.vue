<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wide">导出设置</h3>

    <!-- Preset -->
    <SelectInput
      v-model="currentPreset"
      label="导出平台预设"
      :options="presetOptions"
    />

    <!-- Aspect ratio toggle -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-slate-400">📐 比例</label>
      <ToggleGroup
        :options="ratioOptions"
        @select="(key: string) => setRatio(key as AspectRatioKey)"
      />
      <p class="text-xs text-slate-500 mt-1">选择比例后，修改任意一边时另一边自动联动</p>
    </div>

    <!-- Dimensions -->
    <div class="flex gap-2">
      <NumberInput
        label="↔ 宽度"
        :model-value="store.config.width"
        :min="1"
        :max="8000"
        suffix="px"
        @update:model-value="store.setWidth"
      />
      <NumberInput
        label="↕ 高度"
        :model-value="store.config.height"
        :min="1"
        :max="8000"
        suffix="px"
        @update:model-value="store.setHeight"
      />
    </div>

    <!-- Format -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-slate-400">导出格式</label>
      <div class="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
        <button
          v-for="fmt in formatOptions"
          :key="fmt.value"
          class="flex-1 px-3 py-1.5 text-xs rounded-md transition-colors"
          :class="store.config.format === fmt.value
            ? 'bg-green-600 text-white'
            : 'text-slate-400 hover:text-slate-200'"
          @click="store.config.format = fmt.value as ExportFormat"
        >
          {{ fmt.label }}
        </button>
      </div>
    </div>

    <!-- Quality -->
    <SliderInput
      v-model="currentQuality"
      label="图片质量"
      :min="0"
      :max="100"
      suffix="%"
    />

    <!-- Filename -->
    <div class="flex flex-col gap-2">
      <label class="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
        <input
          type="checkbox"
          :checked="store.config.useRandomFilename"
          class="accent-green-600"
          @change="store.config.useRandomFilename = ($event.target as HTMLInputElement).checked"
        />
        使用随机文件名
      </label>

      <template v-if="!store.config.useRandomFilename">
        <div class="flex items-center gap-2">
          <input
            :value="store.config.filename"
            class="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200"
            placeholder="输入文件名"
            @input="store.config.filename = ($event.target as HTMLInputElement).value"
          />
          <span class="text-xs text-slate-500">.{{ store.config.format }}</span>
        </div>
      </template>

      <template v-else>
        <div class="bg-slate-800/50 rounded-lg p-3 flex flex-col gap-2">
          <SliderInput
            :model-value="store.config.randomFilenameLength"
            label="随机长度"
            :min="4"
            :max="64"
            @update:model-value="store.config.randomFilenameLength = $event"
          />
          <div class="flex gap-4">
            <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                :checked="store.config.randomUseDigit"
                class="accent-green-600"
                @change="store.config.randomUseDigit = ($event.target as HTMLInputElement).checked"
              />
              数字
            </label>
            <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                :checked="store.config.randomUseLower"
                class="accent-green-600"
                @change="store.config.randomUseLower = ($event.target as HTMLInputElement).checked"
              />
              小写
            </label>
            <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                :checked="store.config.randomUseUpper"
                class="accent-green-600"
                @change="store.config.randomUseUpper = ($event.target as HTMLInputElement).checked"
              />
              大写
            </label>
          </div>
          <div class="text-xs text-slate-500 font-mono bg-slate-900 rounded px-2 py-1 truncate">
            {{ randomPreview }}.{{ store.config.format }}
          </div>
        </div>
      </template>
    </div>

    <!-- Export button -->
    <button
      class="w-full py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      :class="isExporting
        ? 'bg-slate-700 text-slate-400 cursor-wait'
        : 'bg-green-600 text-white hover:bg-green-500'"
      :disabled="isExporting"
      @click="$emit('export')"
    >
      <span v-if="isExporting" class="animate-spin">⏳</span>
      {{ isExporting ? '导出中...' : '导出图片' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExportConfigStore } from '@/stores/exportConfig'
import { useAspectRatio } from '@/composables/useAspectRatio'
import { useRandomFilename } from '@/composables/useRandomFilename'
import { EXPORT_PRESETS } from '@/constants/presets'
import type { ExportFormat, AspectRatioKey } from '@/types/canvas'
import ToggleGroup from '@/components/ui/ToggleGroup.vue'
import SliderInput from '@/components/ui/SliderInput.vue'
import NumberInput from '@/components/ui/NumberInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'

const props = defineProps<{ isExporting: boolean }>()
defineEmits<{ export: [] }>()

const store = useExportConfigStore()
const { ratioOptions, setRatio } = useAspectRatio()
const { generate } = useRandomFilename()

const presetOptions = EXPORT_PRESETS.map(p => ({ value: p.name, label: p.name }))

const formatOptions: { value: string; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WEBP（高压缩率）' },
]

const currentPreset = computed({
  get: () => store.config.preset,
  set: (v: string) => store.applyPreset(v),
})


const currentQuality = computed({
  get: () => store.config.quality,
  set: (v: number) => { store.config.quality = v },
})

const randomPreview = computed(() =>
  generate(
    store.config.randomFilenameLength,
    store.config.randomUseDigit,
    store.config.randomUseLower,
    store.config.randomUseUpper,
  ),
)
</script>
