export function useRandomFilename() {
  function generate(
    length: number,
    useDigit: boolean,
    useLower: boolean,
    useUpper: boolean,
  ): string {
    const chars = [
      ...(useDigit ? '0123456789' : ''),
      ...(useLower ? 'abcdefghijklmnopqrstuvwxyz' : ''),
      ...(useUpper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''),
    ]
    if (!chars.length) return 'cover'
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('')
  }

  return { generate }
}
