// Variables
let dbEntrada = null;
const dispositivos = [];
const maxDispositivos = 5;

// Elementos DOM
const inputDB = document.getElementById('inputDB');
const btnEntrada = document.getElementById('btnEntrada');
const tipoDispositivo = document.getElementById('tipoDispositivo');
const valorDispositivo = document.getElementById('valorDispositivo');
const magnitudDispositivo = document.getElementById('magnitudDispositivo');
const btnAgregarDispositivo = document.getElementById('btnAgregarDispositivo');
const circuitoContainer = document.getElementById('circuitoContainer');
const btnCalcularSalida = document.getElementById('btnCalcularSalida');

// Función para mostrar error (puede ser alert o console)
function mostrarError(msg) {
  alert(msg);
  console.error(msg);
}

// Evento para ingresar dB de entrada
btnEntrada.addEventListener('click', () => {
  const val = parseFloat(inputDB.value);
  console.log("Valor de entrada:", val);
  if (isNaN(val)) {
    mostrarError('Ingrese un valor válido para los dB de entrada.');
    return;
  }
  dbEntrada = val;
  alert(`dB de entrada establecido en ${dbEntrada} dB`);
});

// Evento para agregar dispositivo
btnAgregarDispositivo.addEventListener('click', () => {
  if (dbEntrada === null) {
    mostrarError('Primero ingrese el valor de dB de entrada.');
    return;
  }
  if (dispositivos.length >= maxDispositivos) {
    mostrarError(`Solo se pueden agregar hasta ${maxDispositivos} dispositivos.`);
    return;
  }
  const tipo = tipoDispositivo.value;
  const val = parseFloat(valorDispositivo.value);
  const magnitud = magnitudDispositivo.value;

  console.log("Agregar dispositivo:", { tipo, val, magnitud });

  if (isNaN(val)) {
    mostrarError('Ingrese un valor válido para el dispositivo.');
    return;
  }

  dispositivos.push({ tipo, valor: val, magnitud });
  valorDispositivo.value = '';

  actualizarCircuito();
});

// Actualiza la lista de dispositivos y subtotal
function actualizarCircuito() {
  circuitoContainer.innerHTML = '';
  let subtotal = dbEntrada;

  const lista = document.createElement('ol');

  dispositivos.forEach(disp => {
    if (disp.tipo === 'amplificador') {
      subtotal += disp.valor;
    } else if (disp.tipo === 'atenuador') {
      subtotal -= disp.valor;
    }
    const li = document.createElement('li');
    li.textContent = `${disp.tipo} (${disp.magnitud}): ${disp.valor} dB — subtotal: ${subtotal.toFixed(2)} dB`;
    lista.appendChild(li);
  });

  circuitoContainer.appendChild(lista);

  const resultadoFinal = document.createElement('p');
  resultadoFinal.style.fontWeight = 'bold';
  resultadoFinal.textContent = `Ganancia/Pérdida total del circuito: ${subtotal.toFixed(2)} dB`;
  circuitoContainer.appendChild(resultadoFinal);
}

// Evento para calcular salida final
btnCalcularSalida.addEventListener('click', () => {
  if (dbEntrada === null) {
    mostrarError('Primero ingrese el valor de dB de entrada.');
    return;
  }
  if (dispositivos.length === 0) {
    mostrarError('Agregue al menos un dispositivo para calcular la salida.');
    return;
  }
  let salida = dbEntrada;
  dispositivos.forEach(disp => {
    if (disp.tipo === 'amplificador') {
      salida += disp.valor;
    } else if (disp.tipo === 'atenuador') {
      salida -= disp.valor;
    }
  });

  alert(`El valor de salida es: ${salida.toFixed(2)} dB`);
});
