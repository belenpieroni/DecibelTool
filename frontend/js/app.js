let ultimaSalida = null;
const dispositivos = [];
const circuitoContainer = document.getElementById("circuitoContainer");
const inputDB = document.getElementById("inputDB");
const btnAgregarDispositivo = document.getElementById("btnAgregarDispositivo");
const btnCalcularSalida = document.getElementById("btnCalcularSalida");
const sessionId = crypto.randomUUID();


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

// CALCULADORA Y CIRCUITOS
btnCalcularSalida.addEventListener("click", async () => {
    calcularSalida(true);
    try {
        await fetch("https://acucchiarelli.pythonanywhere.com/guardarHistorial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionId: sessionId,
            circuito: dispositivos
        })
        });
        console.log("Historial guardado correctamente.");
    } catch (error) {
        console.error("Error al guardar historial:", error);
    }

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

    if (dispositivos.length === 0) {
        document.getElementById("inputValor").disabled = false;
        ultimaSalida = null;
        document.getElementById("resultado").innerText = "";
    } else {
        renderizarCircuito(false);
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

    dispositivos.forEach((dispositivo) => {
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
                <div class="subtotal">Entrada: ${formatearNumero(dispositivo.valorEntrada)} ${unidadSimbolo(dispositivo.magnitud)}</div>
                <div class="subtotal">Subtotal: ${formatearNumero(dispositivo.salida)} ${unidadSimbolo(dispositivo.magnitud)}</div>
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
  return parseFloat(numero.toFixed(3)).toString();
}

// FUNCIÓN PARA EL HISTORIAL
document.getElementById("verHistorialBtn").addEventListener("click", async () => {
  const sidebar = document.getElementById("historialSidebar");
  const container = document.getElementById("historialContainer");

  sidebar.style.display = sidebar.style.display === "none" ? "block" : "none";

  if (sidebar.style.display === "block") {
    try {
      const response = await fetch(`https://acucchiarelli.pythonanywhere.com/historial?sessionId=${sessionId}`);
      const historial = await response.json();

      container.innerHTML = "";

      historial.reverse().forEach((registro, i) => {
        const numeroCircuito = historial.length - i;
        const circuito = typeof registro.circuito === "string"
          ? JSON.parse(registro.circuito)
          : registro.circuito;

        const versionDiv = document.createElement("div");
        versionDiv.className = "historial-item";

        const encabezado = `
          <div class="historial-encabezado">
            <h4>Circuito ${numeroCircuito}</h4>
          </div>
        `;

        let listaDispositivos = "<ul class='historial-lista'>";
        circuito.forEach((item, j) => {
          listaDispositivos += `
            <li>
              <span class="tipo">${item.tipo === "amplificador" ? "🔊" : "🔇"} ${item.tipo}</span> |
              <strong>${item.db} dB</strong> |
              Entrada: ${item.valorEntrada.toFixed(2)} ${unidadSimbolo(item.magnitud)} |
              Salida: ${item.salida.toFixed(2)} ${unidadSimbolo(item.magnitud)}
            </li>
          `;
        });
        listaDispositivos += "</ul>";

        versionDiv.innerHTML = encabezado + listaDispositivos;
        container.appendChild(versionDiv);
      });
    } catch (error) {
      container.innerHTML = "<p style='color:red'>Error al obtener historial.</p>";
      console.error(error);
    }
  }
});

function ocultarHistorial() {
  document.getElementById("historialSidebar").style.display = "none";
}

document.getElementById("cerrarHistorialBtn").addEventListener("click", ocultarHistorial);