import { addToCart, showQuantityControls, updateQuantity } from "./cart.js";

function createProductElement(productData) {
  const productsGrid = document.getElementById("productsGrid");

  productData.forEach((product) => {
    const { image, name, category, price } = product;

    const imagePath = window.innerWidth <= "570" ? image.mobile : image.desktop;

    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    productDiv.innerHTML = `
      <img class="product-image" src="${imagePath}" alt="Image of ${name}">
      <div class="product-btn-container">
        <button class="add-to-cart-btn">
          <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart">Add to cart
        </button>
        <div class="quantity-controls">
          <button class="decrement-btn"><img src="./assets/images/icon-decrement-quantity.svg" alt="" /></button>
          <p class="quantity">1</p>
          <button class="increment-btn"><img src="./assets/images/icon-increment-quantity.svg" alt="" /></button>
        </div>
      </div>
      <div class="product-details">
        <p class="product-category">${category}</p>
        <p class="product-name">${name}</p>
        <p class="product-price">$${price.toFixed(2)}</p>
      </div>
    `;

    const addToCartButton = productDiv.querySelector(".add-to-cart-btn");
    addToCartButton.addEventListener("click", (event) =>
      addToCart(event, product)
    );

    const incrementButton = productDiv.querySelector(".increment-btn");
    const decrementButton = productDiv.querySelector(".decrement-btn");
    const quantityText = productDiv.querySelector(".quantity");
    incrementButton.addEventListener("click", () => {
      updateQuantity(product, 1);
      quantityText.textContent = Number(quantityText.textContent);
    });

    decrementButton.addEventListener("click", () => {
      updateQuantity(product, -1);
      quantityText.textContent = Number(quantityText.textContent);
    });

    productsGrid.appendChild(productDiv);
    updateQuantity(product, 0)
 
  });
}

export { createProductElement };
