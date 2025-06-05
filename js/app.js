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

btnEntrada.addEventListener("click", () => {
  entradaDB = parseFloat(inputDB.value);
  alert(`Entrada establecida en ${entradaDB} dB`);
});

btnAgregarDispositivo.addEventListener("click", () => {
  const tipo = tipoDispositivo.value;
  const valor = parseFloat(valorDispositivo.value);
  const magnitud = magnitudDispositivo.value;

  if (isNaN(valor)) {
    alert("Por favor ingrese un valor numérico para el dispositivo.");
    return;
  }

  dispositivos.push({ tipo, valor, magnitud });
  renderCircuito();
});

btnCalcularSalida.addEventListener("click", () => {
  let total = entradaDB;

  dispositivos.forEach((dispositivo) => {
    const { tipo, valor, magnitud } = dispositivo;
    let ganancia = 0;

    if (tipo === "amplificador") {
      ganancia =
        magnitud === "potencia"
          ? 10 * Math.log10(Math.pow(10, valor / 10))
          : 20 * Math.log10(Math.pow(10, valor / 20));
    } else {
      ganancia =
        magnitud === "potencia"
          ? -10 * Math.log10(Math.pow(10, valor / 10))
          : -20 * Math.log10(Math.pow(10, valor / 20));
    }

    total += ganancia;
    dispositivo.subtotal = total;
  });

  renderCircuito();
  alert(`Valor final de salida: ${total.toFixed(2)} dB`);
});

function renderCircuito() {
  circuitoContainer.innerHTML = "";
  let subtotal = entradaDB;

  dispositivos.forEach((dispositivo, index) => {
    const div = document.createElement("div");
    div.className = "dispositivo";

    const icono = document.createElement("div");
    icono.className = "icono";
    icono.textContent = dispositivo.tipo === "amplificador" ? "🔊" : "🔇";

    const tipo = document.createElement("div");
    tipo.className = "tipo";
    tipo.textContent = dispositivo.tipo.charAt(0).toUpperCase() + dispositivo.tipo.slice(1);

    const valor = document.createElement("div");
    valor.className = "valor";
    valor.textContent = `${dispositivo.valor} dB (${dispositivo.magnitud})`;

    subtotal = calcularSubtotal(subtotal, dispositivo);

    const subtotalDiv = document.createElement("div");
    subtotalDiv.className = "subtotal";
    subtotalDiv.textContent = `Subtotal: ${subtotal.toFixed(2)} dB`;

    div.appendChild(tipo);
    div.appendChild(valor);
    div.appendChild(icono);
    div.appendChild(subtotalDiv);

    circuitoContainer.appendChild(div);

    const conector = document.createElement("div");
    conector.className = "conector";
    circuitoContainer.appendChild(conector);
  });

  // Agregar nodo final de salida
  const salida = document.createElement("div");
  salida.className = "dispositivo";

  const iconoSalida = document.createElement("div");
  iconoSalida.className = "icono";
  iconoSalida.textContent = "📤";

  const tipoSalida = document.createElement("div");
  tipoSalida.className = "tipo";
  tipoSalida.textContent = "Salida";

  const valorSalida = document.createElement("div");
  valorSalida.className = "subtotal";
  valorSalida.textContent = `Total: ${subtotal.toFixed(2)} dB`;

  salida.appendChild(tipoSalida);
  salida.appendChild(iconoSalida);
  salida.appendChild(valorSalida);

  circuitoContainer.appendChild(salida);
}

function calcularSubtotal(actual, dispositivo) {
  const { tipo, valor, magnitud } = dispositivo;

  let resultado = actual;

  if (tipo === "amplificador") {
    resultado += valor;
  } else {
    resultado -= valor;
  }

  return resultado;
}
