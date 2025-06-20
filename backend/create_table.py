from db import get_connection

def crear_tabla():
    conn = get_connection()
    with conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS historial (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    session_id VARCHAR(255),
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    circuito JSON
                );
            """)
        conn.commit()

crear_tabla()
print("Tabla 'historial' creada correctamente.")
