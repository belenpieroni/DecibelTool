let entradaDB = 0;
const dispositivos = [];

const inputDB = document.getElementById("inputDB");
const btnEntrada = document.getElementById("btnEntrada");
const tipoDispositivo = document.getElementById("tipoDispositivo");
const valorDispositivo = document.getElementById("valorDispositivo");
const magnitudDispositivo = document.getElementById("magnitudDispositivo");
const btnAgregarDispositivo = document.getElementById("btnAgregarDispositivo");
const circuitoContainer = document.getElementById("circuitoContainer");
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
    document.querySelectorAll("#nav-list li.extra").forEach(el => el.remove());

    const path = window.location.pathname;
    const isIndex = path.endsWith("/") || path.endsWith("index.html");

    if (isIndex) {
        let item = document.createElement("li");
        item.innerHTML = '<a href="#info">Características</a>';
        item.classList.add("extra");
        navList.appendChild(item);
    } else if (path.includes("teoria.html")) {
        let item = document.createElement("li");
        item.innerHTML = '<a href="circuito.html">Calculadora</a>';
        item.classList.add("extra");
        navList.appendChild(item);
    } else if (path.includes("circuito.html")) {
        let item = document.createElement("li");
        item.innerHTML = '<a href="circuito.html">Calculadora</a>';
        item.classList.add("extra");
        navList.appendChild(item);

        document.getElementById("header").classList.add("header-dark");
    }
}

let valorEntrada = 0;
let tipoMagnitudEntrada = "";

btnEntrada.addEventListener("click", () => {
  valorEntrada = parseFloat(inputDB.value);
  tipoMagnitudEntrada = magnitudDispositivo.value;

  if (isNaN(valorEntrada) || valorEntrada <= 0) {
    alert("Ingrese un valor físico válido mayor a 0.");
    return;
  }

  renderCircuito();
});


btnAgregarDispositivo.addEventListener("click", () => {
  if (dispositivos.length >= 5) {
    alert("Máximo 5 dispositivos permitidos.");
    return;
  }

  const tipo = tipoDispositivo.value;
  const valorDb = parseFloat(valorDispositivo.value);
  const magnitud = magnitudDispositivo.value;

  if (isNaN(valorDb)) {
    alert("Ingrese un valor en dB válido.");
    return;
  }

  dispositivos.push({ tipo, valorDb, magnitud });
  valorDispositivo.value = "";
  renderCircuito();
});



// btnCalcularSalida.addEventListener("click", () => {
//   if (isNaN(entradaDB)) {
//     alert("Primero ingrese los dB de entrada.");
//     return;
//   }

//   // Calculamos la salida final en escala lineal para después volver a dB
//   let valorLineal;

//   // Convertir la entrada en dB a valor lineal
//   if (dispositivos.length === 0) {
//     alert(`Valor final de salida: ${entradaDB.toFixed(2)} dB`);
//     return;
//   }

//   // Asumimos que el tipo de magnitud del primer dispositivo se usa para la entrada también (podemos cambiar esto si querés)
//   // Por seguridad, si no hay dispositivos, solo mostramos la entrada.
//   const magnitudPrimera = dispositivos[0].magnitud;

//   valorLineal = dBToLinear(entradaDB, magnitudPrimera);

//   // Aplicar cada dispositivo sobre el valor lineal
//   dispositivos.forEach((dispositivo) => {
//     if (dispositivo.tipo === "amplificador") {
//       valorLineal = valorLineal * linearGain(dispositivo.valor, dispositivo.magnitud);
//     } else {
//       valorLineal = valorLineal / linearGain(dispositivo.valor, dispositivo.magnitud);
//     }
//   });

//   // Volver a dB
//   const salidaDB = linearToDB(valorLineal, magnitudPrimera);

//   alert(`Valor final de salida: ${salidaDB.toFixed(2)} dB`);
//   renderCircuito();
// });

btnCalcularSalida.addEventListener("click", () => {
  if (isNaN(entradaDB)) {
    alert("Primero ingrese los dB de entrada.");
    return;
  }

  if (dispositivos.length === 0) {
    alert(`Valor final de salida: ${entradaDB.toFixed(2)} dB`);
    return;
  }

  let salidaDB = entradaDB;

  dispositivos.forEach((dispositivo) => {
    const signo = dispositivo.tipo === "amplificador" ? 1 : -1;
    salidaDB += signo * dispositivo.valor;
  });

  alert(`Valor final de salida: ${salidaDB.toFixed(2)} dB`);
  renderCircuito(salidaDB);
});


