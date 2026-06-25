<template>
  <div class="flex flex-col h-screen">
    <AppHeader
      @theme="showThemeModal = true"
      @save="onSave"
      @reset="showResetModal = true"
    />

    <div class="flex flex-1 overflow-hidden">
      <PanelLeft
        :is-exporting="isExporting"
        @export="onExport"
      />
      <PanelRight ref="panelRightRef" />
    </div>

    <!-- Theme modal -->
    <Teleport to="body">
      <div
        v-if="showThemeModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click.self="showThemeModal = false"
      >
        <div class="bg-slate-800 rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-700">
          <h3 class="text-lg font-semibold mb-4">选择主题</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="theme in themes"
              :key="theme.id"
              class="p-4 rounded-lg border text-left transition-colors"
              :class="currentThemeId === theme.id
                ? 'border-green-500 bg-green-500/10'
                : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'"
              @click="applyTheme(theme.id)"
            >
              <div class="text-sm font-medium text-slate-200">{{ theme.name }}</div>
            </button>
          </div>
          <div class="flex justify-end mt-4">
            <button
              class="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              @click="showThemeModal = false"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Save modal -->
    <Teleport to="body">
      <div
        v-if="showSaveModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click.self="showSaveModal = false"
      >
        <div class="bg-slate-800 rounded-xl p-6 w-96 shadow-2xl border border-slate-700">
          <h3 class="text-lg font-semibold mb-4">保存配置</h3>
          <input
            v-model="saveName"
            class="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 mb-4"
            placeholder="输入配置名称"
            @keyup.enter="doSave"
          />
          <div class="flex items-center justify-between">
            <button
              class="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors underline underline-offset-2"
              @click="openSavedListFromSave"
            >
              📋 已保存的配置列表
            </button>
            <div class="flex gap-3">
              <button
                class="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
                @click="showSaveModal = false"
              >
                取消
              </button>
              <button
                class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-500"
                :disabled="!saveName.trim()"
                @click="doSave"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Saved configs list -->
    <Teleport to="body">
      <div
        v-if="showSavedList"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click.self="showSavedList = false"
      >
        <div class="bg-slate-800 rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-700">
          <h3 class="text-lg font-semibold mb-4">已保存的配置</h3>
          <div v-if="themeStore.savedConfigs.length === 0" class="text-sm text-slate-500 py-4 text-center">
            暂无保存的配置
          </div>
          <div v-else class="flex flex-col gap-2">
            <div
              v-for="cfg in themeStore.savedConfigs"
              :key="cfg.id"
              class="flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-800/50"
            >
              <div>
                <div class="text-sm text-slate-200">{{ cfg.name }}</div>
                <div class="text-xs text-slate-500">{{ new Date(cfg.createdAt).toLocaleString() }}</div>
              </div>
              <div class="flex gap-2">
                <button
                  class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-500"
                  @click="loadSaved(cfg.id)"
                >
                  加载
                </button>
                <button
                  class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500"
                  @click="themeStore.deleteConfig(cfg.id)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button
              class="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              @click="showSavedList = false"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Reset confirm -->
    <ConfirmModal
      :visible="showResetModal"
      title="重置配置"
      message="所有设置将恢复为默认值，此操作不可撤销。确认重置？"
      @confirm="onResetConfirm"
      @cancel="showResetModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import PanelLeft from '@/components/layout/PanelLeft.vue'
import PanelRight from '@/components/layout/PanelRight.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useExport } from '@/composables/useExport'
import { ensureFontsLoaded } from '@/composables/useFontLoader'
import { FONT_LIST } from '@/constants/fonts'
import {
  useBackgroundStore,
  useIconStore,
  useTextLayersStore,
  useWatermarkStore,
  useExportConfigStore,
  useThemeStore,
} from '@/stores'
import { BUILTIN_THEMES } from '@/constants/themes'
import type { CanvasConfig } from '@/types/canvas'

// Preload all fonts on app startup so preview renders correctly
onMounted(() => {
  ensureFontsLoaded(FONT_LIST)
})

const panelRightRef = ref<InstanceType<typeof PanelRight>>()
const { isExporting, exportImage } = useExport()
const themeStore = useThemeStore()

const showThemeModal = ref(false)
const showSaveModal = ref(false)
const showSavedList = ref(false)
const showResetModal = ref(false)
const saveName = ref('')
const currentThemeId = ref('default')

const themes = BUILTIN_THEMES

function collectConfig(): CanvasConfig {
  const bg = useBackgroundStore()
  const icon = useIconStore()
  const text = useTextLayersStore()
  const wm = useWatermarkStore()
  const exp = useExportConfigStore()

  return {
    background: JSON.parse(JSON.stringify(bg.config)),
    icon: JSON.parse(JSON.stringify(icon.config)),
    textLayers: JSON.parse(JSON.stringify(text.layers)),
    watermark: JSON.parse(JSON.stringify(wm.config)),
    export: JSON.parse(JSON.stringify(exp.config)),
  }
}

function applyConfig(config: Partial<CanvasConfig>) {
  const bg = useBackgroundStore()
  const icon = useIconStore()
  const text = useTextLayersStore()
  const wm = useWatermarkStore()
  const exp = useExportConfigStore()

  if (config.background) bg.loadFrom(config.background)
  if (config.icon) icon.loadFrom(config.icon)
  if (config.textLayers) text.loadFrom(config.textLayers)
  if (config.watermark) wm.loadFrom(config.watermark)
  if (config.export) exp.loadFrom(config.export)
}

function applyTheme(themeId: string) {
  currentThemeId.value = themeId
  const theme = themes.find(t => t.id === themeId)
  if (!theme) return

  try {
    if (themeId === 'default') {
      useBackgroundStore().reset()
      useIconStore().reset()
      useTextLayersStore().reset()
      useWatermarkStore().reset()
      useExportConfigStore().reset()
    } else {
      applyConfig(theme.config as Partial<CanvasConfig>)
    }
  } catch (e) {
    console.error('Failed to apply theme:', e)
  }
  showThemeModal.value = false
}

async function onExport() {
  const el = panelRightRef.value?.getCanvasEl()
  if (!el) return
  const expStore = useExportConfigStore()

  const textLayers = useTextLayersStore()
  const wm = useWatermarkStore()
  const fonts = new Set<string>()
  textLayers.layers.forEach(l => fonts.add(l.font))
  fonts.add(wm.config.font)

  await exportImage(el, expStore.config, () => ensureFontsLoaded([...fonts]))
}

function onSave() {
  saveName.value = ''
  showSaveModal.value = true
}

function doSave() {
  if (!saveName.value.trim()) return
  themeStore.saveConfig(saveName.value.trim(), collectConfig())
  showSaveModal.value = false
  showSavedList.value = true
}

function openSavedListFromSave() {
  showSaveModal.value = false
  showSavedList.value = true
}

function loadSaved(id: string) {
  const config = themeStore.loadConfig(id)
  if (config) {
    applyConfig(config)
    showSavedList.value = false
  }
}

function onResetConfirm() {
  useBackgroundStore().reset()
  useIconStore().reset()
  useTextLayersStore().reset()
  useWatermarkStore().reset()
  useExportConfigStore().reset()
  showResetModal.value = false
}
</script>
