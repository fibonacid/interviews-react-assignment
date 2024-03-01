import { Product } from "./types";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card style={{ width: "100%" }}>
      <CardMedia
        component="img"
        height="150"
        image={product.imageUrl}
        alt={product.imageAlt}
      />
      <CardContent>
        <Typography gutterBottom variant="h6">
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
            // onClick={() => addToCart(product.id, -1)}
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
            // onClick={() => addToCart(product.id, 1)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}
