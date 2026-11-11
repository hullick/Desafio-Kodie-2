/** Remove espaços e verifica se é um código EAN/UPC (8 a 14 dígitos). */
export function normalizeBarcode(input: string): string {
  return input.replace(/\s+/g, '')
}

export function isValidBarcode(input: string): boolean {
  return /^\d{8,14}$/.test(normalizeBarcode(input))
}
