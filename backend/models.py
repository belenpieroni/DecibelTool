from db import get_connection
import json

def guardar_historial(session_id, circuito):
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            sql = "INSERT INTO historial (session_id, circuito) VALUES (%s, %s)"
            cursor.execute(sql, (session_id, json.dumps(circuito)))
        conn.commit()

def obtener_historial(session_id):
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            sql = "SELECT timestamp, circuito FROM historial WHERE session_id = %s ORDER BY timestamp"
            cursor.execute(sql, (session_id,))
            return cursor.fetchall()
