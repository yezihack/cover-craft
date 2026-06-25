<template>
  <div class="w-[420px] shrink-0 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
    <!-- Tabs -->
    <div class="flex border-b border-slate-700">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex-1 py-2.5 text-xs font-medium transition-colors relative"
        :class="activeTab === tab.key
          ? 'text-green-400 bg-slate-800'
          : 'text-slate-500 hover:text-slate-300'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <div
          v-if="activeTab === tab.key"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
        />
      </button>
    </div>

    <!-- Panel content -->
    <div class="flex-1 overflow-y-auto p-4">
      <BackgroundPanel v-if="activeTab === 'background'" />
      <IconPanel v-if="activeTab === 'icon'" />
      <TextLayersPanel v-if="activeTab === 'text'" />
      <WatermarkPanel v-if="activeTab === 'watermark'" />
      <ExportPanel
        v-if="activeTab === 'export'"
        :is-exporting="isExporting"
        @export="$emit('export')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BackgroundPanel from '@/components/panels/BackgroundPanel.vue'
import IconPanel from '@/components/panels/IconPanel.vue'
import TextLayersPanel from '@/components/panels/TextLayersPanel.vue'
import WatermarkPanel from '@/components/panels/WatermarkPanel.vue'
import ExportPanel from '@/components/panels/ExportPanel.vue'

defineProps<{ isExporting: boolean }>()
defineEmits<{ export: [] }>()

const activeTab = ref('background')

const tabs = [
  { key: 'background', label: '背景' },
  { key: 'icon', label: '图标' },
  { key: 'text', label: '标题' },
  { key: 'watermark', label: '水印' },
  { key: 'export', label: '导出' },
]
</script>
