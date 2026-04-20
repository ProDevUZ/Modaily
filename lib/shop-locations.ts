import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ShopLocationRecord, ShopWorkingHourRecord } from "@/lib/shop-location-types";

type ShopWorkingHourRow = {
  id: string;
  label: string | null;
  value: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type ShopLocationRow = {
  id: string;
  address: string;
  mapLink: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  workingHours: ShopWorkingHourRow[];
};

function buildMapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function serializeWorkingHour(hour: ShopWorkingHourRow): ShopWorkingHourRecord {
  return {
    id: hour.id,
    label: hour.label,
    value: hour.value,
    sortOrder: hour.sortOrder,
    createdAt: hour.createdAt.toISOString(),
    updatedAt: hour.updatedAt.toISOString()
  };
}

export function serializeShopLocation(location: ShopLocationRow): ShopLocationRecord {
  return {
    id: location.id,
    address: location.address,
    mapLink: location.mapLink,
    active: location.active,
    sortOrder: location.sortOrder,
    workingHours: location.workingHours.map(serializeWorkingHour),
    createdAt: location.createdAt.toISOString(),
    updatedAt: location.updatedAt.toISOString()
  };
}

export async function getStorefrontShopLocations(): Promise<ShopLocationRecord[]> {
  noStore();

  const rows = await prisma.shopLocation.findMany({
    where: {
      active: true
    },
    include: {
      workingHours: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  if (rows.length > 0) {
    return rows.map(serializeShopLocation);
  }

  const fallbackSettings = await prisma.siteSettings.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      storeAddress: true,
      storeMapLink: true
    }
  });

  if (!fallbackSettings?.storeAddress) {
    return [];
  }

  return [
    {
      id: "default-store",
      address: fallbackSettings.storeAddress,
      mapLink: fallbackSettings.storeMapLink || buildMapHref(fallbackSettings.storeAddress),
      active: true,
      sortOrder: 0,
      workingHours: [],
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString()
    }
  ];
}
