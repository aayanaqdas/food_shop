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

window.onscroll = () => {
  const navEl = document.querySelector("nav");

  if(window.pageYOffset > 50){
    navEl.classList.add("nav-sticky");
  }
  else{
    navEl.classList.remove("nav-sticky");
  }
};
