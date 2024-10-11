export interface Config {
  currency: "USD" | "EUR" | "GBP";
  locale: "en-US" | "en-GB" | "de-DE";
  defaultSeason: string | null;
  sellerRate: number;
}
