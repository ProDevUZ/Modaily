export type ShopWorkingHourRecord = {
  id: string;
  label: string | null;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ShopLocationRecord = {
  id: string;
  address: string;
  mapLink: string | null;
  active: boolean;
  sortOrder: number;
  workingHours: ShopWorkingHourRecord[];
  createdAt: string;
  updatedAt: string;
};
