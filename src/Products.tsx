import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeavyComponent } from "./HeavyComponent.tsx";

export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
};

export type Cart = {
  items: Product[];
  totalPrice: number;
  totalItems: number;
};

export const Products = ({
  onCartChange,
}: {
  onCartChange: (cart: Cart) => void;
}) => {
  // Products is a 2D array, each page is an array of products
  const [products, setProducts] = useState<Product[][]>([]);
  console.log("Products", products);

  // We keep track to the page index so that we can increment it and fetch more products
  const [pageIndex, setPageIndex] = useState(0);
  const lastPageIndex = useRef<number>();

  // We concatenate all the pages into a single array
  // This _might_ benefit from memoization
  const allProducts = products.flat();

  // We use an intersection observer to detect when the user has scrolled to the bottom
  const intersectingElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!intersectingElementRef.current) {
      // This should never happen in practice. If it does, you
      // probably removed the div from the returned JSX
      throw new Error("Intersection element not found");
    }

    // Increment the page index when the element is intersecting
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageIndex((pageIndex) => pageIndex + 1);
        }
      },
      { threshold: 1 }
    );
    // Put current value in scope to avoid stale closure
    const element = intersectingElementRef.current;
    // This is important because `observer.unobserve` needs to refer to the same instance
    observer.observe(element);

    return () => {
      // Clean up the observer
      observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    // Prevent duplicate calls. In production i would use TanstackQuery
    // because there are too many edge cases to handle.
    if (lastPageIndex.current === pageIndex) return;
    lastPageIndex.current = pageIndex;

    const url = new URL("products", window.location.origin);
    url.searchParams.append("limit", "10");
    url.searchParams.append("page", pageIndex.toString());

    fetch(url)
      .then((response) => response.json())
      .then((data) => setProducts((products) => [...products, data.products]));

    // Re-run when pageIndex changes
  }, [pageIndex]);

  const addToCart = useCallback(
    async (productId: number, quantity: number) => {
      // Save the current product data
      const product = allProducts.find((p) => p.id === productId);
      if (!product) return console.error("Product not found");

      const productPageIndex = products.findIndex((page) =>
        page.some((p) => p.id === productId)
      );
      if (productPageIndex === -1) return console.error("Product not found");

      // Update local state
      const newProducts = [...products];
      newProducts[productPageIndex] = newProducts[productPageIndex].map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            itemInCart: (p.itemInCart || 0) + quantity, // Optimistic update
            loading: true,
          };
        }
        return p;
      });
      setProducts(newProducts);

      // Update the cart
      const response = await fetch("/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        console.error("Failed to update cart");
        setProducts([...products]); // Revert the local state
      }

      // Update the cart
      const cart: Cart = await response.json();
      onCartChange(cart);

      // Stop loading state and keep optimistic update
      setProducts((products) => {
        return products.map((page) =>
          page.map((p) => {
            if (p.id === productId) {
              return {
                ...p,
                loading: false,
              };
            }
            return p;
          })
        );
      });
    },
    [products, allProducts, onCartChange]
  );

  return (
    <Box overflow="scroll" height="100%">
      <Grid
        container
        spacing={2}
        p={2}
        component="ul"
        aria-label="Product List"
      >
        {allProducts.map((product) => (
          <Grid item xs={4} component="li">
            {/* Do not remove this */}
            <HeavyComponent />
            <Card key={product.id} style={{ width: "100%" }}>
              <CardMedia
                component="img"
                height="150"
                image={product.imageUrl}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  id={`product-list-item-${product.id}`}
                >
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                </Typography>
              </CardContent>
              <CardActions>
                <Typography variant="h6" component="div">
                  ${product.price}
                </Typography>
                <Box flexGrow={1} />
                <Box
                  position="relative"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Box
                    position="absolute"
                    left={0}
                    right={0}
                    top={0}
                    bottom={0}
                    textAlign="center"
                  >
                    {product.loading && <CircularProgress size={20} />}
                  </Box>
                  <IconButton
                    disabled={product.loading}
                    aria-label="delete"
                    size="small"
                    onClick={() => addToCart(product.id, -1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography variant="body1" component="div" mx={1}>
                    {product.itemInCart || 0}
                  </Typography>

                  <IconButton
                    disabled={product.loading}
                    aria-label="add"
                    size="small"
                    onClick={() => addToCart(product.id, 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div ref={intersectingElementRef} />
    </Box>
  );
};
