# API Implementation Guide

프론트엔드에서 구현된 모든 API 기능 목록입니다.

## 📁 프로젝트 구조

```
src/
├── api/
│   ├── client.js          # Axios 설정 및 인터셉터
│   ├── auth.js            # 인증 API
│   ├── users.js           # 사용자 관리 API
│   ├── alerts.js          # 알림 API
│   ├── plans.js           # 계획 관리 API
│   └── forecast.js        # 예보 API
├── hooks/
│   ├── useAuth.js         # 인증 훅
│   ├── useSettings.js     # 설정 관리 훅
│   ├── usePlans.js        # 계획 관리 훅
│   ├── useAlerts.js       # 알림 관리 훅
│   ├── useForecast.js     # 예보 조회 훅
│   └── useWebSocket.js    # WebSocket 훅 (기존)
├── contexts/
│   └── AuthContext.jsx    # 인증 컨텍스트
├── pages/
│   ├── HomePage.jsx       # 홈 페이지
│   ├── LoginPage.jsx      # 로그인
│   ├── RegisterPage.jsx   # 회원가입
│   ├── SettingsPage.jsx   # 설정
│   ├── PlansPage.jsx      # 계획 관리
│   └── ForecastPage.jsx   # 예보
└── components/
    └── AlertsPanel.jsx    # 알림 패널
```

## 🔐 구현된 API 목록

### 인증 관련 (5개)
- ✅ `POST /auth/register` - 회원가입
- ✅ `POST /auth/login` - 로그인
- ✅ `POST /auth/refresh` - 액세스 토큰 재발급
- ✅ `POST /auth/logout` - 현재 세션 로그아웃
- ✅ `POST /auth/logout/all` - 모든 디바이스에서 로그아웃

### 사용자 관리 (4개)
- ✅ `GET /users/me` - 자신의 정보 조회
- ✅ `DELETE /users/me` - 계정 삭제
- ✅ `GET /users/me/settings` - 유저 설정 받아오기
- ✅ `PATCH /users/me/settings` - 유저 설정 수정

### 알림 관련 (2개)
- ✅ `GET /users/me/alerts` - 알람 목록
- ✅ `PATCH /users/me/alerts/{alertId}/read` - 알람 읽음 처리

### 계획 관리 (4개)
- ✅ `GET /users/plan` - 유저 계획 읽어오기
- ✅ `POST /users/plan` - 유저 계획 생성
- ✅ `PUT /users/plan/{planId}` - 유저 계획 수정
- ✅ `DELETE /user/plan` - 유저 계획 삭제

### 예보 (1개)
- ✅ `GET /forecast` - (Auth가 있는 경우) 개인화된 예보

**총 16개 API 모두 구현 완료**

## 🚀 시작하기

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:8080
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

## 🔑 주요 기능

### 인증 시스템
- JWT 토큰 기반 인증
- 자동 토큰 갱신 (Refresh Token)
- 로그인 상태 유지
- Protected Routes

### API 클라이언트
- Axios 기반 HTTP 클라이언트
- 자동 토큰 추가 (Request Interceptor)
- 토큰 만료 시 자동 갱신 (Response Interceptor)
- 에러 핸들링

### 커스텀 훅
- `useAuth`: 인증 상태 및 로그인/로그아웃 기능
- `usePlans`: 계획 CRUD 기능
- `useAlerts`: 알림 조회 및 읽음 처리
- `useForecast`: 예보 조회
- `useSettings`: 설정 관리

## 📱 페이지 구성

### 공개 페이지
- `/login` - 로그인 페이지
- `/register` - 회원가입 페이지

### 인증 필요 페이지
- `/` - 홈 (기존 배경 선택 기능)
- `/plans` - 계획 관리
- `/forecast` - 예보
- `/alerts` - 알림
- `/settings` - 설정

## 🔧 API 사용 예시

### 로그인
```javascript
import { useAuth } from './hooks/useAuth'

const { login } = useAuth()

const handleLogin = async () => {
  const result = await login({ email, password })
  if (result.success) {
    // 로그인 성공
  }
}
```

### 계획 생성
```javascript
import { usePlans } from './hooks/usePlans'

const { createPlan } = usePlans()

const handleCreate = async () => {
  const result = await createPlan({
    title: 'My Plan',
    description: 'Description',
    startDate: '2025-12-07',
    endDate: '2025-12-14'
  })
}
```

### 알림 조회
```javascript
import { useAlerts } from './hooks/useAlerts'

const { alerts, unreadCount, markAsRead } = useAlerts()
```

## 📝 참고사항

1. **토큰 관리**:
   - Access Token과 Refresh Token은 localStorage에 저장됩니다
   - 토큰 만료 시 자동으로 갱신됩니다

2. **에러 처리**:
   - 모든 API 호출은 try-catch로 에러를 처리합니다
   - 에러 메시지는 사용자에게 표시됩니다

3. **상태 관리**:
   - 인증 상태는 AuthContext로 전역 관리됩니다
   - 각 기능별 상태는 커스텀 훅으로 관리됩니다

4. **백엔드 연동**:
   - 백엔드 API가 실행 중이어야 합니다
   - API Base URL은 `.env` 파일에서 설정합니다
