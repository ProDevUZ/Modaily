export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  city: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
};

export type AdminProduct = {
  id: string;
  sku: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  shortDescriptionUz: string | null;
  shortDescriptionRu: string | null;
  shortDescriptionEn: string | null;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  size: string | null;
  price: number;
  stock: number;
  active: boolean;
  colorFrom: string | null;
  colorTo: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: AdminCategory;
};

export async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || "Request failed");
  }

  return (await response.json()) as T;
}
