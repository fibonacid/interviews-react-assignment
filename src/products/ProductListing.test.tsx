import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, test, expect } from "vitest";
import { Product } from "../Products";
import { ProductListing } from "./ProductListing";

function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

describe("when the request is successful", () => {
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

  test("should render the products", async () => {
    const { getByText } = setup(<ProductListing />);
    for await (const product of products) {
      waitFor(() => expect(getByText(product.name)).toBeInTheDocument());
    }
  });
});
