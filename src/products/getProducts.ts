export async function getProducts() {
  console.log(window.location.origin + "/products");
  const response = await fetch(window.location.origin + "/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}
