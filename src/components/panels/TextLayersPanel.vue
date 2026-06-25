<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wide">标题设置</h3>

    <!-- Layer list -->
    <div class="flex flex-col gap-1">
      <div
        v-for="(layer, index) in store.layers"
        :key="layer.id"
        class="border border-slate-700 rounded-lg overflow-hidden"
        :class="expandedId === layer.id ? 'bg-slate-800' : 'bg-slate-800/50'"
      >
        <!-- Layer header -->
        <div
          class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-700/50"
          @click="toggleExpand(layer.id)"
        >
          <span class="cursor-grab text-slate-500 text-xs" @click.stop>☰</span>
          <span class="flex-1 text-xs text-slate-300 truncate">{{ layer.label }}</span>
          <span class="text-xs text-slate-500 truncate max-w-[120px]">{{ layer.text }}</span>
          <button
            class="text-slate-500 hover:text-slate-300 text-xs px-1"
            @click.stop="startEditLabel(layer)"
          >✏️</button>
          <button
            class="text-slate-500 hover:text-red-400 text-xs px-1"
            :class="{ 'opacity-30 cursor-not-allowed': store.layers.length <= 1 }"
            @click.stop="confirmDelete(layer)"
          >🗑️</button>
          <span class="text-xs text-slate-600">{{ expandedId === layer.id ? '▼' : '▶' }}</span>
        </div>

        <!-- Expanded layer config -->
        <div v-if="expandedId === layer.id" class="px-3 pb-3 flex flex-col gap-3 border-t border-slate-700 pt-3">
          <!-- Label edit -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400">图层名称</label>
            <input
              :value="layer.label"
              class="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
              @input="store.updateLayer(layer.id, 'label', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <!-- Text content -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400">文本内容</label>
            <textarea
              :value="layer.text"
              rows="2"
              class="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 resize-none"
              @input="store.updateLayer(layer.id, 'text', ($event.target as HTMLTextAreaElement).value)"
            />
          </div>

          <!-- Font -->
          <SelectInput
            :model-value="layer.font"
            label="字体"
            :options="fontOptions"
            @update:model-value="(v: string) => store.updateLayer(layer.id, 'font', v)"
          />

          <!-- Bold / Italic -->
          <div class="flex gap-4">
            <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                :checked="layer.bold"
                class="accent-green-600"
                @change="store.updateLayer(layer.id, 'bold', ($event.target as HTMLInputElement).checked)"
              />
              加粗
            </label>
            <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                :checked="layer.italic"
                class="accent-green-600"
                @change="store.updateLayer(layer.id, 'italic', ($event.target as HTMLInputElement).checked)"
              />
              斜体
            </label>
          </div>

          <SliderInput
            :model-value="layer.fontSize"
            label="字体大小"
            :min="12"
            :max="400"
            suffix="px"
            @update:model-value="(v: number) => store.updateLayer(layer.id, 'fontSize', v)"
          />

          <ColorPicker
            :model-value="layer.color"
            label="颜色"
            @update:model-value="(v: string) => store.updateLayer(layer.id, 'color', v)"
          />

          <SliderInput
            :model-value="layer.opacity"
            label="透明度"
            :min="0"
            :max="100"
            suffix="%"
            @update:model-value="(v: number) => store.updateLayer(layer.id, 'opacity', v)"
          />

          <SliderInput
            :model-value="layer.letterSpacing"
            label="字间距"
            :min="-10"
            :max="100"
            suffix="px"
            @update:model-value="(v: number) => store.updateLayer(layer.id, 'letterSpacing', v)"
          />

          <SliderInput
            :model-value="layer.rotate"
            label="旋转角度"
            :min="-180"
            :max="180"
            suffix="°"
            @update:model-value="(v: number) => store.updateLayer(layer.id, 'rotate', v)"
          />

          <SliderInput
            :model-value="layer.shadowDepth"
            label="立体字效果"
            :min="0"
            :max="20"
            @update:model-value="(v: number) => store.updateLayer(layer.id, 'shadowDepth', v)"
          />

          <SliderInput
            :model-value="layer.x"
            label="水平位置"
            :min="0"
            :max="100"
            suffix="%"
            @update:model-value="(v: number) => store.updateLayer(layer.id, 'x', v)"
          />

          <SliderInput
            :model-value="layer.y"
            label="垂直位置"
            :min="0"
            :max="100"
            suffix="%"
            @update:model-value="(v: number) => store.updateLayer(layer.id, 'y', v)"
          />
        </div>
      </div>
    </div>

    <!-- Add layer button -->
    <button
      class="w-full py-2 text-xs border border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-green-600 hover:text-green-400 transition-colors"
      :class="{ 'opacity-30 cursor-not-allowed': store.layers.length >= 10 }"
      :title="store.layers.length >= 10 ? '最多 10 个图层' : ''"
      @click="store.addLayer()"
    >
      + 添加文本图层
    </button>

    <!-- Delete confirm modal -->
    <ConfirmModal
      :visible="showDeleteModal"
      title="删除图层"
      :message="`删除后不可恢复，确认删除「${deleteTarget?.label}」？`"
      @confirm="onDeleteConfirm"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTextLayersStore } from '@/stores/textLayers'
import type { TextLayer } from '@/types/canvas'
import { FONT_LIST } from '@/constants/fonts'
import ColorPicker from '@/components/ui/ColorPicker.vue'
import SliderInput from '@/components/ui/SliderInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const store = useTextLayersStore()

const expandedId = ref<string>(store.layers[0]?.id ?? '')

const fontOptions = FONT_LIST.map(f => ({ value: f, label: f }))

const showDeleteModal = ref(false)
const deleteTarget = ref<TextLayer | null>(null)

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? '' : id
}

function startEditLabel(layer: TextLayer) {
  expandedId.value = layer.id
}

function confirmDelete(layer: TextLayer) {
  if (store.layers.length <= 1) return
  deleteTarget.value = layer
  showDeleteModal.value = true
}

function onDeleteConfirm() {
  if (deleteTarget.value) {
    store.removeLayer(deleteTarget.value.id)
    if (expandedId.value === deleteTarget.value.id) {
      expandedId.value = store.layers[0]?.id ?? ''
    }
  }
  showDeleteModal.value = false
  deleteTarget.value = null
}
</script>
