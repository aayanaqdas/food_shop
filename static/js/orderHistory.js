async function fetchOrders() {
    try {
      const response = await fetch('/api/order_history');
      const data = await response.json();

      if (data.status === 'success') {
        const orders = data.orders;
        console.log(orders)
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '';

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
            const {product_id, name, tablet_image, quantity, total_price} = product;
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
              <img src="${tablet_image}" alt="${name}" />
              <p>${name}</p>
              <p>Quantity: ${quantity}</p>
              <p>Total Price: $${total_price}</p>
              
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