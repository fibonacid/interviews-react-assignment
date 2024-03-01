import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { ProductList } from "./ProductList";
import { Product } from "./types";

const products: Product[] = [
  {
    name: "Test Product 1",
    category: "",
    id: 0,
    imageUrl: "",
    itemInCart: 0,
    loading: false,
    price: 0,
  },
  {
    name: "Test Product 2",
    category: "",
    id: 0,
    imageUrl: "",
    itemInCart: 0,
    loading: false,
    price: 100,
  },
  {
    name: "Test Product 3",
    category: "",
    id: 0,
    imageUrl: "https://example.com/image.jpg",
    itemInCart: 0,
    loading: false,
    price: 0,
  },
];

vi.mock("./ProductCard", () => {
  return {
    ProductCard: ({ product }: { product: Product }) => <p>{product.name}</p>,
  };
});

function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

test("should render all products", () => {
  const { getAllByRole, getByText } = setup(
    <ProductList products={products} />
  );

  expect(getAllByRole("listitem")).toHaveLength(3);
  for (const product of products) {
    expect(getByText(product.name)).toBeInTheDocument();
  }
});
