//Traigo los elementos del HTML y los guardo en constantes
const form = document.getElementById("form");
const btnSubmit = document.getElementById("submit");
const name1 = document.getElementById("name1");
const name2 = document.getElementById("name2");
const lastname1 = document.getElementById("lastname1");
const lastname2 = document.getElementById("lastname2");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const userId = document.getElementById("userId");
const alertDiv = document.getElementById("alertDiv");

//Traigo los elementos que tengo en el local storage y se los asigno a cada constante
email.value = localStorage.getItem("userId");
name1.value = localStorage.getItem("userName1");
name2.value = localStorage.getItem("userName2");
lastname1.value = localStorage.getItem("userLastname1");
lastname2.value = localStorage.getItem("userLastname2");
phone.value = localStorage.getItem("userPhone");
userId.innerHTML = localStorage.getItem("userId");
{}
//defino qué va a hacer mi evento click del botón submit
btnSubmit.addEventListener('click', (e) => {
    //calcelo el evento submit para que no se reinicie el código
    e.preventDefault()
    //agrego la clase para validar el formulario
    form.classList.add("was-validated");
    //si el formulario es válido, guardo en el local los valores que tengo en los input,
    //modifico el correo que muestro en el botón desplegable y ejecuto el alert
     if(form.checkValidity()){
        localStorage.setItem("userName1", name1.value);
        localStorage.setItem("userName2", name2.value);
        localStorage.setItem("userLastname1", lastname1.value);
        localStorage.setItem("userLastname2", lastname2.value);
        localStorage.setItem("userId", email.value);
        localStorage.setItem("userPhone", phone.value);
        userId.innerText = email.value;
        changesSaved("Se guardaron los cambios correctamente.", 0);
    }  
});

