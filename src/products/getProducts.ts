import { Product } from "../Products";

export async function getProducts() {
  const response = await fetch(window.location.origin + "/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const products: Product[] = await response.json();
  return products;
}
