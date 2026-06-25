import { FONT_URLS, SYSTEM_FONTS, FONTSOURCE_FONTS } from '@/constants/fonts'

const loadedFonts = new Set<string>()

/**
 * Ensure the specified fonts are loaded and ready for rendering.
 *
 * - Local fonts (in FONT_URLS): loaded via FontFace API from /public/fonts/
 * - Fontsource fonts: loaded via @fontsource/* CSS imports in main.ts.
 *   These use unicode-range subsetting, so they load lazily when text
 *   in the matching range is rendered. We just wait for the CSS to be ready.
 * - System fonts: assumed available, no loading needed
 */
export async function ensureFontsLoaded(fontNames: string[]): Promise<void> {
  const toLoad = fontNames.filter(name => !loadedFonts.has(name))

  if (toLoad.length === 0) return

  // Separate fonts by category
  const localFonts = toLoad.filter(name => FONT_URLS[name])
  const fontsourceFonts = toLoad.filter(name => FONTSOURCE_FONTS.has(name))
  const systemFonts = toLoad.filter(name => SYSTEM_FONTS.has(name))

  // Mark system fonts as loaded immediately
  for (const name of systemFonts) {
    loadedFonts.add(name)
  }

  // Load local font files via FontFace API
  const localPromises = localFonts.map(async name => {
    const url = FONT_URLS[name]
    try {
      const face = new FontFace(name, `url(${url})`)
      await face.load()
      document.fonts.add(face)
    } catch {
      console.warn(`[FontLoader] Font "${name}" could not be loaded from ${url}, using fallback`)
    }
    loadedFonts.add(name)
  })

  // For fontsource fonts: these use unicode-range subsetting and load lazily.
  // We wait for document.fonts.ready to ensure the CSS @font-face rules are
  // registered, then mark them as loaded. The actual font data loads on-demand
  // when the browser renders text in the matching unicode range.
  const fontsourcePromise = (async () => {
    if (fontsourceFonts.length === 0) return

    try {
      // Wait for initial font loading to settle
      await document.fonts.ready
      // Give the browser a moment to start loading fontsource CSS
      await new Promise(r => setTimeout(r, 500))
      // Try document.fonts.ready again after fontsource CSS is processed
      await document.fonts.ready
    } catch {
      // continue
    }

    for (const name of fontsourceFonts) {
      loadedFonts.add(name)
    }
  })()

  await Promise.all([...localPromises, fontsourcePromise])
}
