import { createOrder } from "./orderConfirmation.js";

const cartContentEl = document.getElementById("cart-content");
const cartProductsArray = JSON.parse(localStorage.getItem("user_cart_products")) || [];

function addToCart(productClicked, product) {
  const existingProduct = cartProductsArray.find(
    (cartProduct) => cartProduct.name === product.name
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
    updateQuantity(product, 1);
    showQuantityControls(productClicked);
  } else {
    product.quantity = 1;
    cartProductsArray.push(product);
    localStorage.setItem("user_cart_products", JSON.stringify(cartProductsArray));
    createCartProduct(product);
    showQuantityControls(productClicked);
    toggleCartVisibility();
  }
}

function createCartProduct(product) {
  const { thumbnail_image, name, price, quantity, product_id } = product;
;
  const cartProductDiv = document.createElement("div");
  cartProductDiv.classList.add("cart-product");
  cartProductDiv.setAttribute("data-id", product_id)
  cartProductDiv.innerHTML = `
    <div class="cart-product-details-wrapper">
      <img class="cart-product-image" src="${thumbnail_image}" alt="${name}">
      <div class="cart-product-details">
        <p class="cart-product-name">${name}</p>
        <div class="cart-product-quantity_price">
          <p class="cart-product-quantity">${quantity}x</p>
          <p class="cart-product-default-price">@ $${price}</p>
          <p class="cart-product-total-price">$${(quantity * price).toFixed(2)}</p>
        </div>
      </div>
    </div>
    <button class="cart-remove-product-btn">
      <img src="../static/assets/images/icon-remove-item.svg" alt="Remove item" />
    </button>
  `;

  cartProductDiv.querySelector(".cart-remove-product-btn").addEventListener("click", () => {
    deleteProduct(product, cartProductDiv);
  });

  cartContentEl.appendChild(cartProductDiv);
  updateCartTotal();
}

function deleteProduct(product, cartProductDiv) {
  cartProductDiv.remove();
  const updatedCart = cartProductsArray.filter((cartProduct) => cartProduct.name !== product.name);
  updateCartArray(updatedCart);

  // Sync the product grid and reset the quantity text to 1
  const productDiv = Array.from(document.getElementsByClassName("product")).find(
    (el) => el.querySelector(".product-name").textContent === product.name
  );

  if (productDiv) {
    const quantityText = productDiv.querySelector(".quantity-controls .quantity");
    const addToCartButton = productDiv.querySelector(".add-to-cart-btn");
    const quantityControls = productDiv.querySelector(".quantity-controls");

    productDiv.classList.remove("active");
    addToCartButton.style.display = "flex";
    quantityControls.style.display = "none";
    quantityText.textContent = "1";
  }

  updateCartTotal();
}

function updateQuantity(product, change) {
  const { name, price } = product;
  const existingProductEl = findCartProductElement(name);

  if (existingProductEl) {
    const quantityEl = existingProductEl.querySelector(".cart-product-quantity");
    const totalPriceEl = existingProductEl.querySelector(".cart-product-total-price");
    let currentQuantity = Number(quantityEl.textContent.replace("x", "")) + change;

    if (currentQuantity <= 0) {
      deleteProduct(product, existingProductEl);
    } else {
      quantityEl.textContent = `${currentQuantity}x`;
      totalPriceEl.textContent = `$${(currentQuantity * price).toFixed(2)}`;
      updateCartArray(
        cartProductsArray.map((p) => (p.name === name ? { ...p, quantity: currentQuantity } : p))
      );
    }

    syncProductGrid(name, currentQuantity);
    updateCartTotal();
  }
}

function updateCartTotal() {
  const cartTotalEl = document.querySelector(".cart-total-number");
  const cartProductCountEl = document.getElementById("cart-product-count");
  let total = 0;
  let cartProductCount = 0;

  Array.from(cartContentEl.getElementsByClassName("cart-product")).forEach((productEl) => {
    const quantity = Number(
      productEl.querySelector(".cart-product-quantity").textContent.replace("x", "")
    );
    const productTotal = parseFloat(
      productEl.querySelector(".cart-product-total-price").textContent.replace("$", "")
    );
    cartProductCount += quantity;
    total += productTotal;
  });

  cartProductCountEl.textContent = cartProductCount;
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
  toggleCartVisibility();
}

function showQuantityControls(productClicked) {
  const productDiv = productClicked.target.closest(".product");
  productDiv.classList.add("active");
  productDiv.querySelector(".add-to-cart-btn").style.display = "none";
  productDiv.querySelector(".quantity-controls").style.display = "flex";
}

function toggleCartVisibility() {
  const cartLowerEl = document.querySelector(".cart-lower");
  const emptyCartContentEl = document.querySelector(".cart-empty-content");
  const isEmpty = cartProductsArray.length === 0;

  cartLowerEl.style.display = isEmpty ? "none" : "flex";
  emptyCartContentEl.style.display = isEmpty ? "flex" : "none";
}

function findCartProductElement(name) {
  return Array.from(cartContentEl.getElementsByClassName("cart-product")).find(
    (el) => el.querySelector(".cart-product-name").textContent === name
  );
}

function syncProductGrid(name, quantity) {
  const productDiv = Array.from(document.getElementsByClassName("product")).find(
    (el) => el.querySelector(".product-name").textContent === name
  );

  if (productDiv) {
    const quantityText = productDiv.querySelector(".quantity-controls .quantity");
    const addToCartButton = productDiv.querySelector(".add-to-cart-btn");
    const quantityControls = productDiv.querySelector(".quantity-controls");

    if (quantity <= 0) {
      productDiv.classList.remove("active");
      addToCartButton.style.display = "flex";
      quantityControls.style.display = "none";
      quantityText.textContent = 1;
    } else {
      productDiv.classList.add("active");
      addToCartButton.style.display = "none";
      quantityControls.style.display = "flex";
      quantityText.textContent = quantity;
    }
  }
}

function updateCartArray(updatedCart) {
  cartProductsArray.length = 0;
  cartProductsArray.push(...updatedCart);
  localStorage.setItem("user_cart_products", JSON.stringify(cartProductsArray));
}

function clearCart() {
  updateCartArray([]);
  const productDivs = Array.from(document.getElementsByClassName("cart-product"));
  productDivs.forEach((productDiv) => {
    const productName = productDiv.querySelector(".cart-product-name").textContent;
    syncProductGrid(productName, 0);
    productDiv.remove();
  });
  updateCartTotal();
  toggleCartVisibility();
}

function renderCartOnPageLoad() {
  if (cartProductsArray.length > 0) {
    toggleCartVisibility();
    cartProductsArray.forEach(createCartProduct);
  }

  const confirmOrderBtn = document.querySelector(".cart-order-confirm-btn");
  confirmOrderBtn.addEventListener("click", () => {
    createOrder();
  });
}

renderCartOnPageLoad();

export {
  addToCart,
  updateQuantity,
  showQuantityControls,
  toggleCartVisibility,
  syncProductGrid,
  updateCartArray,
  clearCart,
};
