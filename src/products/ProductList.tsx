import { Box, Grid } from "@mui/material";
import { Product } from "../Products.tsx";
import { ProductCard } from "./ProductCard.tsx";

export function ProductList({ products }: { products: Product[] }) {
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
          <Grid key={product.id} item xs={4} component="li">
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
