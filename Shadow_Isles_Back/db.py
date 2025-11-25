import pymysql
from datetime import datetime


def create_connection():
    """MySQL 데이터베이스 연결"""
    try:
        conn = pymysql.connect(
            host='localhost',
            user='yosi',
            password='rlqja0803',
            database='teamproject',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        print("✅ DB 연결 성공")
        return conn
    except Exception as e:
        print(f"❌ DB 연결 실패: {e}")
        return None


def insert_sensor_data(conn, brightness, temperature, humidity, noise, pose):
    """센서 데이터 삽입"""
    try:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO sensor_data (timestamp, brightness, temperature, humidity, noise, pose) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            data = (datetime.now(), brightness, temperature, humidity, noise, pose)
            cursor.execute(sql, data)
        conn.commit()
        print(f"✅ sensor_data 삽입 성공, ID: {cursor.lastrowid}")
        return cursor.lastrowid
    except Exception as e:
        print(f"❌ sensor_data 삽입 실패: {e}")
        conn.rollback()
        return None


def get_latest_sensor_data(conn):
    """최신 센서 데이터 1개 조회"""
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1"
            cursor.execute(sql)
            row = cursor.fetchone()
            
            if row:
                print(f"✅ 최근 sensor_data 조회 성공")
                return row
            else:
                print("⚠️ sensor_data가 비어있습니다")
                return None
    except Exception as e:
        print(f"❌ sensor_data 조회 실패: {e}")
        return None


def insert_character_state(conn, emotion, body_heat, activity, animation, sensor_data_id):
    """캐릭터 상태 데이터 삽입"""
    try:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO character_state (timestamp, emotion, body_heat, activity, animation, sensor_data_id) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            data = (datetime.now(), emotion, body_heat, activity, animation, sensor_data_id)
            cursor.execute(sql, data)
        conn.commit()
        print(f"✅ character_state 삽입 성공, ID: {cursor.lastrowid}")
        return cursor.lastrowid
    except Exception as e:
        print(f"❌ character_state 삽입 실패: {e}")
        conn.rollback()
        return None


def get_latest_character_state(conn):
    """최신 캐릭터 상태 1개 조회"""
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM character_state ORDER BY timestamp DESC LIMIT 1"
            cursor.execute(sql)
            row = cursor.fetchone()
            
            if row:
                print(f"✅ 최근 character_state 조회 성공")
                return row
            else:
                print("⚠️ character_state가 비어있습니다")
                return None
    except Exception as e:
        print(f"❌ character_state 조회 실패: {e}")
        return None


def insert_event_history(conn, event_type, description, character_state_id=None):
    """이벤트 히스토리 삽입"""
    try:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO event_history (timestamp, event_type, description, character_state_id)
            VALUES (%s, %s, %s, %s)
            """
            data = (datetime.now(), event_type, description, character_state_id)
            cursor.execute(sql, data)
        conn.commit()
        print(f"✅ event_history 삽입 성공, ID: {cursor.lastrowid}")
        return cursor.lastrowid
    except Exception as e:
        print(f"❌ event_history 삽입 실패: {e}")
        conn.rollback()
        return None


def get_latest_event_history(conn):
    """최신 이벤트 히스토리 1개 조회"""
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM event_history ORDER BY timestamp DESC LIMIT 1"
            cursor.execute(sql)
            row = cursor.fetchone()
            
            if row:
                print(f"✅ 최근 event_history 조회 성공")
                return row
            else:
                print("⚠️ event_history가 비어있습니다")
                return None
    except Exception as e:
        print(f"❌ event_history 조회 실패: {e}")
        return None


def get_sensor_data_by_range(conn, start_time, end_time):
    """특정 시간 범위의 센서 데이터 조회"""
    try:
        with conn.cursor() as cursor:
            sql = """
            SELECT * FROM sensor_data 
            WHERE timestamp BETWEEN %s AND %s 
            ORDER BY timestamp DESC
            """
            cursor.execute(sql, (start_time, end_time))
            rows = cursor.fetchall()
            print(f"✅ {len(rows)}개의 sensor_data 조회 성공")
            return rows
    except Exception as e:
        print(f"❌ sensor_data 범위 조회 실패: {e}")
        return []