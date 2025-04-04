
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

    // Create button
    const productButton = document.createElement("button");
    productButton.classList.add("product-btn");
    const buttonIcon = document.createElement("img");
    buttonIcon.src = "/assets/images/icon-add-to-cart.svg";
    buttonIcon.alt = "Add to cart svg";
    productButton.appendChild(buttonIcon);
    productButton.appendChild(document.createTextNode("Add to cart"));
    productDiv.appendChild(productButton);

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

fetchProductData();
