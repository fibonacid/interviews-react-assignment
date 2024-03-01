import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { test, afterAll, afterEach, beforeAll, describe, expect } from "vitest";
import { getProducts } from "./getProducts";
import { Product } from "../Products";

const products: Product[] = [
  {
    id: 0,
    name: "Product 1",
    price: 100,
    category: "",
    imageUrl: "",
    itemInCart: 0,
    loading: false,
  },
  {
    id: 1,
    name: "Product 2",
    price: 200,
    category: "",
    imageUrl: "",
    itemInCart: 0,
    loading: false,
  },
];

describe("when request is successful", () => {
  const server = setupServer(
    http.get("/products", () => {
      return HttpResponse.json(products);
    })
  );
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers());

  test("should return products", async () => {
    const result = await getProducts();
    expect(result).toEqual(products);
  });
});

describe("when request fails", () => {
  const server = setupServer(
    http.get("/products", () => {
      return HttpResponse.json({ products: [] }, { status: 500 });
    })
  );
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers());

  test("should throw when request fails", async () => {
    expect(getProducts()).rejects.toThrow();
  });
});
