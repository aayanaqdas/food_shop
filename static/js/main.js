
window.onscroll = () => {
  const navEl = document.querySelector("nav");

  if(window.pageYOffset > 50){
    navEl.classList.add("nav-sticky");
  }
  else{
    navEl.classList.remove("nav-sticky");
  }
};

// Nav dropdown
document.addEventListener("click", (event) => {
  const userDropdown = document.querySelector(".user-dropdown .user-name");
  const dropdownMenu = document.querySelector(".user-dropdown .dropdown-menu");

  if (userDropdown && dropdownMenu) {
    if (!userDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove("active");
    }
  }
});





// async function addProductsToDb(){
//   try{
//     const response = await fetch("/api/add_products_db")
//     const data = await response.json()

//     console.log(data)

//   }
//   catch(error){
//     console.log(error)
//   }
// }

// addProductsToDb()