
window.onscroll = () => {
  const navEl = document.querySelector("nav");

  if(window.pageYOffset > 50){
    navEl.classList.add("nav-sticky");
  }
  else{
    navEl.classList.remove("nav-sticky");
  }
};
