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
import { useEffect, useRef, useState } from "react";
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

  // We keep track to the page index so that we can increment it and fetch more products
  const [pageIndex, setPageIndex] = useState(0);
  const lastPageIndex = useRef<number>();

  // We concatenate all the pages into a single array
  // This _might_ benefit from memoization
  const allProducts = products.flat();

  useEffect(() => {
    // Prevent duplicate calls. In production i would use TanstackQuery
    // because there are too many edge cases to handle.
    if (lastPageIndex.current === pageIndex) return;
    lastPageIndex.current = pageIndex;

    const url = new URL("products", window.location.origin);
    url.searchParams.append("limit", "2");
    url.searchParams.append("page", pageIndex.toString());

    fetch(url)
      .then((response) => response.json())
      .then((data) =>
        setProducts((products) => [...products, ...data.products])
      );

    // Re-run when pageIndex changes
  }, [pageIndex]);

  function addToCart(productId: number, quantity: number) {
    setProducts(
      products.map((page, index) => {
        if (index === pageIndex) {
          // We keep the prev pages intact, while updating the current page
          return page.map((product) => {
            if (product.id === productId) {
              return { ...product, loading: true };
            }
            return product;
          });
        }
        return page;
      })
    );

    fetch("/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    }).then(async (response) => {
      if (response.ok) {
        const cart = await response.json();
        setProducts(
          products.map((page) => {
            return page.map((product) => {
              // Same as above, but we also update the itemInCart
              if (product.id === productId) {
                return {
                  ...product,
                  itemInCart: (product.itemInCart || 0) + quantity,
                  loading: false,
                };
              }
              return product;
            });
          })
        );
        onCartChange(cart);
      }
    });
  }

  return (
    <Box overflow="scroll" height="100%">
      {/* We add this button to set the next page, we will use the IntersectionObserver api eventually */}
      <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
      <Grid container spacing={2} p={2}>
        {allProducts.map((product) => (
          <Grid item xs={4}>
            {/* Do not remove this */}
            <HeavyComponent />
            <Card key={product.id} style={{ width: "100%" }}>
              <CardMedia
                component="img"
                height="150"
                image={product.imageUrl}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
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
    </Box>
  );
};
