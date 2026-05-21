# Admin Panel

Bu layihə React, TypeScript, Redux Toolkit, React Router, Ant Design və Tailwind CSS ilə hazırlanmış admin paneldir. Panel məhsulların və kateqoriyaların idarə olunması, istifadəçi autentifikasiyası, dashboard statistikaları və məhsul şəkillərinin yüklənməsi üçün istifadə olunur.

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

## Quraşdırma

```bash
npm install
```

Layihəni development rejimində işə salmaq:

```bash
npm run dev
```

Production build yaratmaq:

```bash
npm run build
```

Build nəticəsini yoxlamaq:

```bash
npm run preview
```

## Environment

Layihədə backend ünvanı `.env` faylından oxunur.

```env
VITE_API_URL=http://161.97.154.119/intern-api/api
```

Bu dəyər `src/services/axiosInstance.ts` faylında `baseURL` kimi istifadə olunur. Bütün API sorğuları bu axios instance üzərindən göndərilir.

## Layihə strukturu

```txt
src/
  components/
    Layout.tsx
  pages/
    home/
    login/
    products/
    categories/
  routes/
    routes.tsx
    PrivateRoutes.tsx
    PublicRoutes.tsx
  services/
    axiosInstance.ts
    AuthService.ts
    ProductService.ts
    CategoryService.ts
    DashboardService.ts
    UploadService.ts
  store/
    store.ts
    hooks.ts
    authSlice.ts
  types/
  utils/
```

## Router məntiqi

Router sadə saxlanılıb. Private səhifələr `src/routes/routes.tsx` içində bir massivdə toplanıb.

```tsx
export const privateRoutes = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/categories", element: <Categories /> },
];
```

`App.tsx` Redux store-dakı auth vəziyyətinə baxır. İstifadəçi login olubsa private routes, login olmayıbsa public routes göstərilir.

## Redux və auth

Auth məlumatları `src/store/authSlice.ts` içində saxlanılır:

- `accessToken`
- `refreshToken`
- `user`
- `userEmail`
- `isAuthenticated`
- `loading`
- `error`

Login uğurlu olanda tokenlər və user məlumatı Redux state-ə yazılır və `localStorage`-da saxlanılır. Səhifə refresh olunanda `src/utils/authStorage.ts` həmin məlumatları oxuyur və auth state yenidən qurulur.

## Axios instance

`src/services/axiosInstance.ts` bütün API sorğuları üçün ortaq axios konfiqurasiyasıdır.

Əsas işi:

- `VITE_API_URL` dəyərini `baseURL` kimi istifadə edir.
- Hər sorğuya access token əlavə edir.
- `401` cavabı gələndə refresh token ilə yeni token almağa çalışır.
- Refresh uğursuz olsa, auth storage təmizlənir və istifadəçi login səhifəsinə yönləndirilir.

## Login səhifəsi

Login hissəsi `src/pages/login` qovluğundadır.

Burada üç əsas flow var:

- Login
- Register
- Email verify code

Bu flow-ların əsas məntiqi `src/pages/login/hooks/useLoginFlow.ts` içindədir. Komponentlər isə ayrıca saxlanılıb:

- `LoginForm.tsx`
- `RegisterForm.tsx`
- `VerifyForm.tsx`
- `LoginHero.tsx`

Bu struktur komponentləri sadə saxlayır, form əməliyyatlarını isə hook içində toplayır.

## Layout və sidebar

`src/components/Layout.tsx` admin panelin əsas görünüşünü qurur:

- Sidebar
- Header
- User adı və email
- Logout düyməsi
- Page content

Sidebar children məntiqi ilə işləyir. Private səhifələr bu layout içində göstərilir.

## Dashboard

Dashboard səhifəsi `src/pages/home/Home.tsx` faylıdır.

Burada göstərilən əsas məlumatlar:

- Kateqoriya sayı
- Məhsul sayı
- İstifadəçi sayı
- Ümumi stok
- Az stok
- İnventar dəyəri
- Son əlavə olunan məhsul

Data `DashboardService.getStats()` ilə backend-dən gəlir. Hook olaraq `src/pages/home/hooks/useDashboardStats.ts` istifadə olunur.

Son məhsul kartı ayrıca komponentdir:

```txt
src/pages/home/components/LatestProductCard.tsx
```

Bu kart məhsulun adını, şəkilini, kateqoriyasını, qiymətini, stokunu və statusunu göstərir. ID istifadəçiyə göstərilmir.

## Products səhifəsi

Products hissəsi `src/pages/products` qovluğundadır.

Əsas fayllar:

- `Products.tsx`
- `components/ProductsHeader.tsx`
- `components/ProductsTable.tsx`
- `components/ProductFormModal.tsx`
- `hooks/useProductList.ts`
- `hooks/useProductForm.ts`

`useProductList.ts` məhsulların siyahısını, pagination-u, search-u və category filter-i idarə edir.

`useProductForm.ts` create/edit modalının məntiqini saxlayır:

- yeni məhsul yaratmaq
- məhsulu redaktə etmək
- şəkil seçmək
- şəkil yükləmək
- şəkil silmək
- form payload hazırlamaq

Edit zamanı məhsulun id-si varsa, backend-dən təmiz data götürülür:

```txt
GET /products/:id
```

Save zamanı:

```txt
PATCH /products/:id
```

Create zamanı:

```txt
POST /products
```

Şəkil upload üçün:

```txt
POST /uploads/product-images
```

## Categories səhifəsi

Categories hissəsi `src/pages/categories` qovluğundadır.

Əsas fayllar:

- `Categories.tsx`
- `components/CategoryFormModal.tsx`
- `hooks/useCategoryList.ts`
- `hooks/useCategoryForm.ts`

`useCategoryList.ts` kateqoriya siyahısını, search və pagination məntiqini idarə edir.

`useCategoryForm.ts` create/edit modalının məntiqini saxlayır. Əgər edit zamanı category id varsa, backend-dən detail data götürülür:

```txt
GET /categories/:id
```

Save zamanı:

```txt
PATCH /categories/:id
```

Create zamanı:

```txt
POST /categories
```

## Create və edit modal məntiqi

Product və category üçün create/edit modal ayrı-ayrı deyil, eyni komponentdən gəlir.

Məntiq belədir:

```txt
id varsa -> edit mode
id yoxdursa -> create mode
```

Bu yanaşma kod təkrarını azaldır və modalın oxunaqlığını artırır.

## Responsive görünüş

Products və Categories səhifələrində böyük ekranda cədvəl, kiçik ekranda card görünüşü istifadə olunur.

Bu, kiçik pəncərədə horizontal scroll probleminin qarşısını alır və mobil görünüşü daha rahat edir.

## Əsas funksionallıqlar

- Login
- Register
- Email verify code
- Logout
- Protected routes
- Redux auth state
- Token refresh
- Dashboard stats
- Son əlavə olunan məhsul kartı
- Products CRUD
- Categories CRUD
- Product image upload
- Search
- Filter
- Pagination
- Responsive table/card görünüşü

## Faydalı qeydlər

- API sorğuları `services` qovluğunda saxlanılır.
- Form və səhifə məntiqi mümkün qədər custom hook-lara çıxarılıb.
- UI komponentləri `components` qovluqlarında ayrıca saxlanılır.
- Auth məlumatları Redux və localStorage ilə idarə olunur.
- Ant Design modal, table, form, button və notification komponentləri üçün istifadə olunur.
- Tailwind CSS layout və responsive görünüş üçün istifadə olunur.

