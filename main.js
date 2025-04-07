async function fetchProductData() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    createProductElement(data);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function createProductElement(productData) {
  const productsGrid = document.getElementById("productsGrid");

  productData.forEach((product) => {
    const { image, name, category, price } = product;

    const imagePath = window.innerWidth <= "570" ? image.mobile : image.desktop;

    // Create product container
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    // Create product image
    const productImage = document.createElement("img");
    productImage.classList.add("product-image");
    productImage.src = imagePath;
    productImage.alt = `Image of ${name}`;
    productDiv.appendChild(productImage);

    // Create product button container
    const productBtnContainer = document.createElement("div");
    productBtnContainer.classList.add("product-btn-container");

    // Create add-to-cart button
    const addToCartButton = document.createElement("button");
    addToCartButton.classList.add("add-to-cart-btn");
    const buttonIcon = document.createElement("img");
    buttonIcon.src = "/assets/images/icon-add-to-cart.svg";
    buttonIcon.alt = "Add to cart svg";
    addToCartButton.appendChild(buttonIcon);
    addToCartButton.appendChild(document.createTextNode("Add to cart"));

    addToCartButton.addEventListener("click", (event) =>
      addToCart(event, product)
    );

    productBtnContainer.appendChild(addToCartButton);

    // Create quantity controls
    const quantityControls = document.createElement("div");
    quantityControls.classList.add("quantity-controls");

    const decrementButton = document.createElement("button");
    decrementButton.classList.add("decrement-btn");
    const decrementIcon = document.createElement("img");
    decrementIcon.src = "assets/images/icon-decrement-quantity.svg";
    decrementIcon.alt = "Decrement quantity";
    decrementButton.appendChild(decrementIcon);
    quantityControls.appendChild(decrementButton);

    const quantityText = document.createElement("p");
    quantityText.classList.add("quantity");
    quantityControls.appendChild(quantityText);

    const incrementButton = document.createElement("button");
    incrementButton.classList.add("increment-btn");
    const incrementIcon = document.createElement("img");
    incrementIcon.src = "assets/images/icon-increment-quantity.svg";
    incrementIcon.alt = "Increment quantity";
    incrementButton.appendChild(incrementIcon);
    quantityControls.appendChild(incrementButton);

    productBtnContainer.appendChild(quantityControls);
    productDiv.appendChild(productBtnContainer);

    // Create product details container
    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

    // Create product category
    const productCategory = document.createElement("p");
    productCategory.classList.add("product-category");
    productCategory.textContent = category;
    productDetails.appendChild(productCategory);

    // Create product name
    const productName = document.createElement("p");
    productName.classList.add("product-name");
    productName.textContent = name;
    productDetails.appendChild(productName);

    // Create product price
    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = `$${price}`;
    productDetails.appendChild(productPrice);

    // Append product details to product container
    productDiv.appendChild(productDetails);

    // Append product container to products grid
    productsGrid.appendChild(productDiv);
  });
}

function addToCart(event, product) {
  console.log(event.target);
  console.log(product);
  const addToCartButton = event.target.closest(".add-to-cart-btn");
  const productBtnContainer = addToCartButton.parentElement;
  const quantityControls =
    productBtnContainer.querySelector(".quantity-controls");
  const incrementButton = quantityControls.querySelector(".increment-btn");
  const decrementButton = quantityControls.querySelector(".decrement-btn");
  const quantityEl = quantityControls.querySelector(".quantity");

  let quantity = 1;
  quantityEl.textContent = quantity;

  incrementButton.addEventListener("click", () => {
    quantity++;
    quantityEl.textContent = quantity;
    console.log(quantity);
  });

  decrementButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityEl.textContent = quantity;
      console.log(quantity);
    } else {
      if (addToCartButton.style.display === "none") {
        addToCartButton.style.display = "flex";
        if (quantityControls) {
          quantityControls.style.display = "none";
        }
      }
    }
  });
  if (addToCartButton.style.display !== "none") {
    // Hide the Add to Cart button
    addToCartButton.style.display = "none";

    // Show the quantity controls
    if (quantityControls) {
      quantityControls.style.display = "flex";
    }
  }
}

fetchProductData();
