//Declaro constantes y variables
const container = document.getElementById("container");
const alertDiv = document.getElementById("alertDiv");

const htmlShipCost = document.getElementById("shipCost");
const htmlSubTtl = document.getElementById("subtotal");
const htmlTotal = document.getElementById("total");

const typePremium = document.getElementById("premium");
const typeExpress = document.getElementById("express");
const typeStandard = document.getElementById("standard");

const pagoCredito = document.getElementById("credito");
const pagoBancario = document.getElementById("bancaria");
const numTarj = document.getElementById("num");
const codSeguridad = document.getElementById("cod");
const venc = document.getElementById("vencimiento");
const numCuenta = document.getElementById("numCuenta");
const txtformaDePago = document.getElementById("formaDePago");
const btnSubmit = document.getElementById("submit");
const form = document.getElementById("form");
const closeModal = document.getElementById("closeModal");
const formModal = document.getElementById("formModal");
const selectFP = document.getElementById("selectFP");
const cancelModal = document.getElementById("cancelModal");
const confirmModal = document.getElementById("confirmModal");
const alertPlaceholder = document.getElementById("alertPlaceholder");
const alert = document.getElementById("alert");
const modalSubmit = document.getElementById("modalSubmit");

document.getElementById("userId").innerHTML = localStorage.getItem("userId");

let cartInfo = [];
let genSubtotal = 0;
let txtSubTotal = 0;
let textFormaDePago = "";

//Función del subtotal de cada producto en el carrito
function setSubtotal(id) {
    genSubtotal = 0;
    for (let item of cartInfo) {
        //accedo al subtotal y count del html
        let subTotal = document.getElementById(`subTotal${id}`);
        let count = document.getElementById(`count${id}`);
        if (item.id == id) {
            //si el id del item del array == al id que traje con onclick
            //determino que txtsubtotal = al costo unitario * el valor del campo count en el html
            txtSubTotal = item.unitCost * count.value;
            //muestro el subtotal en el html
            subTotal.innerHTML = `
                <b>${item.currency} ${txtSubTotal}</b>
            `;
            //le sumo ese subtotal al subtotal general
            genSubtotal = genSubtotal + txtSubTotal;
            //cambio en el array del carrito la cantidad del item
            item.count = count.value;
            localStorage.setItem("newProduct", JSON.stringify(cartInfo));
        } else {
            txtSubTotal = item.unitCost * item.count;
            genSubtotal = genSubtotal + txtSubTotal;
        }
    }
    subtotal();
    total();
}

//Función que muestra los productos que hay en el carrito
function showCartInfo() {
    container.innerHTML = "";
    if (cartInfo.length) {
        //Recoro el array del carrito y muestro cada item
        for (let item of cartInfo) {
            //Si currency es UYU lo paso a dólar con una función y lo redondeo
            if (item.currency == "UYU") {
                item.unitCost = Math.round(toDolar(item.unitCost));
                item.currency = "USD";
            }
            container.innerHTML += `
            <div class="row">
                <div class="col-2">
                    <img src="${item.image}" alt="Imagen ilustrativa" height="50px">
                </div>
                <div class="col-2">
                    ${item.name}
                </div>
                <div class="col-2">
                    USD ${item.unitCost}
                </div>
                <div class="col-2">
                    <input type="number" class="form-control" id="count${item.id}" oninput="setSubtotal(${item.id})" value="${item.count}" min ="1" max ="10" style="width: 85px" required>
                </div>
                <div class="col-2" id="subTotal${item.id}">
                    <b>USD ${item.unitCost * item.count}</b>
                </div>
                <div class="col-2 cursor-active" onclick="deleteProduct(${item.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                </div>
            </div>
        </div><hr><br>
    `;
            //Sumo los subtotales para el valor del subtotal general
            genSubtotal += (item.unitCost * item.count);
        }

    } else {
        container.innerHTML = `
        <div class="row d-flex justify-content-center">
            <div class="col-6">
                <h3>No hay artículos en su carrito.</h3>
            </div>
        </div>
        `;
    }


}

//Función que establece en el HTML el subtotal general
function subtotal() {
    //htmlSubTtl.innerHTML = "";
    htmlSubTtl.innerHTML = `USD ${genSubtotal}`;
}

