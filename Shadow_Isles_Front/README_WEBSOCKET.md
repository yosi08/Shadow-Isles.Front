# WebSocket 실시간 통신 가이드

## 구조

### 클라이언트 (React)
- `src/hooks/useWebSocket.js`: WebSocket 연결을 관리하는 커스텀 Hook
- `src/App.jsx`: WebSocket을 사용하는 메인 컴포넌트

### 서버 (Node.js)
- `server/websocket-server.js`: WebSocket 서버 구현

## 서버 실행 방법

1. 서버 디렉토리로 이동:
```bash
cd server
```

2. 의존성 설치:
```bash
npm install
```

3. 서버 실행:
```bash
npm start
```

또는 직접 실행:
```bash
node websocket-server.js
```

서버가 `ws://localhost:8080`에서 실행됩니다.

## 클라이언트 실행 방법

1. 프로젝트 루트 디렉토리에서:
```bash
npm run dev
```

2. 브라우저에서 애플리케이션 열기

## 주요 기능

### useWebSocket Hook

```javascript
const { isConnected, lastMessage, sendMessage, error, disconnect, reconnect } = useWebSocket('ws://localhost:8080')
```

**반환값:**
- `isConnected`: WebSocket 연결 상태 (boolean)
- `lastMessage`: 마지막으로 수신한 메시지
- `sendMessage(message)`: 서버로 메시지 전송 함수
- `error`: 에러 메시지 (있을 경우)
- `disconnect()`: 연결 종료 함수
- `reconnect()`: 재연결 함수

**특징:**
- 자동 재연결: 연결이 끊어지면 5초 후 자동으로 재연결 시도
- JSON 자동 파싱: 수신한 메시지를 자동으로 JSON 파싱
- JSON 자동 변환: 객체를 전송하면 자동으로 JSON 문자열로 변환

### 메시지 전송 예제

```javascript
// 텍스트 메시지
sendMessage('Hello, Server!')

// 객체 메시지 (자동으로 JSON 변환)
sendMessage({
  type: 'chat',
  message: 'Hello!',
  timestamp: new Date().toISOString()
})
```

### 메시지 수신 예제

```javascript
useEffect(() => {
  if (lastMessage) {
    console.log('Received:', lastMessage)
    // 메시지 처리 로직
  }
}, [lastMessage])
```

## 서버 API

서버는 다음 메시지 타입을 처리합니다:

### 클라이언트 → 서버

1. **test**: 테스트 메시지
```json
{
  "type": "test",
  "message": "Hello from client!",
  "timestamp": "2025-12-06T..."
}
```

2. **background_selected**: 배경 선택 알림
```json
{
  "type": "background_selected",
  "background": "nature",
  "timestamp": "2025-12-06T..."
}
```

### 서버 → 클라이언트

1. **welcome**: 연결 환영 메시지
```json
{
  "type": "welcome",
  "message": "Connected to WebSocket server",
  "timestamp": "2025-12-06T..."
}
```

2. **broadcast**: 브로드캐스트 메시지
```json
{
  "type": "broadcast",
  "originalMessage": {...},
  "timestamp": "2025-12-06T..."
}
```

3. **ping**: 주기적인 핑 (30초마다)
```json
{
  "type": "ping",
  "timestamp": "2025-12-06T...",
  "activeClients": 2
}
```

## 커스터마이징

### WebSocket URL 변경

`src/App.jsx`에서 URL을 변경할 수 있습니다:

```javascript
const { isConnected, lastMessage, sendMessage } = useWebSocket('ws://your-server-url:port')
```

### 재연결 시간 변경

`src/hooks/useWebSocket.js`에서 재연결 타임아웃을 변경할 수 있습니다:

```javascript
reconnectTimeout.current = setTimeout(() => {
  connect()
}, 5000) // 5000ms = 5초
```

### 서버 포트 변경

`server/websocket-server.js`에서 포트를 변경할 수 있습니다:

```javascript
const PORT = 8080 // 원하는 포트로 변경
```

## 디버깅

- 브라우저 콘솔에서 WebSocket 연결 상태와 메시지를 확인할 수 있습니다
- 서버 콘솔에서 클라이언트 연결 및 메시지를 모니터링할 수 있습니다
- Chrome DevTools의 Network 탭 → WS 필터로 WebSocket 통신을 확인할 수 있습니다

## 주의사항

1. 서버를 먼저 실행한 후 클라이언트를 실행하세요
2. 방화벽에서 WebSocket 포트(8080)가 열려있는지 확인하세요
3. 프로덕션 환경에서는 WSS (WebSocket Secure)를 사용하세요
