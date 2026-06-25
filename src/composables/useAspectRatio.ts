import { computed } from 'vue'
import { useExportConfigStore } from '@/stores/exportConfig'
import { ASPECT_RATIOS } from '@/constants/aspectRatios'

export function useAspectRatio() {
  const store = useExportConfigStore()

  const currentRatio = computed(() => store.config.aspectRatio)

  const ratioOptions = ASPECT_RATIOS.map(r => ({
    key: r.key,
    label: r.label,
    isActive: computed(() => currentRatio.value === r.key),
  }))

  return { ratioOptions, currentRatio, setRatio: store.setAspectRatio }
}
