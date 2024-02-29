import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { test, afterAll, afterEach, beforeAll, describe, expect } from "vitest";
import { getProducts } from "./getProducts";

describe("when request is successful", () => {
  const server = setupServer(
    http.get("/products", () => {
      return HttpResponse.json({ products: [] });
    })
  );
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers());

  test("should return products", async () => {
    const products = await getProducts();
    expect(products).toEqual({ products: [] });
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