// Función para convertir dB a valor lineal según magnitud
//function dBToLinear(dB, magnitud) {
//  if (magnitud === "potencia") {
//    return Math.pow(10, dB / 10);
//  } else {
    // tensión o corriente
//    return Math.pow(10, dB / 20);
//  }
//}

// Función para convertir valor lineal a dB según magnitud
//function linearToDB(lineal, magnitud) {
//  if (magnitud === "potencia") {
//    return 10 * Math.log10(lineal);
//  } else {
//    return 20 * Math.log10(lineal);
//  }
//}

// Función para obtener ganancia lineal del dispositivo dado el valor en dB y la magnitud
//function linearGain(dB, magnitud) {
//  if (magnitud === "potencia") {
//    return Math.pow(10, dB / 10);
//  } else {
//    return Math.pow(10, dB / 20);
//  }
//}

// function renderCircuito() {
//   circuitoContainer.innerHTML = "";

//   if (isNaN(entradaDB)) return;

//   // Mostramos la entrada
//   const entradaDiv = document.createElement("div");
//   entradaDiv.className = "dispositivo";

//   const iconoEntrada = document.createElement("div");
//   iconoEntrada.className = "icono";
//   iconoEntrada.textContent = "📥";

//   const tipoEntrada = document.createElement("div");
//   tipoEntrada.className = "tipo";
//   tipoEntrada.textContent = "Entrada";

//   const valorEntrada = document.createElement("div");
//   valorEntrada.className = "valor";
//   valorEntrada.textContent = `${entradaDB} dB`;

//   entradaDiv.appendChild(tipoEntrada);
//   entradaDiv.appendChild(iconoEntrada);
//   entradaDiv.appendChild(valorEntrada);

//   circuitoContainer.appendChild(entradaDiv);

//   if (dispositivos.length === 0) return;

//   // Convertimos la entrada a lineal para poder hacer cálculos y mostrar subtotales
//   let valorLineal = dBToLinear(entradaDB, dispositivos[0].magnitud);

//   // Recorrer dispositivos mostrando subtotales
//   dispositivos.forEach((dispositivo, index) => {
//     const div = document.createElement("div");
//     div.className = "dispositivo";

//     const icono = document.createElement("div");
//     icono.className = "icono";
//     icono.textContent = dispositivo.tipo === "amplificador" ? "🔊" : "🔇";

//     const tipo = document.createElement("div");
//     tipo.className = "tipo";
//     tipo.textContent = dispositivo.tipo.charAt(0).toUpperCase() + dispositivo.tipo.slice(1);

//     const valor = document.createElement("div");
//     valor.className = "valor";
//     valor.textContent = `${dispositivo.valor} dB (${dispositivo.magnitud})`;

//     if (dispositivo.tipo === "amplificador") {
//       valorLineal *= linearGain(dispositivo.valor, dispositivo.magnitud);
//     } else {
//       valorLineal /= linearGain(dispositivo.valor, dispositivo.magnitud);
//     }

//     const subtotalDB = linearToDB(valorLineal, dispositivos[0].magnitud);

//     const subtotalDiv = document.createElement("div");
//     subtotalDiv.className = "subtotal";
//     subtotalDiv.textContent = `Subtotal: ${subtotalDB.toFixed(2)} dB`;

//     // Botón eliminar
//     const btnEliminar = document.createElement("button");
//     btnEliminar.textContent = "Eliminar";
//     btnEliminar.className = "btnEliminar";
//     btnEliminar.addEventListener("click", () => {
//       dispositivos.splice(index, 1);
//       renderCircuito();
//     });

//     div.appendChild(tipo);
//     div.appendChild(valor);
//     div.appendChild(icono);
//     div.appendChild(subtotalDiv);
//     div.appendChild(btnEliminar);

//     circuitoContainer.appendChild(div);

//     if (index !== dispositivos.length - 1) {
//       const conector = document.createElement("div");
//       conector.className = "conector";
//       circuitoContainer.appendChild(conector);
//     }
//   });

