import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { Product } from "../Products";
import { getProducts } from "./getProducts";

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
      return HttpResponse.json({
        products,
      });
    })
  );
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers());

  test("should return the products", async () => {
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

describe("when limit is set", () => {
  test("should call the api with the limit", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");
    getProducts({ limit: 5 });
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining("limit=5"));
  });
});

describe("when limit is not set", () => {
  test("should call the api without the limit", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");
    getProducts();
    expect(fetchSpy).toHaveBeenCalledWith(expect.not.stringContaining("limit"));
  });
});
