from flask import Flask, request, jsonify
from models import guardar_historial, obtener_historial

app = Flask(__name__)

@app.route("/guardarHistorial", methods=["POST"])
def guardar():
    data = request.get_json()
    session_id = data.get("sessionId")
    circuito = data.get("circuito")

    if not session_id or not circuito:
        return jsonify({"error": "Faltan datos"}), 400

    try:
        guardar_historial(session_id, circuito)
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/historial", methods=["GET"])
def historial():
    session_id = request.args.get("sessionId")
    if not session_id:
        return jsonify({"error": "Falta sessionId"}), 400

    try:
        datos = obtener_historial(session_id)
        return jsonify(datos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

application = app

if __name__ == "__main__":
    app.run(debug=True)