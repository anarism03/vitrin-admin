# Admin Panel

React, TypeScript və Vite ilə hazırlanmış admin panel. Layihə məhsul və kateqoriya idarəçiliyi, autentifikasiya, dashboard statistikaları və məhsul şəkillərinin yüklənməsi üçün istifadə olunur.

## Mündəricat

- [Texnologiyalar](#texnologiyalar)
- [Başlamaq](#başlamaq)
- [Environment dəyişənləri](#environment-dəyişənləri)
- [NPM skriptləri](#npm-skriptləri)
- [Layihə strukturu](#layihə-strukturu)
- [Əsas funksionallıqlar](#əsas-funksionallıqlar)
- [Arxitektura qeydləri](#arxitektura-qeydləri)
- [API endpointləri](#api-endpointləri)

## Texnologiyalar

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Redux
- React Router DOM
- Ant Design
- Tailwind CSS
- Axios

## Başlamaq

Repo-nu klonladıqdan sonra dependency-ləri quraşdırın:

```bash
npm install
```

Environment faylını yaradın:

```bash
cp .env.example .env
```

Development serverini işə salın:

```bash
npm run dev
```

Vite serveri adətən bu ünvanda açılır:

```txt
http://localhost:5173
```

## Environment dəyişənləri

Layihə backend ünvanını `.env` faylından oxuyur.

```env
VITE_API_URL=http://161.97.154.119/intern-api/api
```

Bu dəyər [`src/services/axiosInstance.ts`](src/services/axiosInstance.ts) faylında `baseURL` kimi istifadə olunur. Bütün API sorğuları ortaq Axios instance üzərindən göndərilir.

## NPM skriptləri

| Komanda | Təsvir |
| --- | --- |
| `npm run dev` | Development serverini başladır |
| `npm run build` | TypeScript yoxlaması edir və production build yaradır |
| `npm run preview` | Production build nəticəsini lokalda göstərir |
| `npm run lint` | ESLint yoxlamasını işə salır |

## Layihə strukturu

```txt
src/
  components/          Ümumi layout və paylaşılan komponentlər
  hooks/               Ümumi custom hook-lar
  pages/               Səhifələr və həmin səhifələrə aid hook/komponentlər
    categories/
    home/
    login/
    products/
  providers/           App səviyyəli provider-lər
  routes/              Public/private route konfiqurasiyası
  services/            API servis qatları
  store/               Redux store, slice və typed hook-lar
  types/               TypeScript type-ları
  utils/               Auth storage, asset URL və helper funksiyalar
```

## Əsas funksionallıqlar

- Login, register və email verification flow
- Protected routes və public routes ayrımı
- Redux əsaslı auth state idarəçiliyi
- Access token əlavə edilməsi və refresh token mexanizmi
- Dashboard statistikaları
- Məhsullar üçün CRUD əməliyyatları
- Kateqoriyalar üçün CRUD əməliyyatları
- Məhsul şəkillərinin yüklənməsi
- Search, filter və pagination
- Böyük ekranlarda table, kiçik ekranlarda card əsaslı responsive görünüş
- Ant Design komponentləri ilə form, modal, table və notification idarəçiliyi

## Arxitektura qeydləri

### Routing

Private səhifələr [`src/routes/routes.tsx`](src/routes/routes.tsx) faylında saxlanılır:

```tsx
export const privateRoutes = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/categories", element: <Categories /> },
];
```

[`src/App.tsx`](src/App.tsx) auth vəziyyətinə əsasən public və ya private route-ları render edir.

### Auth

Auth məlumatları [`src/store/authSlice.ts`](src/store/authSlice.ts) içində saxlanılır:

- `accessToken`
- `refreshToken`
- `user`
- `userEmail`
- `isAuthenticated`
- `loading`
- `error`

Login uğurlu olduqda tokenlər və user məlumatı Redux state-ə yazılır, həmçinin `localStorage`-da saxlanılır. Səhifə yenilənəndə [`src/utils/authStorage.ts`](src/utils/authStorage.ts) həmin məlumatları oxuyur.

### Axios

[`src/services/axiosInstance.ts`](src/services/axiosInstance.ts) bütün API sorğuları üçün ortaq konfiqurasiyadır.

Əsas davranışlar:

- `VITE_API_URL` dəyərini `baseURL` kimi istifadə edir.
- Access token varsa, hər sorğuya `Authorization: Bearer <token>` header-i əlavə edir.
- `401` cavabı gəldikdə refresh token ilə yeni token almağa çalışır.
- Refresh uğursuz olduqda auth storage təmizlənir və istifadəçi `/login` səhifəsinə yönləndirilir.

### Səhifə məntiqi

Səhifə məntiqi mümkün qədər custom hook-lara çıxarılıb:

- Dashboard statistikaları: [`src/pages/home/hooks/useDashboardStats.ts`](src/pages/home/hooks/useDashboardStats.ts)
- Məhsul siyahısı: [`src/pages/products/hooks/useProductList.ts`](src/pages/products/hooks/useProductList.ts)
- Məhsul formu: [`src/pages/products/hooks/useProductForm.ts`](src/pages/products/hooks/useProductForm.ts)
- Kateqoriya siyahısı: [`src/pages/categories/hooks/useCategoryList.ts`](src/pages/categories/hooks/useCategoryList.ts)
- Kateqoriya formu: [`src/pages/categories/hooks/useCategoryForm.ts`](src/pages/categories/hooks/useCategoryForm.ts)
- Login flow: [`src/pages/login/hooks/useLoginFlow.ts`](src/pages/login/hooks/useLoginFlow.ts)

Create və edit modal-ları eyni komponent üzərindən işləyir:

```txt
id varsa -> edit mode
id yoxdursa -> create mode
```

## API endpointləri

### Auth

| Method | Endpoint | Məqsəd |
| --- | --- | --- |
| `POST` | `/auth/register` | Yeni istifadəçi qeydiyyatı |
| `POST` | `/auth/verify-email` | Email verification kodunun yoxlanması |
| `POST` | `/auth/resend-verification-code` | Verification kodunun yenidən göndərilməsi |
| `POST` | `/auth/login` | Login |
| `POST` | `/auth/logout` | Logout |
| `GET` | `/auth/profile` | Cari istifadəçi məlumatı |
| `POST` | `/auth/refresh` | Token yeniləmə |

### Dashboard

| Method | Endpoint | Məqsəd |
| --- | --- | --- |
| `GET` | `/dashboard/stats` | Dashboard statistikalarını gətirir |

### Products

| Method | Endpoint | Məqsəd |
| --- | --- | --- |
| `GET` | `/products` | Məhsul siyahısı |
| `GET` | `/products/:id` | Məhsul detalları |
| `POST` | `/products` | Yeni məhsul yaratmaq |
| `PATCH` | `/products/:id` | Məhsulu yeniləmək |
| `DELETE` | `/products/:id` | Məhsulu silmək |

### Categories

| Method | Endpoint | Məqsəd |
| --- | --- | --- |
| `GET` | `/categories` | Kateqoriya siyahısı |
| `GET` | `/categories/options` | Select üçün kateqoriya seçimləri |
| `GET` | `/categories/:id` | Kateqoriya detalları |
| `POST` | `/categories` | Yeni kateqoriya yaratmaq |
| `PATCH` | `/categories/:id` | Kateqoriyanı yeniləmək |
| `DELETE` | `/categories/:id` | Kateqoriyanı silmək |

### Upload

| Method | Endpoint | Məqsəd |
| --- | --- | --- |
| `POST` | `/uploads/product-images` | Məhsul şəkillərini yükləmək |

## Faydalı qeydlər

- API-lə bağlı əməliyyatlar `src/services` qovluğunda saxlanılır.
- UI və səhifə məntiqi ayrı saxlanıldığı üçün komponentlər daha oxunaqlıdır.
- Ant Design form, modal, table və notification komponentləri üçün istifadə olunur.
- Tailwind CSS layout, spacing və responsive görünüş üçün istifadə olunur.
- Build prosesi əvvəlcə TypeScript yoxlamasını, sonra Vite build mərhələsini icra edir.
