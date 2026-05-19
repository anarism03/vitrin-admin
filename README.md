# Admin Panel — Day 1 (Auth)

Vite + React + TypeScript + Tailwind CSS + Ant Design admin paneli.
Bu gün üçün yalnız **Login / Register / Verify OTP** və **Home** səhifələri hazırdır.

## Auth Flow

```
Register (name, email, password)
   └─→ Email/Telegram bot OTP kod
        └─→ Verify Email (code)
             └─→ Login (email, password)
                  └─→ Access + Refresh token → Home
```

## Backend

- Base URL: `http://161.97.154.119/intern-api/api`
- Swagger: `http://161.97.154.119/intern-api/api/docs`

Endpoint-lər (Swagger-də dəqiqləşdir):

| Mərhələ | Method | Path |
|---|---|---|
| Register | POST | `/auth/register` |
| Verify email | POST | `/auth/verify-email` |
| Resend code | POST | `/auth/resend-verify-email-code` |
| Login | POST | `/auth/login` |
| Refresh | POST | `/auth/refresh` |
| Logout | POST | `/auth/logout` |

Backend-in field adları fərqli olarsa (məs. `fullName` əvəzinə `name`),
`src/services/AuthService.ts` və `src/types/auth.type.ts` fayllarını yenilə.

## Quraşdırma

```bash
npm install
npm run dev
```

App `http://localhost:5173` ünvanında açılır.

## Mühit dəyişənləri

`.env` faylı:

```
VITE_API_URL=http://161.97.154.119/intern-api/api
```

`.env` dəyişəndən sonra `npm run dev`-i yenidən başlat.

## Struktur

```
src/
├─ components/
│  └─ PrivateRoute.tsx       # Token yoxdursa /login-ə yönləndirir
├─ context/
│  └─ AuthContext.tsx        # user + token state
├─ pages/
│  ├─ Login.tsx              # Login / Register / Verify (3 mode)
│  └─ Home.tsx               # Private səhifə
├─ services/
│  ├─ axiosInstance.ts       # baseURL, Bearer header, 401 refresh
│  └─ AuthService.ts         # register, verify, login, logout, me
├─ types/
│  └─ auth.type.ts
├─ App.tsx                   # Router
├─ main.tsx                  # ConfigProvider + AntApp + AuthProvider
└─ index.css                 # Tailwind + font
```

## Yoxlama checklist (PDF-dən)

- [ ] Register request işləyir
- [ ] OTP kod gəlir (Telegram bot)
- [ ] Verify code işləyir
- [ ] Resend code işləyir
- [ ] Login response token qaytarır
- [ ] Token localStorage-ə yazılır
- [ ] Private route token olmadan açılmır
- [ ] Logout token-ləri silir
