# 날씨 (Jeju Vibe Weather App)

[Open-Meteo](https://open-meteo.com/) 데이터를 기반으로 한 반응형 날씨 웹앱입니다. 현재 날씨, 시간별·주간 예보, 미세먼지 정보를 한눈에 보여주고, Gemini 기반 날씨 챗봇에게 자연어로 날씨를 물어볼 수 있습니다.

## 주요 기능

- **현재 날씨 카드**: 기온, 체감온도, 습도, 바람, 강수확률, 구름량, 자외선, 일출·일몰까지 표시하며, 날씨(맑음/흐림/비/눈/폭풍)와 낮·밤에 따라 카드 배경이 자동으로 바뀝니다.
- **날씨 배경 영상**: 현재 날씨(맑음/구름조금/흐림/안개/비/눈/뇌우)와 낮·밤 조합에 맞는 배경 영상이 화면 전체에 재생됩니다.
- **현재 위치 자동 감지**: 브라우저 GPS로 좌표를 받아 역지오코딩(BigDataCloud)으로 실제 지역명(예: "제주시, 제주특별자치도")을 표시합니다.
- **지역별 현재 시각**: 선택된 지역의 타임존 기준으로 실시간 시계를 표시합니다.
- **도시 검색**: 우측 상단의 도시 검색 버튼으로 도시 이름을 검색해 위치를 변경할 수 있고, "제주", "서울" 같은 한글 지명도 로마자로 자동 변환해 검색됩니다.
- **자주 찾는 지역 버튼**: 서울·제주·도쿄·베이징·뉴욕을 카드에서 바로 클릭해 전환할 수 있습니다.
- **시간별 예보**: 카드형 목록과 함께, 호버 시 크로스헤어·툴팁이 뜨는 인터랙티브 기온 그래프를 제공합니다.
- **7일 예보 · 미세먼지**: 요일별 최고/최저 기온과 강수확률, PM2.5·PM10·AQI 정보를 표시합니다.
- **지도**: 화면 하단에 Google 지도를 표시하며, 검색·지역 전환 시 해당 위치로 자동 이동합니다.
- **섭씨/화씨 전환**: 헤더에서 온도 단위를 바로 바꿀 수 있습니다.
- **AI 날씨 챗봇**: 우측 하단 플로팅 버튼으로 열리는 채팅창에서 현재 위치의 실시간 날씨 데이터를 근거로 Gemini가 답변합니다. ("오늘 우산 챙겨야 해?" 같은 질문 가능)
- **Google 로그인**: 헤더 우측 상단에서 Google 계정으로 로그인할 수 있으며, 로그인해야만 AI 날씨 챗봇이 표시됩니다.

## 기술 스택

- **프론트엔드**: React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Radix UI, TanStack Query, Lucide Icons
- **백엔드**: Express (Gemini API 프록시 서버)
- **외부 API**: Open-Meteo(날씨·대기질·지오코딩), BigDataCloud(역지오코딩), Google Gemini API(챗봇), Google Maps Embed API(지도), Google Identity Services(로그인)

## 프로젝트 구조

```
src/
  assets/
    weather-videos/  # 날씨별 배경 영상 (14개: 7가지 날씨 x 낮/밤)
  components/
    auth/        # Google 로그인 버튼
    chat/        # 날씨 챗봇 위젯
    layout/      # 헤더
    weather/     # 날씨 카드, 시간별 그래프, 도시 검색, 배경 영상, 지도 등
    ui/          # shadcn 기반 공통 UI 컴포넌트
  context/       # 위치(Location), 온도 단위(Unit), 로그인(Auth) 컨텍스트
  hooks/         # 데이터 조회 및 유틸 훅
  lib/           # API 클라이언트, 포맷터, 날씨 코드/테마/영상 매핑, Google 로그인 유틸
  types/         # 공용 타입 정의 (Google Identity Services 타입 포함)
server/
  index.js               # 로컬 개발용 Express 서버 (Vite 프록시 대상, 8787)
  geminiChatHandler.js   # Gemini 호출 로직 (Express·Vercel 함수 공용)
api/
  gemini/chat.js  # Vercel Serverless Function (geminiChatHandler.js 재사용)
```

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사해 `.env` 파일을 만들고 본인의 Gemini API 키를 입력합니다.

```bash
cp .env.example .env
```

```
GEMINI_API_KEY=발급받은_키
GEMINI_MODEL=gemini-flash-latest
PORT=8787
VITE_GOOGLE_MAPS_API_KEY=발급받은_키
VITE_GOOGLE_CLIENT_ID=발급받은_클라이언트_ID
```

> **GEMINI_API_KEY**는 프론트엔드에 절대 노출되지 않고 `server/index.js` 프록시 서버에서만 사용됩니다. 챗봇 기능 없이 날씨 정보만 쓸 경우 이 값은 비워둬도 됩니다.
>
> **VITE_GOOGLE_MAPS_API_KEY**는 [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials)에서 프로젝트를 만들고 **Maps Embed API**를 활성화한 뒤 발급받은 API 키입니다. 이 키는 브라우저에 노출되는 게 정상이므로(Maps Embed API는 사용량과 무관하게 무료), 서버로 숨기는 대신 Cloud Console에서 **HTTP 리퍼러 제한**(`localhost:5173/*`, 배포 도메인 등)으로 보호하세요. 값을 비워두면 지도 영역에 안내 메시지가 표시됩니다.
>
> **VITE_GOOGLE_CLIENT_ID**는 [Google Cloud Console > API 및 서비스 > 사용자 인증 정보](https://console.cloud.google.com/apis/credentials)에서 **OAuth 클라이언트 ID**(애플리케이션 유형: 웹 애플리케이션)를 만들어 발급받습니다. **승인된 JavaScript 원본**에 `http://localhost:5173`과 배포 도메인을 등록해야 합니다. 값을 비워두면 헤더에 "로그인 설정 필요"가 표시되고 로그인 전까지 챗봇이 숨겨집니다.
>
> 환경 변수를 바꾼 뒤에는 `npm run dev` / `npm run dev:all`을 **재시작**해야 반영됩니다.

### 3. 개발 서버 실행

챗봇까지 포함해 전체 기능을 테스트하려면 프론트엔드와 API 서버를 함께 실행하세요.

```bash
npm run dev:all
```

날씨 정보만 확인한다면 프론트엔드만 실행해도 됩니다.

```bash
npm run dev
```

> `npm run dev`만 실행한 상태에서 챗봇을 사용하면 `ECONNREFUSED` 또는 "챗봇 서버에 연결할 수 없습니다" 오류가 발생합니다. API 서버(8787)가 떠 있지 않기 때문이며, 별도 터미널에서 `npm run server`를 추가로 실행하거나 `npm run dev:all`로 재시작하면 해결됩니다.

### 4. 빌드

```bash
npm run build
```

## 배포 (Vercel)

이 저장소를 Vercel에 연결하면 프론트엔드는 정적 빌드로, `/api/gemini/chat`은 `api/gemini/chat.js`가 **Serverless Function**으로 자동 배포됩니다 (로컬용 `server/index.js`는 Vercel에서 실행되지 않으며, 둘 다 같은 `server/geminiChatHandler.js` 로직을 공유합니다).

배포 후 아래 두 가지를 반드시 확인하세요.

1. **Vercel 프로젝트 > Settings > Environment Variables**에 다음 값을 등록하고 재배포(Redeploy)합니다.
   - `GEMINI_API_KEY`, `GEMINI_MODEL` (서버 전용, `VITE_` 접두사 없음 — 브라우저에 노출되지 않습니다)
   - `VITE_GOOGLE_MAPS_API_KEY`, `VITE_GOOGLE_CLIENT_ID` (Vite가 빌드 시점에 번들에 포함하므로, 값을 바꾼 뒤에는 반드시 재배포해야 반영됩니다)
2. **Google Cloud Console**에서 배포 도메인(예: `https://your-app.vercel.app`)을 다음 두 곳에 등록합니다.
   - OAuth 클라이언트 ID의 **Authorized JavaScript origins** — 누락 시 로그인 클릭 시 `origin_mismatch` 오류 발생
   - Maps API 키에 HTTP 리퍼러 제한을 쓰고 있다면 그 목록에도 추가

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | Vite 개발 서버만 실행 |
| `npm run server` | Gemini 프록시 API 서버만 실행 |
| `npm run dev:all` | 프론트엔드 + API 서버 동시 실행 |
| `npm run build` | 타입 체크 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | Oxlint 검사 |
