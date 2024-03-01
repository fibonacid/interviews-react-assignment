import { useEffect, useRef, useState } from "react";
import { getProducts } from "./getProducts";
import { Product } from "./types";

export function useProducts() {
  const mountedRef = useRef(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    getProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { products, error, isLoading };
}
