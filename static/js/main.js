import { createProductElement } from "./product.js";

async function fetchProductData() {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();
    console.log(data);
    createProductElement(data.products);
  } catch (error) {
    console.error("Failed to fetch product data:", error);
  }
}

fetchProductData();
