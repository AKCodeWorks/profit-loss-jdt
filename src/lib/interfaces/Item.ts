export interface Item {
  id: string;
  name: string;
  episodeId: string;
  shippingCost?: number;
  seasonId: string;
  cost?: number;
  estimatedSellPrice?: number;
  actualSellPrice?: number;
  timeSpent?: number;
  expenses?: number;
}
