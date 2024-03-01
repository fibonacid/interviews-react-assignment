import { useEffect, useRef } from "react";
import { getProducts } from "./getProducts";

export function useProducts() {
  const mountedRef = useRef(true);
  useEffect(() => {
    if (!mountedRef.current) return;
    mountedRef.current = false;
    getProducts();
  }, []);
}
