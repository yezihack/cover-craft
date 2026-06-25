import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nanoid } from 'nanoid'
import type { TextLayer } from '@/types/canvas'

const DEFAULT_LAYER: Omit<TextLayer, 'id' | 'label'> = {
  text: '标题文字',
  font: 'Maple Mono CN',
  bold: true,
  italic: false,
  fontSize: 120,
  color: '#e2e8f0ff',
  opacity: 100,
  letterSpacing: 0,
  rotate: 0,
  shadowDepth: 0,
  x: 50,
  y: 50,
}

export const useTextLayersStore = defineStore('textLayers', () => {
  const layers = ref<TextLayer[]>([
    { id: nanoid(6), label: '图层 1', ...DEFAULT_LAYER },
  ])

  function addLayer() {
    if (layers.value.length >= 10) return
    const last = layers.value[layers.value.length - 1]
    layers.value.push({
      ...last,
      id: nanoid(6),
      label: `图层 ${layers.value.length + 1}`,
      text: '新文本',
    })
  }

  function removeLayer(id: string) {
    if (layers.value.length <= 1) return
    layers.value = layers.value.filter(l => l.id !== id)
  }

  function updateLayer<K extends keyof TextLayer>(id: string, key: K, value: TextLayer[K]) {
    const layer = layers.value.find(l => l.id === id)
    if (layer) (layer as Record<string, unknown>)[key] = value
  }

  function reorderLayers(newOrder: TextLayer[]) {
    layers.value = newOrder
  }

  function loadFrom(lyrs: TextLayer[]) {
    if (!lyrs || !lyrs.length) return
    layers.value = lyrs.map(l => ({ ...l, id: l.id || nanoid(6) }))
  }

  function reset() {
    layers.value = [{ id: nanoid(6), label: '图层 1', ...DEFAULT_LAYER }]
  }

  return { layers, addLayer, removeLayer, updateLayer, reorderLayers, loadFrom, reset }
})
