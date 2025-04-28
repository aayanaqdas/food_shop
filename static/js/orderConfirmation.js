const closeBtn = document.querySelector(".order-close-btn");

closeBtn.addEventListener("click", toggleOrderModalVisibility);

function toggleOrderModalVisibility() {
  const modalContainer = document.querySelector(".order-confirm-modal-container");
  const orderProductsContainer = document.getElementById("order-products");
  if (modalContainer.style.display === "flex") {
    modalContainer.style.display = "none";
    document.body.style.overflow = "visible";
    orderProductsContainer.innerHTML = "";
  } else {
    modalContainer.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function createOrderedProducts() {
  const cartProducts = JSON.parse(localStorage.getItem("user_cart_products"));
  const orderProductsContainer = document.getElementById("order-products");
  const orderTotalEl = document.querySelector(".order-total-number");
  let totalOrderPrice = 0;

  cartProducts.forEach((product) => {
    const { name, price, thumbnail_image, quantity } = product;
    const formatPrice = Number(price).toFixed(2);
    const totalProductPrice = formatPrice * quantity;
    totalOrderPrice += totalProductPrice;

    const productDiv = document.createElement("div");
    productDiv.classList.add("order-product");

    productDiv.innerHTML = `
                <div class="order-product-details-wrapper">
                  <div class="order-product-img_details">
                    <img class="order-product-image" src="${thumbnail_image}" alt="${name}">
                    <div class="order-product-details">
                      <p class="order-product-name">${name}</p>
                      <div class="order-product-quantity_price">
                        <p class="order-product-quantity">${quantity}x</p>
                        <p class="order-product-default-price">@ $${formatPrice}</p>
                      </div>
                    </div>
                  </div>
                  <p class="order-product-total-price">$${totalProductPrice.toFixed(2)}</p>
                </div>     
        `;

    orderProductsContainer.appendChild(productDiv);
  });
  orderTotalEl.textContent = `$${totalOrderPrice.toFixed(2)}`;
}

export { createOrderedProducts, toggleOrderModalVisibility };
