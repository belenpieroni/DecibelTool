# dBTool

**Calculadora de ganancia y pérdida en decibeles (dB)** para señales eléctricas.  
Permite calcular ganancia o pérdida en función de **potencia, tensión o corriente**.
Permite armar una cadena de dispositivos (amplificadores, atenuadores, etc.) y calcular la **ganancia total acumulada**.
Permite construir un “circuito lógico” donde cada bloque representa un **dispositivo** que puede ser:
- Amplificador: **Aumenta** la señal (ganancia)
- Atenuador: **Reduce** la señal (pérdida)
A medida que agregás dispositivos, el sistema muestra cómo se va acumulando la ganancia/pérdida total del sistema en **dB**.

---

## Características

- Se permite ingresar una entrada
- Elección de magnitud: **Watts**, **Volts**, **Amperes**
- Agregar dispositivos con tipo (amplificador/atenuador) y valor en dB
- Visualizar lista secuencial del circuito
- Cálculo automático de la **salida total**
- Interfaz intuitiva y simple

---

## Conceptos aplicados

Este proyecto aplica conceptos de la práctica 3 de **Comunicación de Datos**, en particular:
- Cálculo de **ganancia/pérdida en dB** en un circuito de hasta 5 dispositivos.

---

## Tecnologías utilizadas

Frontend
- HTML
- CSS
- JavaScript

Backend
- Python (3.10)
- Flask
- JSON

Módulos
flask – Framework principal para el backend
pymysql – Cliente MySQL en Python
cryptography – Necesario internamente por pymysql si la autenticación requiere SHA256

DB (PythonAnywhere)
- MySQL
- host="acucchiarelli.mysql.pythonanywhere-services.com"
- user="acucchiarelli"
- database="acucchiarelli$default"
- port=3306
- password="Hola123456789"
#La base de datos tiene una vigencia de tres meses, salvo que se renueve manualmente