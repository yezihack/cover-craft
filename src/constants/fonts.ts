export const FONT_LIST = [
  'Maple Mono CN',
  'Noto Sans SC',
  'Noto Serif SC',
  'Source Han Sans CN',
  'ZCOOL XiaoWei',
  'Ma Shan Zheng',
  'Inter',
  'Georgia',
  'Arial',
]

/**
 * Font source URLs for fonts loaded via FontFace API from /public/fonts/.
 * Currently empty — all Chinese fonts are loaded via @fontsource/* packages.
 * Maple Mono CN uses local() only (system-installed font).
 */
export const FONT_URLS: Record<string, string> = {}

/**
 * System fonts that are expected to be available locally or via local().
 * No loading needed — they fall through to the system font stack.
 */
export const SYSTEM_FONTS = new Set([
  'Georgia',
  'Arial',
  'Source Han Sans CN',
  'Maple Mono CN',
])

/**
 * Fonts loaded via @fontsource/* npm packages (imported in main.ts).
 * These register @font-face rules automatically and are available
 * once the CSS is parsed by the browser.
 */
export const FONTSOURCE_FONTS = new Set([
  'Noto Sans SC',
  'Noto Serif SC',
  'ZCOOL XiaoWei',
  'Ma Shan Zheng',
  'Inter',
])
