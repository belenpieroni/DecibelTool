# dBTool

**Calculadora de ganancia y pérdida** para señales.  
Permite calcular salida de un circuito en función de **potencia, tensión o corriente**.
Permite armar una cadena de dispositivos (amplificadores y atenuadores) y calcular la **salida total acumulada**.
Permite construir un “circuito lógico” donde cada bloque representa un **dispositivo** que puede ser:
- Amplificador: **Aumenta** la señal (ganancia)
- Atenuador: **Reduce** la señal (pérdida)
A medida que agregás dispositivos, el sistema te muestra gráficamente cómo se ve tu circuito.
Al calcular la salida, el sistema te muestra los subtotales (cómo se va afectando la señal a medida que pasa por cada dispositivo) y el total final aparece en grande.

---

## Características

- Se permite ingresar una entrada.
- Elección de magnitud: **Watts**, **Volts**, **Amperes**.
- Agregar dispositivos con tipo (amplificador/atenuador) y valor en dB.
- Visualizar lista secuencial del circuito.
- Cálculo automático de los **subtotales**.
- Cálculo automático de la **salida total** en la magnitud elegida.
- Interfaz intuitiva y simple.

---

## Conceptos aplicados

Este proyecto aplica conceptos de la práctica 3 de **Comunicación de Datos**, en particular:
- Cálculo de **ganancia/pérdida** en un circuito de hasta 5 dispositivos.

---

## Tecnologías utilizadas

Frontend
- HTML5
- CSS3 (diseño responsive, variables y animaciones)
- JavaScript (DOM dinámico, lógica interactiva, visualización del circuito)

Backend
- Python 3.10
- Flask (enrutamiento de endpoints, gestión de CORS, APIs REST)
- JSON (intercambio de datos entre frontend y backend)

Módulos
- flask – Framework principal para levantar la API
- pymysql – Cliente para conectarse a base de datos MySQL
- cryptography – Módulo requerido por pymysql para ciertos métodos de autenticación segura

Base de Datos
- Sistema: MySQL (hospedado en PythonAnywhere)

Configuración:
- Host: acucchiarelli.mysql.pythonanywhere-services.com
- Usuario: acucchiarelli
- Base de datos: acucchiarelli$default
- Puerto: 3306

🔒 Nota: La base de datos tiene vigencia de tres meses, salvo que se renueve manualmente