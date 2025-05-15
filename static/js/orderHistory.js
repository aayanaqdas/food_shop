async function fetchOrders() {
    try {
      const response = await fetch('/api/order_history');
      const data = await response.json();

      if (data.status === 'success') {
        const orders = data.orders;
        
        console.log(orders)
        const noOrdersText = document.querySelector(".orders-default-text")
        orders.length > 0 ? noOrdersText.style.display = "none" : "block";
        const orderList = document.getElementById('order-list');

        orders.forEach(order => {
            const {order_id, order_total, order_date} = order;
          const orderDiv = document.createElement('div');
          orderDiv.classList.add('order');
          orderDiv.innerHTML = `
            <div class="order-summary-wrapper">
              <div class="order-summary">
                <p class="order-date">${new Date(order_date).toLocaleDateString('en-GB')}</p>
                <p class="order-id">Order ID: <span>#${order_id}</span></p>
                <p class="order-total">Total: <span>$${order_total}</span></p>
              </div>
              <button class="order-details-btn">View Details</button>
            </div>
            <div class="order-details" style="display: none;"></div>
          </div>
          `;
          const detailsBtn = orderDiv.querySelector(".order-details-btn")
          detailsBtn.addEventListener("click", () => fetchOrderDetails(order_id, detailsBtn))
          orderList.appendChild(orderDiv);
        });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  async function fetchOrderDetails(orderId, button) {
    try {
      const response = await fetch(`/api/order_details?order_id=${orderId}`);
      const data = await response.json();

      if (data.status === 'success') {
        const detailsDiv = button.parentElement.nextElementSibling;
        detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';

        if (detailsDiv.innerHTML === '') {
          const products = data.products;
          console.log(products)
          products.forEach(product => {
            const {product_id, name, tablet_image, price, quantity, total_price} = product;
            const productDiv = document.createElement('div');
            productDiv.classList.add('order-product');
            productDiv.innerHTML = `
              <div class="order-product-details-wrapper">
                <div class="order-product-img_details">
                  <img class="order-product-image" src="${tablet_image}" alt="${name}">
                  <div class="order-product-details">
                    <p class="order-product-name">${name}</p>
                    <div class="order-product-quantity_price">
                      <p class="order-product-quantity">${quantity}x</p>
                      <p class="order-product-default-price">@ $${price}</p>
                    </div>
                  </div>
                </div>
                <p class="order-product-total-price">$${total_price}</p>
              </div>
              
            `;
            detailsDiv.appendChild(productDiv);
          });
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  }

  fetchOrders();