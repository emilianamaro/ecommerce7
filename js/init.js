//constantes con las URL necesarias
const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";
const GET_PRODUCTS_URL = PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;
const GET_PRODUCTLIST_URL = PRODUCT_INFO_URL + localStorage.getItem("productID") + EXT_TYPE;
const GET_PRODUCTCOMMENT_URL = PRODUCT_INFO_COMMENTS_URL+ localStorage.getItem("productID") + EXT_TYPE;
const GET_CART_INFO_URL = CART_INFO_URL + localStorage.getItem("cartID") + EXT_TYPE;

//función que muestra la ruedita mientras carga la página
let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

//función que oculta la ruedita de carga
let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

//función para hacer el fetch de una url
let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//función que limpia el local cuando cerramos sesión
function signOff() {
  localStorage.clear();
} 

//función que añade el ID del carrito al local
function setCartId(id) {
  localStorage.setItem("cartID", id);
}

//función para mostrar un alert
function changesSaved(msj, opt) {
  //remuevo la clase que oculta el div y agrego el alert al html
  alertDiv.classList.remove("d-none");
  //si opt es 1 muestro una alerta en rojo
  if(opt === 1) {
    alertDiv.innerHTML = `
      <div class="alert alert-danger alert-dismissible d-flex justify-content-center" role="alert" id="alert">
          ${msj}
      </div>
  `;
  //si opt no es 1 muestro una alerta verde
  } else {
    alertDiv.innerHTML = `
      <div class="alert alert-success alert-dismissible d-flex justify-content-center" role="alert" id="alert">
          ${msj}
      </div>
  `;
  }
  //establezco el tiempo que va a pasar hasta que vuelva a añadir la clase que oculta el div y el alert
  setTimeout(() => {alertDiv.classList.add("d-none");
  alertDiv.innerHTML = "";}, 2500);
}