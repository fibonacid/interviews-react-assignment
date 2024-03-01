import { renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getProducts } from "./getProducts";
import { useProducts } from "./useProducts";

vi.mock("./getProducts", () => {
  return {
    getProducts: vi.fn(),
  };
});

test("should call getProducts once", async () => {
  renderHook(() => useProducts());
  const mockGetProducts = vi.mocked(getProducts);
  expect(mockGetProducts).toHaveBeenCalledTimes(1);
});
