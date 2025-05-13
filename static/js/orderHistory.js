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
          const orderDiv = document.createElement('div');
          orderDiv.classList.add('order');
          orderDiv.innerHTML = `
            <div class="order-summary">
              <p>Order ID: ${order.order_id}</p>
              <p>Total: $${order.order_total}</p>
              <p>Date: ${order.order_date}</p>
              <button class="order-details-btn">View Details</button>
            </div>
            <div class="order-details" style="display: none;"></div>
          `;
          const detailsBtn = orderDiv.querySelector(".order-details-btn")
          detailsBtn.addEventListener("click", () => fetchOrderDetails(order.order_id, detailsBtn))
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
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
              <img src="${product.thumbnail_image}" alt="${product.name}" />
              <p>${product.name}</p>
              <p>Quantity: ${product.quantity}</p>
              <p>Total Price: $${product.total_price}</p>
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