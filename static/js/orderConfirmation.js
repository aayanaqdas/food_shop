import { clearCart } from "./cart.js";

async function createOrder() {
  const cartProducts = JSON.parse(localStorage.getItem("user_cart_products"));

  if (!cartProducts || cartProducts.length === 0) {
    console.error("Cart is empty. Cannot create an order.");
    return;
  }

  try {
    const response = await fetch("/api/create_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_products: cartProducts,
      }),
    });

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 401) {
        console.error("User not logged in. Redirecting to login page...");
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        console.error("Error creating order:", errorData.message);
      }
      return;
    }

    const data = await response.json();

    if (data.status === "success") {
      console.log(data.message);
      console.log("Order ID:", data.order_id);
      createOrderedProducts(data.order_id);
      toggleOrderModalVisibility();
      clearCart();
    } else {
      console.error("Failed to create order:", data.message);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}


function createOrderedProducts(order_id) {
  const cartProducts = JSON.parse(localStorage.getItem("user_cart_products"));
  const orderIdEl = document.querySelector(".order-confirm-id");
  const orderProductsContainer = document.getElementById("order-products");
  const orderTotalEl = document.querySelector(".order-total-number");
  let totalOrderPrice = 0;

  orderIdEl.textContent = "#" + order_id;

  cartProducts.forEach((product) => {
    const { name, price, thumbnail_image, quantity } = product;
    const totalProductPrice = Number(price) * quantity;
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
                        <p class="order-product-default-price">@ $${price}</p>
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


export { createOrder };
