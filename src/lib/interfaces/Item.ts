export interface Item {
  id: string;
  name: string;
  episodeId: string;
  shippingCost?: number;
  seasonId: string;
  cost?: number;
  estimatedSellPrice?: number;
  actualSellPrice?: number;
  timeSpentHours?: number;
  timeSpentMinutes?: number;
  expenses?: number;
}
