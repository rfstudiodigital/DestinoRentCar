/**
 * Formatea un precio como moneda en pesos uruguayos
 */
export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio);
}

/**
 * Formatea un precio simple con símbolo de pesos
 */
export function formatearPrecioSimple(precio: number): string {
  return `$${precio.toFixed(2)}`;
}
