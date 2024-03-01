import { useEffect, useRef, useState } from "react";
import { getProducts } from "./getProducts";

export function useProducts() {
  const mountedRef = useRef(false);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    getProducts()
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { products: [], error, isLoading };
}
