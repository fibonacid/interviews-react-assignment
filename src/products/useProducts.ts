import { useEffect, useRef, useState } from "react";
import { getProducts } from "./getProducts";

export function useProducts() {
  const mountedRef = useRef(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    getProducts().catch((error) => {
      setError(error);
    });
  }, []);

  return { products: [], error };
}
