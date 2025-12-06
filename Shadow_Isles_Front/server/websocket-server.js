// WebSocket 서버 예제
// 실행 방법: node server/websocket-server.js

const WebSocket = require('ws')

const PORT = 8080
const server = new WebSocket.Server({ port: PORT })

console.log(`WebSocket server is running on ws://localhost:${PORT}`)

// 연결된 모든 클라이언트 추적
const clients = new Set()

server.on('connection', (ws) => {
  console.log('New client connected')
  clients.add(ws)

  // 연결 환영 메시지
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to WebSocket server',
    timestamp: new Date().toISOString()
  }))

  // 클라이언트로부터 메시지 수신
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      console.log('Received:', data)

      // 메시지를 모든 클라이언트에게 브로드캐스트
      broadcast({
        type: 'broadcast',
        originalMessage: data,
        timestamp: new Date().toISOString()
      })

      // 특정 메시지 타입에 대한 응답
      if (data.type === 'test') {
        ws.send(JSON.stringify({
          type: 'response',
          message: 'Test message received!',
          timestamp: new Date().toISOString()
        }))
      }

      if (data.type === 'background_selected') {
        console.log(`Background selected: ${data.background}`)
        broadcast({
          type: 'background_update',
          background: data.background,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })

  // 클라이언트 연결 종료
  ws.on('close', () => {
    console.log('Client disconnected')
    clients.delete(ws)
  })

  // 에러 처리
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
    clients.delete(ws)
  })
})

// 모든 클라이언트에게 메시지 전송
function broadcast(data) {
  const message = JSON.stringify(data)
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

// 정기적으로 모든 클라이언트에게 ping 전송 (선택사항)
setInterval(() => {
  broadcast({
    type: 'ping',
    timestamp: new Date().toISOString(),
    activeClients: clients.size
  })
}, 30000) // 30초마다

// 서버 종료 처리
process.on('SIGINT', () => {
  console.log('\nClosing WebSocket server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
