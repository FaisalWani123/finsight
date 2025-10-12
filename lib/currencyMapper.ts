export function currencyMapper(currencyId: number): string {
  switch (currencyId) {
    case 1:
      return "USD";
    case 2:
      return "EUR";
    case 3:
      return "HUF";
    default:
      return "Unknown Currency";
  }
}
