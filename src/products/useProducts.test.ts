import { renderHook, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getProducts } from "./getProducts";
import { useProducts } from "./useProducts";

vi.mock("./getProducts", () => {
  return {
    getProducts: vi.fn(() => Promise.resolve([])),
  };
});

const mockGetProducts = vi.mocked(getProducts);

test("should call getProducts once", async () => {
  renderHook(() => useProducts());
  expect(mockGetProducts).toHaveBeenCalledTimes(1);
});

test("should return products", async () => {
  const { result } = renderHook(() => useProducts());
  await waitFor(() =>
    expect(result.current).toEqual(expect.objectContaining({ products: [] }))
  );
});

test("should return an error when request fails", async () => {
  const error = new Error("Request failed");
  mockGetProducts.mockRejectedValueOnce(error);
  const { result } = renderHook(() => useProducts());
  await waitFor(() =>
    expect(result.current).toEqual(expect.objectContaining({ error }))
  );
});

test("should track loading state", async () => {
  const { result } = renderHook(() => useProducts());

  await waitFor(() => {
    expect(result.current).toEqual(
      expect.objectContaining({ isLoading: true })
    );
  });

  await waitFor(() =>
    expect(result.current).toEqual(
      expect.objectContaining({ isLoading: false })
    )
  );
});
