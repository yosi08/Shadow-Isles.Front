// websocket/ws.js
const WebSocket = require('ws');
const { readDHT } = require('../sensors/dht');
const { readSound } = require('../sensors/sound');
const { readLight } = require('../sensors/light');
const { initCamera, detectGesture, cleanup } = require('../sensors/camera');

const PORT = 3001;

// 서버 시작 전 카메라 초기화
(async () => {
    console.log('🚀 Initializing sensors...');
    
    await initCamera();
    
    const wss = new WebSocket.Server({ port: PORT }, () => {
        console.log(`📡 WebSocket Sensor Server running on ws://localhost:${PORT}`);
    });

    wss.on('connection', (ws) => {
        console.log('🔌 Client connected');

        // 0.1초마다 센서 데이터 전송 (실시간)
        const interval = setInterval(async () => {
            try {
                // 센서 데이터 병렬 읽기
                const [dht, sound, light, gesture] = await Promise.all([
                    readDHT().catch(() => ({ temperature: 0 })),
                    readSound().catch(() => ({ sound: 0 })),
                    readLight().catch(() => ({ light: 0 })),
                    detectGesture()
                ]);

                const data = {
                    ...dht,
                    ...sound,
                    ...light,
                    gesture, // 'jump', 'handsUp', '' 중 하나
                    timestamp: Date.now()
                };

                ws.send(JSON.stringify(data));
            } catch (err) {
                console.error('Sensor read error:', err);
                ws.send(JSON.stringify({ 
                    error: 'Failed to read sensors',
                    timestamp: Date.now()
                }));
            }
        }, 100); // 100ms 간격

        ws.on('close', () => {
            console.log('❌ Client disconnected');
            clearInterval(interval);
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            clearInterval(interval);
        });
    });

    // 서버 종료 시 카메라 정리
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server...');
        cleanup();
        wss.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down server...');
        cleanup();
        wss.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });

})();