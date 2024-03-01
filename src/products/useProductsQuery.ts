import { useEffect, useRef, useState } from "react";
import { getProducts } from "./getProducts";
import { Product } from "./types";

export function useProductsQuery() {
  const mountedRef = useRef(false);
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    getProducts()
      .then((products) => {
        setData(products);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { data, error, isLoading };
}
