//declaro constantes con elementos HTML
const email = document.getElementById("email");
const contraseña = document.getElementById("contraseña");
const ingresar = document.getElementById("ingresar");
const alertDiv = document.getElementById("alertDiv");

//evento click del botón ingresar
ingresar.addEventListener("click", function() {
    //si los campos email y contraseña no están vacíos cargo los datos en el local y redirijo a la página de inicio
    if (email.value.length >= 1 && contraseña.value.length >= 1) {
        localStorage.setItem("userId", email.value);
        localStorage.setItem("cartID", 25801);
        window.location = "main.html"
    } else {
        //si email o contraseña están vacíos muestro un alert 
        changesSaved("Debe ingrasar su usuario y contraseña.", 1);
    }
});
