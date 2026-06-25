import { ref, onUnmounted, unref, type MaybeRef } from 'vue'

export interface DragPositionOptions {
  /** 画布像素宽度（支持 Ref） */
  canvasWidth: MaybeRef<number>
  /** 画布像素高度（支持 Ref） */
  canvasHeight: MaybeRef<number>
  /** 当前 x 百分比 (0-100) */
  getX: () => number
  /** 当前 y 百分比 (0-100) */
  getY: () => number
  /** 更新位置回调 */
  onMove: (x: number, y: number) => void
}

export function useDragPosition(options: DragPositionOptions) {
  const isDragging = ref(false)

  let startMouseX = 0
  let startMouseY = 0
  let startPctX = 0
  let startPctY = 0

  function onMouseDown(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    isDragging.value = true
    startMouseX = e.clientX
    startMouseY = e.clientY
    startPctX = options.getX()
    startPctY = options.getY()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging.value) return
    const dx = e.clientX - startMouseX
    const dy = e.clientY - startMouseY
    const cw = unref(options.canvasWidth)
    const ch = unref(options.canvasHeight)
    const pctX = startPctX + (dx / cw) * 100
    const pctY = startPctY + (dy / ch) * 100
    options.onMove(
      Math.round(Math.max(0, Math.min(100, pctX))),
      Math.round(Math.max(0, Math.min(100, pctY))),
    )
  }

  function onMouseUp() {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  return { isDragging, onMouseDown }
}
