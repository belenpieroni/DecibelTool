import pymysql

def get_connection():
    return pymysql.connect(
        host="acucchiarelli.mysql.pythonanywhere-services.com",
        user="acucchiarelli",
        password="ALIAS", #Esta no es la contraseña. Revisar README.md
        database="acucchiarelli$default",
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )
