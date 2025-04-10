import { createProductElement } from "./product.js";

async function fetchProductData() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    createProductElement(data);
  } catch (error) {
    console.error("Failed to fetch product data:", error);
  }
}

fetchProductData();