//   // Mostrar nodo de salida
//   const conectorFinal = document.createElement("div");
//   conectorFinal.className = "conector";
//   circuitoContainer.appendChild(conectorFinal);

//   const salida = document.createElement("div");
//   salida.className = "dispositivo";

//   const iconoSalida = document.createElement("div");
//   iconoSalida.className = "icono";
//   iconoSalida.textContent = "📤";

//   const tipoSalida = document.createElement("div");
//   tipoSalida.className = "tipo";
//   tipoSalida.textContent = "Salida";

//   const valorSalida = document.createElement("div");
//   valorSalida.className = "subtotal";

//   const salidaDB = linearToDB(valorLineal, dispositivos[0].magnitud);
//   valorSalida.textContent = `Total: ${salidaDB.toFixed(2)} dB`;

//   salida.appendChild(tipoSalida);
//   salida.appendChild(iconoSalida);
//   salida.appendChild(valorSalida);

//   circuitoContainer.appendChild(salida);
// }

function renderCircuito() {
  circuitoContainer.innerHTML = "";

  if (isNaN(valorEntrada) || valorEntrada <= 0) return;

  let valorActual = valorEntrada;

  // Nodo de entrada
  const entradaDiv = document.createElement("div");
  entradaDiv.className = "dispositivo";
  entradaDiv.innerHTML = `
    <div class="icono">📥</div>
    <div class="tipo">Entrada</div>
    <div class="valor">${valorEntrada} ${unidadSimbolo(tipoMagnitudEntrada)}</div>
  `;
  circuitoContainer.appendChild(entradaDiv);

  dispositivos.forEach((dispositivo, index) => {
    valorActual = aplicarGanancia(valorActual, dispositivo.valorDb, dispositivo.magnitud, dispositivo.tipo);

    const div = document.createElement("div");
    div.className = "dispositivo";

    div.innerHTML = `
      <div class="icono">${dispositivo.tipo === "amplificador" ? "🔊" : "🔇"}</div>
      <div class="tipo">${dispositivo.tipo.charAt(0).toUpperCase() + dispositivo.tipo.slice(1)}</div>
      <div class="valor">${dispositivo.valorDb} dB (${dispositivo.magnitud})</div>
      <div class="subtotal">Subtotal: ${valorActual.toFixed(4)} ${unidadSimbolo(dispositivo.magnitud)}</div>
    `;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btnEliminar";
    btnEliminar.addEventListener("click", () => {
      dispositivos.splice(index, 1);
      renderCircuito();
    });

    div.appendChild(btnEliminar);
    circuitoContainer.appendChild(div);

    if (index !== dispositivos.length - 1) {
      const conector = document.createElement("div");
      conector.className = "conector";
      circuitoContainer.appendChild(conector);
    }
  });

  // Nodo de salida
  const conectorFinal = document.createElement("div");
  conectorFinal.className = "conector";
  circuitoContainer.appendChild(conectorFinal);

  const salida = document.createElement("div");
  salida.className = "dispositivo";

  salida.innerHTML = `
    <div class="icono">📤</div>
    <div class="tipo">Salida</div>
    <div class="subtotal">Total: ${valorActual.toFixed(4)} ${unidadSimbolo(tipoMagnitudEntrada)}</div>
  `;

  circuitoContainer.appendChild(salida);
}


function calcularGananciaDispositivo(valor, tipo, magnitud) {
  if (valor <= 0) return 0; // Protección básica

  let ganancia = 0;

  if (magnitud === "potencia") {
    ganancia = 10 * Math.log10(valor);
  } else if (magnitud === "tension" || magnitud === "corriente") {
    ganancia = 20 * Math.log10(valor);
  }

  return tipo === "amplificador" ? ganancia : -ganancia;
}

function aplicarGanancia(valor, dB, magnitud, tipo) {
  const base = magnitud === "potencia" ? 10 : 20;
  const exponente = (tipo === "amplificador" ? 1 : -1) * (dB / base);
  return valor * Math.pow(10, exponente);
}

function unidadSimbolo(magnitud) {
  switch (magnitud) {
    case "tension": return "V";
    case "corriente": return "A";
    case "potencia": return "W";
    default: return "";
  }
}
