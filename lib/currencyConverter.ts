// Conversion rates between each currency pair
const conversionRates: Record<string, Record<string, number>> = {
  USD: { USD: 1, EUR: 0.91, HUF: 357 },
  EUR: { USD: 1.1, EUR: 1, HUF: 392 },
  HUF: { USD: 0.0028, EUR: 0.00255, HUF: 1 },
};

export function convertCurrency(amount: number, from: string, to: string) {
  if (from === to) return amount;

  const fromRates = conversionRates[from];
  if (!fromRates || !fromRates[to]) {
    console.warn(`No conversion rate from ${from} to ${to}, returning original amount`);
    return amount;
  }

  return amount * fromRates[to];
}
