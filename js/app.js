let ultimaSalida = null;
const dispositivos = [];
const circuitoContainer = document.getElementById("circuitoContainer");
const inputDB = document.getElementById("inputDB");
const btnAgregarDispositivo = document.getElementById("btnAgregarDispositivo");
const btnCalcularSalida = document.getElementById("btnCalcularSalida");

//FUNCION PARA LOS HEADERS
document.addEventListener("DOMContentLoaded", function () {
    fetch("./componentes/header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            personalizarHeader();
        })
        .catch(error => console.error("Error al cargar el header:", error));
});

function personalizarHeader() {
    const navList = document.getElementById("nav-list");
    navList.innerHTML = ""; 

    const path = window.location.pathname;
    const isIndex = path.endsWith("/") || path.endsWith("index.html");
    const isTeoria = path.includes("teoria.html");
    const isCircuito = path.includes("circuito.html");

    let enlaces = [];

    if (isIndex) {
        enlaces = [
            { texto: "Teoría", href: "teoria.html" },
            { texto: "Características", href: "#info" },
            { texto: "Calculadora", href: "circuito.html" }
        ];
    } else if (isTeoria) {
        enlaces = [
            { texto: "Inicio", href: "index.html" },
            { texto: "Calculadora", href: "circuito.html" }
        ];
    } else if (isCircuito) {
        enlaces = [
            { texto: "Inicio", href: "index.html" },
            { texto: "Teoría", href: "teoria.html" }
        ];

        document.getElementById("header").classList.add("header-dark");
    }

    enlaces.forEach(enlace => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${enlace.href}">${enlace.texto}</a>`;
        navList.appendChild(li);
    });
}

// FUNCION PARA EL FOOTER
document.addEventListener("DOMContentLoaded", function () {
    fetch("./componentes/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el footer:", error));
});

// CALCULADORA
btnCalcularSalida.addEventListener("click", () => {
    calcularSalida(true);

    const seccionResultado = document.getElementById("resultadoFinal");
    if (seccionResultado) {
        seccionResultado.scrollIntoView({ behavior: "smooth" });
    }
});

document.getElementById("inputValor").addEventListener("input", () => {
    const nuevoValor = parseFloat(document.getElementById("inputValor").value);

    if (dispositivos.length > 0 && !isNaN(nuevoValor) && nuevoValor > 0) {
        dispositivos[0].valorEntrada = nuevoValor;
        calcularSalida(false);
    }
});

document.getElementById("selectMagnitud").addEventListener("change", () => {
    const nuevaMagnitud = document.getElementById("selectMagnitud").value;

    if (dispositivos.length > 0) {
        if (dispositivos.some(d => d.magnitud !== nuevaMagnitud)) {
            // Actualizamos la magnitud de todos los dispositivos
            dispositivos.forEach(d => d.magnitud = nuevaMagnitud);
            calcularSalida(false);
        }
    }
});

document.getElementById("btnAgregarDispositivo").addEventListener("click", () => {
    if (dispositivos.length >= 5) {
        alert("Máximo 5 dispositivos permitidos.");
        return;
    }

    const db = parseFloat(document.getElementById("inputDB").value);
    const magnitud = document.getElementById("selectMagnitud").value;
    const tipo = document.getElementById("selectTipo").value;

    if (isNaN(db)) {
        alert("Ingrese un valor de dB válido.");
        return;
    }

    if (dispositivos.length > 0 && dispositivos[0].magnitud !== magnitud) {
        alert("Todos los dispositivos deben compartir la misma magnitud.");
        return;
    }

    const valorEntrada = dispositivos.length === 0
        ? parseFloat(document.getElementById("inputValor").value)
        : ultimaSalida;

    if (isNaN(valorEntrada) || valorEntrada <= 0) {
        alert("La entrada del primer dispositivo debe ser un valor válido.");
        return;
    }

    dispositivos.push({ db, valorEntrada, magnitud, tipo, salida: null });

    calcularSalida(false);
    renderizarCircuito(false);
});

function eliminarDispositivo(index) {
    dispositivos.splice(index, 1);
    renderizarCircuito();

    if (dispositivos.length === 0) {
        document.getElementById("inputValor").disabled = false;
        ultimaSalida = null;
        document.getElementById("resultado").innerText = "";
    } else {
        calcularSalida(false);
    }
}

function calcularSalida(mostrarSubtotales = true) {
    if (dispositivos.length === 0) {
        alert("Agrega al menos un dispositivo.");
        return;
    }

    let valorActual = parseFloat(document.getElementById("inputValor").value);
    const magnitud = dispositivos[0].magnitud;
    const divisor = magnitud === "potencia" ? 10 : 20;

    dispositivos.forEach((dispositivo, index) => {
        dispositivo.valorEntrada = valorActual;

        const signo = dispositivo.tipo === "atenuador" ? -1 : 1;
        const factor = signo * (dispositivo.db / divisor);
        const suma = Math.log10(valorActual) + factor;
        valorActual = Math.pow(10, suma);

        dispositivo.salida = valorActual;
    });

    ultimaSalida = valorActual;

    renderizarCircuito(mostrarSubtotales);

    document.getElementById("resultado").innerText =
        ` ${formatearNumero(valorActual)} ${unidadSimbolo(magnitud)}`;
}

function renderizarCircuito(mostrarSubtotales) {
    circuitoContainer.innerHTML = "";

    dispositivos.forEach((dispositivo, index) => {
        const div = document.createElement("div");
        div.className = "dispositivo";

        div.innerHTML = `
            <div class="icono">${dispositivo.tipo === "amplificador" ? "🔊" : "🔇"}</div>
            <div class="tipo">${dispositivo.tipo.charAt(0).toUpperCase() + dispositivo.tipo.slice(1)}</div>
            <div class="valor">${dispositivo.db} dB (${dispositivo.magnitud})</div>
            ${mostrarSubtotales && dispositivo.salida !== null ? `
                <div class="subtotal">Entrada: ${dispositivo.valorEntrada.toFixed(4)} ${unidadSimbolo(dispositivo.magnitud)}</div>
                <div class="subtotal">Subtotal: ${dispositivo.salida.toFixed(4)} ${unidadSimbolo(dispositivo.magnitud)}</div>
            ` : ""}
        `;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btnEliminar";
        btnEliminar.addEventListener("click", () => eliminarDispositivo(index));

        div.appendChild(btnEliminar);
        circuitoContainer.appendChild(div);

        if (index !== dispositivos.length - 1) {
            const conector = document.createElement("div");
            conector.className = "conector";
            circuitoContainer.appendChild(conector);
        }
    });

    if (!mostrarSubtotales) {
        document.getElementById("resultado").innerText = "--";
    }
}

// FUNCIONES AUXILIARES
function unidadSimbolo(magnitud) {
    switch (magnitud) {
        case "tension": return "V";
        case "corriente": return "A";
        case "potencia": return "W";
        default: return "";
    }
}

function formatearNumero(numero) {
  // Fijamos 4 decimales, pero quitamos ceros innecesarios
  return parseFloat(numero.toFixed(4)).toString();
}
