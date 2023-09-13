//Declaro constantes y variables
const container = document.getElementById("container-products");
const contCatName = document.getElementById("catName");
const inputSearch = document.getElementById("inputSearch");

const filterButton = document.getElementById("rangeFilterCount");
const cleanButton = document.getElementById("clearRangeFilter");
const buttonMinMax = document.getElementById("sortAsc");
const buttonMaxMin = document.getElementById("sortDesc");
const buttonSortCant = document.getElementById("sortByCount");
const ORDER_ASC_BY_COST = "min-max";
const ORDER_DESC_BY_COST = "max-min";
const ORDER_BY_PROD_COUNT = "Cant.";
let minCount = undefined;
let maxCount = undefined;

let productsList = [];
let categoryName = "";

//Función que ordena los productos
function sortProducts(criteria){
    container.innerHTML = "";
    let result = [];
    if (criteria === ORDER_ASC_BY_COST){
        //si el criterio de ordenación es por orden ascendente, se ordena la lista así según el costo
        result = productsList.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        //Si el criterio de ordenaión es por orden descendente, se ordena así la lista según el costo
        result = productsList.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        //si estamos ordenando según los más vendidos se ordena la lista según soldCount
        result = productsList.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
    return result;   
}
//Función que muestra los productos de la categoría
function showProductList(list) {
    for (let i=0; i < list.length; i++) {
        //declaro i =0, lo incremento en 1 por cada bucle, y se va a ejecutar hasta que i sea más corto que el largo de la lista de productos 
        let product = list[i];
        let containerProducts = "";
        //si no hay filtros a aplicar se muestran los productos 
        if (((minCount == undefined) || (minCount != undefined && product.cost >= minCount)) &&
        ((maxCount == undefined) || (maxCount != undefined && product.cost <= maxCount))){
            containerProducts = 
                `<div onclick="setProductID(${product.id})"class="list-group-item list-group-item-action cursor-active">
                    <div class="row">
                        <div class="col-3">
                            <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                                <small class="text-muted">${product.soldCount} vendidos</small>
                            </div>
                            <p class="mb-1">${product.description}</p>
                        </div>
                    </div>
                </div>`;
        }
        container.innerHTML += containerProducts;
    }
}
//Evento que se ejecuta cuando los elementos del html está cargados, se trae del local el id de usuario y se carga el json de los productos
document.addEventListener("DOMContentLoaded", function(e){
   document.getElementById("userId").innerHTML = localStorage.getItem("userId");
   getJSONData(GET_PRODUCTS_URL).then(function(resultObj){
    productsList = resultObj.data.products;
    categoryName = resultObj.data.catName;
    contCatName.innerHTML += `${categoryName}`;
    showProductList(productsList);
   });
});
//El botón de Min a Máx le pasa a la función de ordenar, la constante y muestra los productos
buttonMinMax.addEventListener("click", (e) => {
    sortProducts(ORDER_ASC_BY_COST);
    showProductList(productsList);
});
//El botón de Máx a Min le pasa a la función de ordenar, la constante y muestra los productos
buttonMaxMin.addEventListener("click", (e) => {
    sortProducts(ORDER_DESC_BY_COST);
    showProductList(productsList);
});
//El botón de ordenar por cantidad le pasa la constante a la función de ordenar y muestra los productos
buttonSortCant.addEventListener("click", (e) => {
    sortProducts(ORDER_BY_PROD_COUNT);
    showProductList(productsList);
});
//El botón de filtrar establece minCount y maxCount según el valor que tienen los inputs para comparar en showProductList y ordenar los productos
filterButton.addEventListener("click", function() {
    minCount = document.getElementById("rangeFilterCountMin").value;
    maxCount = document.getElementById("rangeFilterCountMax").value;
    container.innerHTML = "";

    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
        minCount = parseInt(minCount);
    } else{
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
        maxCount = parseInt(maxCount);
    } else{
        maxCount = undefined;
    }

    showProductList(productsList);
});
//Este botón limpia los inputs de filtrado, deja vacío container y muestra la lista de productos sin filtrar ni ordenar
cleanButton.addEventListener("click", function(){
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    container.innerHTML = "";

    minCount = undefined;
    maxCount = undefined;

    showProductList(productsList);
});
//Función que filtra productos según el evento input
inputSearch.addEventListener("input", () => {
    let listInputFilter = productsList.filter((value) => value.name.toUpperCase().includes(inputSearch.value.toUpperCase()) || value.description.toUpperCase().includes(inputSearch.value.toUpperCase()));
    container.innerHTML = "";
    showProductList(listInputFilter);
})
//guardamos el id del producto al que queremos acceder con onclick y redirigimos a product info
function setProductID (id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}