//Función que muestra el total cuando seleccionamos el tipo de envío
function total() {
    let premium = Math.round(genSubtotal * 0.15);
    let express = Math.round(genSubtotal * 0.07);
    let standard = Math.round(genSubtotal * 0.05);
    if (typePremium.checked) {
        htmlShipCost.innerHTML = `USD ${premium}`;
        htmlTotal.innerHTML = `<b>USD ${genSubtotal + premium}</b>`;
    } else if (typeExpress.checked) {
        htmlShipCost.innerHTML = `USD ${express}`;
        htmlTotal.innerHTML = `<b>USD ${genSubtotal + express}</b>`;
    } else if (typeStandard.checked) {
        htmlShipCost.innerHTML = `USD ${standard}`;
        htmlTotal.innerHTML = `<b>USD ${genSubtotal + standard}</b>`;
    }
}

//Función que convierte pesos en dólares
function toDolar(pesos) {
    return pesos / 40;
}

//Función que maneja cada campo en forma de pago para habilitar o deshabilitar el que corresponda según esté seleccionado
function formaDePago() {
    if (pagoCredito.checked) {
        pagoBancario.required = false;
        pagoCredito.required = true;
        numCuenta.disabled = true;
        numCuenta.required = false;
        numTarj.disabled = false;
        numTarj.required = true;
        codSeguridad.disabled = false;
        codSeguridad.required = true;
        venc.disabled = false;
        venc.required = true;
        numCuenta.value = "";
        textFormaDePago = pagoCredito.value;

    } else if (pagoBancario.checked) {
        pagoBancario.required = true;
        pagoCredito.required = false;
        numCuenta.disabled = false;
        numCuenta.required = true;
        numTarj.disabled = true;
        numTarj.required = false;
        codSeguridad.disabled = true;
        codSeguridad.required = false;
        venc.disabled = true;
        venc.required = false;
        numTarj.value = "";
        codSeguridad.value = "";
        venc.value = "";
        textFormaDePago = pagoBancario.value;
    }
}

//Evento del botón submit
btnSubmit.addEventListener('click', (e) => {
    //prevengo que se reinicie el código js
    e.preventDefault()
    //añado esta clase para que el form se valide
    form.classList.add("was-validated");
    //Si es válido muestro el alert de que se realizó la compra
    if (form.checkValidity()) {
        changesSaved("La compra se realizó correctamente.", 0);
    }
});

//evento que cancela la forma de pago y pide que se ingrese para realizar la compra
cancelModal.addEventListener("click", () => {
    pagoBancario.checked = false;
    pagoCredito.checked = false;
    numCuenta.value = "";
    numTarj.value = "";
    codSeguridad.value = "";
    venc.value = "";
    txtformaDePago.innerHTML = `<p class="text-danger">Seleccione una forma de pago.</p>`;
    selectFP.innerHTML = `Seleccionar`;
});

//evento que confirma la forma de pago
confirmModal.addEventListener("click", () => {
    if (pagoBancario.checked || pagoCredito.checked) {
        txtformaDePago.classList.remove("text-danger");
        txtformaDePago.innerHTML = `<b><p class="text-success">${textFormaDePago}</p></b>`;
        selectFP.innerHTML = `Cambiar forma de pago.`;
    }
});

//Evento que se ejecuta cuando está todo el contenido HTML
document.addEventListener("DOMContentLoaded", () => {
    let local = localStorage.getItem("newProduct");
    if (!local) {
        //si no está el carrito en el local, lo traigo con getJSONData y lo guardo en el local
        getJSONData(GET_CART_INFO_URL).then((resultObj) => {
            cartInfo = resultObj.data.articles;
            localStorage.setItem("newProduct", JSON.stringify(cartInfo));
            showCartInfo();
            subtotal();
        });
    } else {
        //si el carrito está en el local, lo traigo y lo muestro.
        cartInfo = JSON.parse(localStorage.getItem("newProduct"));
        showCartInfo();
        subtotal();
    }

});
//función que elimina un producto del carrito
function deleteProduct(idNum) {
    //declaro un contador para saber la posición del itemen el array
    let cont = -1;
    for (let item of cartInfo) {
        //por cada item sumo  al contador y si el id = al id del item lo elimino del array
        cont++;
        if (idNum == item.id) {
            cartInfo.splice(cont, 1);
        }
    }
    //muestro el alert y seteo el carrito nuevo en el local
    changesSaved("Se eliminó el artículo del carrito.", 0);
    localStorage.setItem("newProduct", JSON.stringify(cartInfo));
    showCartInfo();
    setSubtotal();
    subtotal();
}