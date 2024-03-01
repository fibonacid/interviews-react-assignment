import { renderHook, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { getProducts } from "./getProducts";
import { useProductsQuery } from "./useProductsQuery";
import { Product } from "./types";

const products: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    category: "Category 1",
    imageUrl: "https://via.placeholder.com/150?text=Product+1",
    itemInCart: 0,
    loading: false,
  },
];

vi.mock("./getProducts", () => {
  return {
    getProducts: vi.fn(() => Promise.resolve(products)),
  };
});

const mockGetProducts = vi.mocked(getProducts);

test("should call getProducts once", async () => {
  renderHook(() => useProductsQuery());
  expect(mockGetProducts).toHaveBeenCalledTimes(1);
});

test("should return products", async () => {
  mockGetProducts.mockResolvedValueOnce({
    products,
    total: products.length,
    hasMore: false,
  });
  const { result } = renderHook(() => useProductsQuery());
  await waitFor(() =>
    expect(result.current).toEqual(
      expect.objectContaining({
        data: {
          products,
          total: products.length,
          hasMore: false,
        },
      })
    )
  );
});

test("should return an error when request fails", async () => {
  const error = new Error("Request failed");
  mockGetProducts.mockRejectedValueOnce(error);
  const { result } = renderHook(() => useProductsQuery());
  await waitFor(() =>
    expect(result.current).toEqual(expect.objectContaining({ error }))
  );
});

test("should track loading state", async () => {
  const { result } = renderHook(() => useProductsQuery());

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

test("should pass limit to getProducts", async () => {
  renderHook(() => useProductsQuery({ limit: 10 }));
  expect(mockGetProducts).toHaveBeenCalledWith({ limit: 10 });
});
