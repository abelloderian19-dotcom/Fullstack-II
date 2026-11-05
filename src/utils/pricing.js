export function formatPrice(price) {
  return `$${Number(price).toLocaleString("es-CL")}`;
}

export function effectivePrice(product) {
  const discount = Number(product.descuento) || 0;
  return Math.round(product.precio * (1 - discount / 100));
}
