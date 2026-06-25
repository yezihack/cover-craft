import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { SavedConfig, CanvasConfig } from '@/types/canvas'

export const useThemeStore = defineStore('theme', () => {
  const savedConfigs = useLocalStorage<SavedConfig[]>('cover-designer:configs', [])

  function saveConfig(name: string, config: CanvasConfig) {
    savedConfigs.value.push({
      id: nanoid(8),
      name,
      createdAt: Date.now(),
      config: JSON.parse(JSON.stringify(config)),
    })
  }

  function loadConfig(id: string): CanvasConfig | null {
    return savedConfigs.value.find(c => c.id === id)?.config ?? null
  }

  function deleteConfig(id: string) {
    savedConfigs.value = savedConfigs.value.filter(c => c.id !== id)
  }

  return { savedConfigs, saveConfig, loadConfig, deleteConfig }
})
