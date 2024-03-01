import { useEffect, useRef } from "react";
import { getProducts } from "./getProducts";

export function useProducts() {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    getProducts();
  }, []);

  return { products: [] };
}
