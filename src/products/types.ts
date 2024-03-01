export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  imageAlt?: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
};
