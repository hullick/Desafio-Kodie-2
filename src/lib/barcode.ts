/** Remove espaços e verifica se é um código EAN/UPC (8 a 14 dígitos). */
export function normalizeBarcode(input: string): string {
  return input.replace(/\s+/g, '')
}

export function isValidBarcode(input: string): boolean {
  return /^\d{8,14}$/.test(normalizeBarcode(input))
}

/**
 * Confere o dígito verificador (EAN-8, UPC-A, EAN-13, GTIN-14): descarta leituras erradas da câmera,
 * que às vezes trocam um dígito. Código de 8 dígitos começado por 0 ou 1 pode ser UPC-E, cujo
 * verificador vem do código expandido: esse passa sem a conferência.
 */
export function hasValidCheckDigit(code: string): boolean {
  if (!/^\d{8}$|^\d{12,14}$/.test(code)) return false
  const digits = [...code].map(Number)
  const check = digits.pop()!
  // Da direita para a esquerda, sem o verificador: pesos 3, 1, 3, 1...
  const sum = digits.reverse().reduce((s, d, i) => s + d * (i % 2 === 0 ? 3 : 1), 0)
  if ((10 - (sum % 10)) % 10 === check) return true
  return code.length === 8 && (code[0] === '0' || code[0] === '1')
}
