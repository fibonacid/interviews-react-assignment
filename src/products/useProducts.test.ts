import { renderHook, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getProducts } from "./getProducts";
import { useProducts } from "./useProducts";

vi.mock("./getProducts", () => {
  return {
    getProducts: vi.fn(),
  };
});

const mockGetProducts = vi.mocked(getProducts);

test("should call getProducts once", async () => {
  renderHook(() => useProducts());
  expect(mockGetProducts).toHaveBeenCalledTimes(1);
});

test("should return products", async () => {
  mockGetProducts.mockResolvedValue([]);
  const { result } = renderHook(() => useProducts());
  await waitFor(() => expect(result.current).toEqual({ products: [] }));
});
