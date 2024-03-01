import { Product } from "../Products";

export type GetProductsResult = {
  products: Product[];
  total: number;
  hasMore: boolean;
};

export async function getProducts({ limit }: { limit?: number } = {}) {
  const url = new URL("products", window.location.origin);
  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }
  const response = await fetch(url.href);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data: GetProductsResult = await response.json();
  return data;
}
