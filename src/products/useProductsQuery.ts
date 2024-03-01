import { useEffect, useRef, useState } from "react";
import { GetProductsResult, getProducts } from "./getProducts";

export function useProductsQuery({ limit }: { limit?: number } = {}) {
  const mountedRef = useRef(false);
  const [data, setData] = useState<GetProductsResult>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    getProducts({ limit })
      .then((products) => {
        setData(products);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, isLoading };
}
