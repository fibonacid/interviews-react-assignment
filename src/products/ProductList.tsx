import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { ProductCard } from "./ProductCard.tsx";
import { Product } from "../Products.tsx";

export function ProductList() {
  const [products] = useState<Product[]>([]);
  return (
    <Box overflow="scroll" height="100%">
      <Grid
        container
        spacing={2}
        p={2}
        component="ul"
        aria-label="Product List"
      >
        {products.map((product) => (
          <Grid item xs={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
