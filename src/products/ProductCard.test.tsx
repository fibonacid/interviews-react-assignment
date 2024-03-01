import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ProductCard } from "./ProductCard";

function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

test("should render product name", () => {
  const { getByText } = setup(
    <ProductCard
      product={{
        name: "Test Product",
        category: "",
        id: 0,
        imageUrl: "",
        itemInCart: 0,
        loading: false,
        price: 0,
      }}
    />
  );
  expect(getByText("Test Product")).toBeInTheDocument();
});

test("should render product price", () => {
  const { getByText } = setup(
    <ProductCard
      product={{
        name: "",
        category: "",
        id: 0,
        imageUrl: "",
        itemInCart: 0,
        loading: false,
        price: 100,
      }}
    />
  );
  expect(getByText("$100")).toBeInTheDocument();
});

test("should render product image", () => {
  const { getByRole } = setup(
    <ProductCard
      product={{
        name: "",
        category: "",
        id: 0,
        imageUrl: "https://example.com/image.jpg",
        imageAlt: "Product image",
        itemInCart: 0,
        loading: false,
        price: 0,
      }}
    />
  );
  expect(getByRole("img", { name: "Product image" })).toHaveAttribute(
    "src",
    "https://example.com/image.jpg"
  );
});
