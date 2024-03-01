import { ProductList } from "./ProductList";
import { useProductsQuery } from "./useProductsQuery";

export function ProductListing() {
  const productsQuery = useProductsQuery();
  return <ProductList products={productsQuery.data} />;
}
