//Declaro constantes y variables
const container = document.getElementById("container");
const productNameHTML = document.getElementById("productName");
const productCostHTML = document.getElementById("productCost");
const productDescriptionHTML = document.getElementById("productDescription");
const productCategoryHTML = document.getElementById("productCategory");
const productSoldHTML = document.getElementById("productSold");
const productImageHTML = document.getElementById("productImage");
const commentsHTML = document.getElementById("comments");
const alertDiv = document.getElementById("alertDiv");
const inputModal = document.getElementById("inputNumber");
const modalBtnComprar = document.getElementById("modalBtnComprar");
const carousel = document.getElementById("carousel");

let productInfo = [];
let productComments = [];
let contComment = "";
let relatedProducts = "";
let cartInfo = [];
let shopList = JSON.parse(localStorage.getItem("newProduct"));

//Función que inserta cada campo del producto en el html
function showProductInfo() {
    productNameHTML.innerHTML = productInfo.name;
    productCostHTML.innerHTML = `${productInfo.currency} ${productInfo.cost}`;
    productDescriptionHTML.innerHTML = productInfo.description;
    productCategoryHTML.innerHTML = productInfo.category;
    productSoldHTML.innerHTML = productInfo.soldCount;
    commentsHTML.innerHTML = contComment;
}

//Evento que se ejecuta cuando se cargan los elementos del html
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("userId").innerHTML = localStorage.getItem("userId");
    //traigo la lista de productos del local
    getJSONData(GET_PRODUCTLIST_URL).then(function (resultObj) {
        productInfo = resultObj.data;
        let firstImg = 0;
        //Recorro el array de imágenes de cada producto para mostrarla  
        for (let image of productInfo.images) {
            if(firstImg == 0) {
                carousel.innerHTML += `
                <div class="carousel-item active" data-bs-interval="2500">
                    <img src="${image}" class="d-block w-100" alt="image">
                </div>`;
            firstImg = 1;
            } else {
                carousel.innerHTML += `
                <div class="carousel-item" data-bs-interval="3000">
                    <img src="${image}" class="d-block w-100" alt="image">
                </div>`;
            }
        }
        showProductInfo();
    });
    getJSONData(GET_PRODUCTCOMMENT_URL).then(function (resultObj) {
        productComments = resultObj.data;
        showComments();
    });
    if (!shopList) {
        //si no está el carrito cargado en el local lo cargo
        getJSONData(GET_CART_INFO_URL).then((resultObj) => {
            cartInfo = resultObj.data.articles;
            console.log(cartInfo);
            localStorage.setItem("newProduct", JSON.stringify(cartInfo));
        });
    }
});

//Función que muestra los comentarios
function showComments() {
    contComment = "";
    //recorro el array de comentarios
    for (let comment of productComments) {
        let score = "";
        if (comment.score == 5) {
            //si la calificación es 5 muestro 5 estrellas checked
            for (let i = 0; i < 5; i++) {
                score += `
                <span class="fa fa-star checked"></span>
                `;
            }
            //Si la calificación es diferente a 5
        } else {
            //declaro que i vale 0 y que aumente en 1 en cada bucle, hasta que i sea menor que la calificación, por cada punto agrego una estrella checked
            for (let i = 0; i < comment.score; i++) {
                score += `
                    <span class="fa fa-star checked"></span>
                `;
            }
            //declaro que i = al puntaje que tenga, y mientras sea menor que 5 sumo una estrella sin checked
            for (let i = comment.score; i < 5; i++) {
                score += `
                    <span class="fa fa-star"></span>
                `;
            }
        }
        //si hay comentarios los muestro
        if (productComments.length > 0) {
            contComment += `
            <li class="list-group-item">
                <div class="col-md-4 d-flex w-100 justify-content-between" >
                    <div>
                        <b>${comment.user}</b> -
                        ${comment.dateTime} -
                        ${score}
                    </div>
                </div>
                <div >
                    ${comment.description}
                </div>
            </li> 
            `;
        }
    }
    //Si no hay comentarios, lo muestro
    if (productComments.length < 1) {
        contComment = ` 
            <p>No hay comentarios sobre este artículo.</p>
            `;
    }
    showProductInfo();
    showRelatedProducts();
}

//Función que publica nuevo comentario 
function postComment() {
    let txtComment = document.getElementById("textComment");
    //se accede a la fecha/hora y se guarda en variables cada valor 
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    if (txtComment.value) {
        //Si hay texto en el input donde se escribe el comentario se guarda en el local
        localStorage.setItem("txtComment", txtComment.value);
        changesSaved("Su comentario ha sido enviado con éxito.", 0);
        txtComment.value = "";
        //Se accede al valor del select para guardar en el array de comentarios el nuevo comentario completo
        let select = document.getElementById("score");
        productComments.push(
            {
                product: productInfo.id,
                score: select.selectedIndex,
                description: localStorage.getItem("txtComment"),
                user: localStorage.getItem("userId"),
                dateTime: year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
            }
        );
        select.selectedIndex = "0";
        showComments();
    } else {
        changesSaved("Por favor ingrese un comentario para enviar", 0);
    }
}
//Función que muestra los productos relacionados
function showRelatedProducts() {
    relatedProducts = productInfo.relatedProducts;
    let contRelatedProducts = document.getElementById("relatedProducts");
    contRelatedProducts.innerHTML = "";
    for (let comment of relatedProducts) {
        contRelatedProducts.innerHTML += `
            <div onclick="setProductID(${comment.id})" class= "list-group-item cursor-active col-4 m-2">
                <img src="${comment.image}" alt="${comment.name}" class=" img-fluid">
                <h5 class="p-3">${comment.name}</h5>
            </div>
        `;
    }
}
//Función que asigna el ID del producto en el local y redirige a la misma página para mostrar en nuevo producto
function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}
//función para habilitar el boton comprar cuando se ingresa una cantidad
function countModal() {
    modalBtnComprar.disabled = false;
}
//Función para comprar nuevos productos
function comprar() {
    //traigo el carrito del local
    let shopList = JSON.parse(localStorage.getItem("newProduct"));
    //si hay un valor en el input agrego el item al carrito con esa cantidad
    if (inputModal.value) {
        shopList.push(
            {
                "count": inputModal.value,
                "currency": productInfo.currency,
                "id": productInfo.id,
                "image": productInfo.images[0],
                "name": productInfo.name,
                "unitCost": productInfo.cost
            }
        );
        //muestro el alert de compra satisfactoria
        changesSaved(`Añadió ${inputModal.value} ${productInfo.name} a su carrito.`, 0);
        inputModal.value = "";
        modalBtnComprar.disabled = true;
        //setteo el carrito en el local
        localStorage.setItem("newProduct", JSON.stringify(shopList));
    } else {
        //si no hay un valor en el input muestro un mensaje de error y deshabilito el botón de comprar
        changesSaved("Debe ingresar una cantidad para realizar la compra.", 1);
        modalBtnComprar.disabled = true;
    }
}
//Función para borrar el input cuando cancelamos el modal
function cancel() {
    inputModal.value = "";
}