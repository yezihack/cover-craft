<template>
  <div class="flex items-center gap-2">
    <div class="relative" ref="anchorEl">
      <div
        class="w-8 h-8 rounded border cursor-pointer hover:ring-2 hover:ring-green-500 transition-shadow"
        :style="{ background: modelValue }"
        @click="togglePanel"
      />
      <!-- 自定义颜色面板 -->
      <Teleport to="body">
        <div
          v-if="showPanel"
          class="fixed inset-0 z-[100]"
          @click.self="showPanel = false"
        >
          <div
            ref="panelEl"
            class="absolute bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-2xl w-[260px]"
            :style="panelStyle"
          >
            <!-- 右上角关闭 -->
            <button
              class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-600 text-sm leading-none"
              @click="showPanel = false"
            >✕</button>

            <div class="text-xs text-slate-400 mb-3">选择颜色</div>

            <!-- 预设色板 -->
            <div class="grid grid-cols-8 gap-1.5 mb-3">
              <button
                v-for="c in presetColors"
                :key="c"
                class="w-6 h-6 rounded cursor-pointer border border-slate-600 hover:scale-125 transition-transform"
                :style="{ background: c }"
                @click="selectPreset(c)"
              />
            </div>

            <!-- 原生取色器 + 自定义色按钮 -->
            <div class="flex items-center gap-2 mb-3">
              <div
                class="w-8 h-8 rounded border border-slate-500 cursor-pointer hover:ring-2 hover:ring-green-500 flex-shrink-0"
                :style="{ background: currentHex }"
                @click="openNativePicker"
              />
              <input
                ref="colorInput"
                type="color"
                :value="currentHex"
                class="absolute opacity-0 pointer-events-none"
                style="width:0;height:0;"
                @input="onNativeColorInput"
              />
              <input
                :value="currentHex"
                class="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs font-mono text-slate-200"
                @input="onPanelHexInput"
              />
            </div>

            <!-- Alpha -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs text-slate-500 w-8">A</span>
              <input
                type="range"
                min="0"
                max="255"
                :value="alpha"
                class="flex-1"
                @input="onPanelAlphaInput"
              />
              <span class="text-xs text-slate-400 w-8 text-right">{{ alpha }}</span>
            </div>

            <!-- 底部关闭 -->
            <button
              class="w-full py-1.5 text-xs bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              @click="showPanel = false"
            >关闭</button>
          </div>
        </div>
      </Teleport>
    </div>
    <input
      type="text"
      :value="modelValue"
      class="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs font-mono text-slate-300"
      @input="onHexInput"
    />
    <input
      type="range"
      min="0"
      max="255"
      :value="alpha"
      class="w-16"
      @input="onAlphaInput"
    />
    <span class="text-xs text-slate-400 w-8">{{ alpha }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const showPanel = ref(false)
const colorInput = ref<HTMLInputElement>()
const anchorEl = ref<HTMLElement>()
const panelEl = ref<HTMLElement>()
const panelStyle = reactive({ top: '0px', left: '0px' })

const presetColors = [
  '#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155',
  '#0f172a', '#1e293b', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#fbbf24', '#84cc16', '#34d399', '#2dd4bf', '#38bdf8', '#818cf8',
]

const alpha = computed(() => {
  if (props.modelValue.length === 9) {
    return parseInt(props.modelValue.slice(7), 16)
  }
  return 255
})

const currentHex = computed(() => props.modelValue.slice(0, 7))

function togglePanel() {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    nextTick(() => positionPanel())
  }
}

function positionPanel() {
  if (!anchorEl.value || !panelEl.value) return
  const anchor = anchorEl.value.getBoundingClientRect()
  const panelW = 260
  const panelH = panelEl.value.offsetHeight || 400
  const gap = 6

  let left = anchor.left
  let top = anchor.bottom + gap

  // 右边超出则向左靠
  if (left + panelW > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - panelW - 8)
  }
  // 底部超出则弹到上方
  if (top + panelH > window.innerHeight - 8) {
    top = anchor.top - panelH - gap
  }
  // 上方也超出则贴顶
  if (top < 8) {
    top = 8
  }

  panelStyle.top = top + 'px'
  panelStyle.left = left + 'px'
}

function selectPreset(hex: string) {
  emit('update:modelValue', hex + alpha.value.toString(16).padStart(2, '0'))
  showPanel.value = false
}

function openNativePicker() {
  colorInput.value?.click()
}

function onNativeColorInput(e: Event) {
  const hex = (e.target as HTMLInputElement).value
  emit('update:modelValue', hex + alpha.value.toString(16).padStart(2, '0'))
}

function onPanelHexInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (val.length >= 7) {
    emit('update:modelValue', val.slice(0, 9).padEnd(9, 'f'))
  }
}

function onPanelAlphaInput(e: Event) {
  const a = parseInt((e.target as HTMLInputElement).value)
  const hex = props.modelValue.slice(0, 7)
  emit('update:modelValue', hex + a.toString(16).padStart(2, '0'))
}

function onHexInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (val.length >= 7) {
    emit('update:modelValue', val.slice(0, 9).padEnd(9, 'f'))
  }
}

function onAlphaInput(e: Event) {
  const a = parseInt((e.target as HTMLInputElement).value)
  const hex = props.modelValue.slice(0, 7)
  emit('update:modelValue', hex + a.toString(16).padStart(2, '0'))
}
</script>
