from flask import Flask, render_template, request, jsonify
import db
import threading
import time
import Adafruit_DHT
from datetime import datetime
import RPi.GPIO as GPIO
import spidev
import atexit
from flask_cors import CORS

# GPIO 및 SPI 설정
GPIO.setmode(GPIO.BCM)
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1350000

# 센서 설정
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4
POSE_PIN = 17

# GPIO 핀 설정
GPIO.setup(POSE_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

app = Flask(__name__)
CORS(app)


def read_adc(channel):
    """MCP3008 ADC에서 값 읽기"""
    try:
        adc = spi.xfer2([1, (8 + channel) << 4, 0])
        data = ((adc[1] & 3) << 8) + adc[2]
        return data
    except Exception as e:
        print(f"[{datetime.now()}] ⚠️ ADC 읽기 오류: {e}")
        return 0


def read_brightness():
    """조도 센서 값 읽기 (0~100%)"""
    ldr_value = read_adc(0)
    brightness = round((ldr_value / 1023) * 100, 1)
    return brightness


def read_noise():
    """소음 센서 값 읽기 (0~100%)"""
    noise_value = read_adc(1)
    noise_percent = round((noise_value / 1023) * 100, 1)
    return noise_percent


def read_pose():
    """자세 센서 읽기"""
    try:
        if GPIO.input(POSE_PIN) == GPIO.LOW:
            return "active"
        else:
            return "idle"
    except Exception as e:
        print(f"[{datetime.now()}] ⚠️ 자세 센서 읽기 오류: {e}")
        return "unknown"


def log_sensor_data():
    """센서 데이터 주기적으로 로깅"""
    while True:
        try:
            # 센서 데이터 읽기
            humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
            brightness = read_brightness()
            noise = read_noise()
            pose = read_pose()

            if temperature is not None and humidity is not None:
                # DB 연결 및 데이터 저장
                conn = db.create_connection()
                if conn:
                    db.insert_sensor_data(conn, brightness, temperature, humidity, noise, pose)
                    conn.close()
                    print(f"[{datetime.now()}] ✅ 센서 데이터 저장 완료 - 온도: {temperature:.1f}°C, 습도: {humidity:.1f}%, 밝기: {brightness}%, 소음: {noise}%, 자세: {pose}")
                else:
                    print(f"[{datetime.now()}] ❌ DB 연결 실패")
            else:
                print(f"[{datetime.now()}] ⚠️ DHT22 센서 읽기 실패")

        except Exception as e:
            print(f"[{datetime.now()}] ❌ 센서 로깅 에러: {e}")

        time.sleep(5)  # 5초 간격으로 변경 (원하면 1초로 조정 가능)


def cleanup():
    """프로그램 종료 시 리소스 정리"""
    print("리소스 정리 중...")
    GPIO.cleanup()
    spi.close()


# 프로그램 종료 시 자동으로 cleanup 실행
atexit.register(cleanup)


# ============== 웹 라우트 ==============

@app.route('/')
def home():
    return render_template("index.html")


@app.route('/api/character_state/latest', methods=['GET'])
def latest_character_state():
    """최신 캐릭터 상태 조회"""
    conn = db.create_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    data = db.get_latest_character_state(conn)
    conn.close()
    
    if data:
        return jsonify(data), 200
    else:
        return jsonify({"error": "No data found"}), 404


@app.route('/api/sensor_data/latest', methods=['GET'])
def latest_sensor_data():
    """최신 센서 데이터 조회"""
    conn = db.create_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    data = db.get_latest_sensor_data(conn)
    conn.close()
    
    if data:
        return jsonify(data), 200
    else:
        return jsonify({"error": "No data found"}), 404


@app.route('/api/sensor_data', methods=['POST'])
def add_sensor_data():
    """센서 데이터 추가"""
    try:
        content = request.json
        brightness = content.get('brightness')
        temperature = content.get('temperature')
        humidity = content.get('humidity', 0)  # 습도 추가
        noise = content.get('noise')
        pose = content.get('pose')

        # 필수 값 검증
        if brightness is None or temperature is None or noise is None or pose is None:
            return jsonify({"error": "Missing required fields"}), 400

        conn = db.create_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        db.insert_sensor_data(conn, brightness, temperature, humidity, noise, pose)
        conn.close()

        return jsonify({"message": "Sensor data inserted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/api/character_state', methods=['POST'])
def add_character_state():
    """캐릭터 상태 추가"""
    try:
        content = request.json
        emotion = content.get('emotion')
        body_heat = content.get('body_heat')
        activity = content.get('activity')
        animation = content.get('animation')
        sensor_data_id = content.get('sensor_data_id')

        # 필수 값 검증
        if not all([emotion, body_heat, activity, animation]):
            return jsonify({"error": "Missing required fields"}), 400

        conn = db.create_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        db.insert_character_state(conn, emotion, body_heat, activity, animation, sensor_data_id)
        conn.close()

        return jsonify({"message": "Character state inserted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    # 센서 로깅 스레드 시작
    sensor_thread = threading.Thread(target=log_sensor_data, daemon=True)
    sensor_thread.start()
    
    print("🚀 Flask 서버 시작 - http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=False)