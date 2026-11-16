export function demoPrice(subtotal: number, eligible: boolean) {
  const originalTotal = Math.round(subtotal * 1000) / 1000;
  const discount = eligible ? Math.round(originalTotal * 0.3 * 1000) / 1000 : 0;
  return { originalTotal, discount, total: Math.round((originalTotal - discount) * 1000) / 1000 };
}
