const cartContentEl = document.getElementById("cart-content");

function addToCart(productClicked, product) {
  const existingProductEl = Array.from(
    cartContentEl.getElementsByClassName("cart-product")
  ).find(
    (el) => el.querySelector(".cart-product-name").textContent === product.name
  );

  if (existingProductEl) {
    updateQuantity(product, 1);
    showQuantityControls(productClicked);
  } else {
    createCartProduct(product);
    showQuantityControls(productClicked);
  }
}

function createCartProduct(product) {
  const { image, name, price } = product;

  const cartProductDiv = document.createElement("div");
  cartProductDiv.classList.add("cart-product");

  cartProductDiv.innerHTML = `
        <div class="cart-product-details-wrapper">
        <img class="cart-product-image" src="${image.thumbnail}" alt="${name}">
        <div class="cart-product-details">
          <p class="cart-product-name">${name}</p>
          <div class="cart-product-quantity_price">
            <p class="cart-product-quantity">1x</p>
            <p class="cart-product-default-price">@ $${price.toFixed(2)}</p>
            <p class="cart-product-total-price">$${price.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <button class="cart-remove-product-btn">
        <img src="assets/images/icon-remove-item.svg" alt="Remove item" />
      </button>
  `;

  const removeBtn = cartProductDiv.querySelector(".cart-remove-product-btn");

  removeBtn.addEventListener("click", () => {
    deleteProduct(product, cartProductDiv);
  });
  cartContentEl.appendChild(cartProductDiv);
  updateCartTotal();
}

function deleteProduct(product, cartProductDiv) {
  const {name} = product;
  cartProductDiv.remove();
  const productDiv = Array.from(
    document.getElementsByClassName("product")
  ).find((el) => el.querySelector(".product-name").textContent === name);

  if (productDiv) {
    const addToCartButton = productDiv.querySelector(".add-to-cart-btn");
    const quantityControls = productDiv.querySelector(".quantity-controls");
    const quantityText = productDiv.querySelector(
      ".quantity-controls .quantity"
    );
      quantityText.textContent = 1;
      addToCartButton.style.display = "flex";
      quantityControls.style.display = "none";
  }
  updateCartTotal();
}


function updateQuantity(product, change) {
  const { name, price } = product;

  const existingProductEl = Array.from(
    cartContentEl.getElementsByClassName("cart-product")
  ).find((el) => el.querySelector(".cart-product-name").textContent === name);

  if (existingProductEl) {
    const quantityEl = existingProductEl.querySelector(
      ".cart-product-quantity"
    );
    const totalPriceEl = existingProductEl.querySelector(
      ".cart-product-total-price"
    );

    let currentQuantity = Number(quantityEl.textContent.replace("x", ""));
    currentQuantity += change;

    if (currentQuantity <= 0) {
      existingProductEl.remove();
    } else {
      quantityEl.textContent = `${currentQuantity}x`;
      totalPriceEl.textContent = `$${(currentQuantity * price).toFixed(2)}`;
    }

    // Sync the quantity controls in the product grid
    const productDiv = Array.from(
      document.getElementsByClassName("product")
    ).find((el) => el.querySelector(".product-name").textContent === name);

    if (productDiv) {
      const quantityText = productDiv.querySelector(
        ".quantity-controls .quantity"
      );
      const addToCartButton = productDiv.querySelector(".add-to-cart-btn");
      const quantityControls = productDiv.querySelector(".quantity-controls");

      if (currentQuantity <= 0) {
        // Hide quantity controls and show "Add to Cart" button
        addToCartButton.style.display = "flex";
        quantityControls.style.display = "none";
      } else {
        // Display quantity controls so it displays it when page loads on products in cart.
        addToCartButton.style.display = "none";
        quantityControls.style.display = "flex";
        quantityText.textContent = currentQuantity;
      }
    }

    updateCartTotal();
  }
}

function updateCartTotal() {
  const cartContentEl = document.getElementById("cart-content");
  const cartTotalEl = document.querySelector(".cart-total-number");
  const cartProductCountEl = document.getElementById("cart-product-count");

  let cartProductCount = Number((cartProductCountEl.textContent = 0));
  let total = 0;
  const productEls = cartContentEl.getElementsByClassName("cart-product");
  Array.from(productEls).forEach((productEl) => {
    const quantityEl = productEl.querySelector(".cart-product-quantity");
    let currentQuantity = Number(quantityEl.textContent.replace("x", ""));
    cartProductCount += currentQuantity;
    cartProductCountEl.textContent = cartProductCount;

    const totalPriceEl = productEl.querySelector(".cart-product-total-price");
    const productTotal = parseFloat(totalPriceEl.textContent.replace("$", ""));
    total += productTotal;
  });

  cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function showQuantityControls(productClicked) {
  const addToCartButton = productClicked.target.closest(".add-to-cart-btn");
  const productBtnContainer = addToCartButton.parentElement;
  const quantityControls =
    productBtnContainer.querySelector(".quantity-controls");

  addToCartButton.style.display = "none";
  quantityControls.style.display = "flex";
}

function hideQuantityControls(productClicked) {
  console.log(productClicked);
  const addToCartButton = productClicked.target.closest(".add-to-cart-btn");
  const productBtnContainer = addToCartButton.parentElement;
  const quantityControls =
    productBtnContainer.querySelector(".quantity-controls");

  addToCartButton.style.display = "flex";
  quantityControls.style.display = "none";
}

export {
  addToCart,
  updateQuantity,
  showQuantityControls,
  hideQuantityControls,
};
