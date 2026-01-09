# Zenga Film Prodüksiyon Website

Modern, responsive ve yönetim paneli ile birlikte gelen Zenga Film Prodüksiyon websitesi.

## Özellikler

### Genel Özellikler
- ✨ Modern ve minimalist tasarım
- 📱 Tamamen responsive (mobil, tablet, desktop)
- 🎨 Siyah-beyaz tema
- ⚡ Hızlı yükleme
- 🔍 SEO optimizasyonu

### İçerik Yönetimi
- 🎬 **Projeler**: Film, reklam, belgesel, müzik video projelerini yönetin
- 📸 **Galeriler**: Her proje için görsel galerisi
- 🎥 **Videolar**: Video URL'leri ve embed desteği
- 👥 **Ekip**: Ekip üyelerini ve pozisyonlarını yönetin
- 📊 **Organizasyon Şeması**: İnteraktif organizasyon şeması
- 📝 **Hakkımızda**: Vizyon, misyon, değerler ve başarılar
- 📧 **İletişim**: İletişim formları ve mesaj yönetimi

### Admin Paneli
- 🔐 Email/Şifre ile güvenli giriş
- 📋 Tüm içeriği yönetme
- 🖼️ Görsel yükleme ve yönetimi
- ⚙️ Site ayarları (logo, favicon, SEO)
- 📊 Dashboard

## Teknoloji Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animasyonlar
- **Wouter** - Routing

### Backend
- **Express** - Web server
- **tRPC** - Type-safe API
- **Drizzle ORM** - Database ORM
- **MySQL** - Database

### Kimlik Doğrulama
- **JWT** - Token-based auth
- **bcrypt** - Password hashing
- **Jose** - JWT işlemleri

## Kurulum

### Hızlı Başlangıç

1. **Bağımlılıkları yükleme**
   ```bash
   pnpm install
   ```

2. **Environment variables ayarlama**
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin
   ```

3. **Veritabanı kurulumu**
   ```bash
   DATABASE_URL="your-db-url" pnpm db:push
   ```

4. **Admin kullanıcı oluşturma**
   ```bash
   DATABASE_URL="your-db-url" tsx scripts/create-admin.ts admin@example.com "password"
   ```

5. **Development sunucusu başlatma**
   ```bash
   pnpm dev
   ```

6. **Tarayıcıda açma**
   - Ana site: http://localhost:5173
   - Admin paneli: http://localhost:5173/admin
   - Giriş: http://localhost:5173/login

Detaylı kurulum talimatları için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

## Proje Yapısı

```
zenga/
├── client/                 # React frontend
│   └── src/
│       ├── pages/         # Sayfalar
│       │   ├── admin/     # Admin paneli sayfaları
│       │   └── ...        # Public sayfalar
│       ├── components/    # React bileşenleri
│       └── lib/           # Utility fonksiyonları
├── server/                # Express backend
│   ├── _core/            # Çekirdek modüller
│   ├── routers.ts        # tRPC routers
│   └── db.ts             # Database işlemleri
├── drizzle/              # Database schema
├── shared/               # Shared types ve constants
└── scripts/              # Utility scripts
```

## API Endpoints

### Authentication
- `POST /trpc/auth.login` - Giriş yap
- `POST /trpc/auth.register` - Yeni kullanıcı oluştur
- `POST /trpc/auth.logout` - Çıkış yap
- `GET /trpc/auth.me` - Mevcut kullanıcı bilgisi

### Projects
- `GET /trpc/projects.list` - Tüm projeleri listele
- `GET /trpc/projects.featured` - Öne çıkan projeleri listele
- `POST /trpc/projects.create` - Yeni proje oluştur (Admin)
- `PUT /trpc/projects.update` - Proje güncelle (Admin)
- `DELETE /trpc/projects.delete` - Proje sil (Admin)

### Team
- `GET /trpc/team.list` - Ekip üyelerini listele
- `POST /trpc/team.create` - Ekip üyesi ekle (Admin)
- `PUT /trpc/team.update` - Ekip üyesi güncelle (Admin)
- `DELETE /trpc/team.delete` - Ekip üyesi sil (Admin)

Diğer endpoints için tRPC router'ları kontrol edin.

## Yönetim Paneli Kullanımı

### Giriş Yapma
1. `/login` sayfasına gidin
2. Admin e-postanız ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın

### Proje Ekleme
1. Admin panelinde "Projeler" bölümüne gidin
2. "Yeni Proje" butonuna tıklayın
3. Proje bilgilerini doldurun
4. Görsel ve videoları yükleyin
5. "Kaydet" butonuna tıklayın

### Ekip Üyesi Ekleme
1. "Ekip" bölümüne gidin
2. "Yeni Üye" butonuna tıklayın
3. Üye bilgilerini doldurun
4. Fotoğrafını yükleyin
5. "Kaydet" butonuna tıklayın

## Veritabanı Schema

### Users Table
- `id` - Kullanıcı ID
- `email` - E-posta adresi (unique)
- `passwordHash` - Şifreli şifre
- `name` - Kullanıcı adı
- `role` - Rol (admin, user)
- `createdAt` - Oluşturma tarihi
- `updatedAt` - Güncelleme tarihi

### Projects Table
- `id` - Proje ID
- `title` - Başlık
- `slug` - URL-friendly slug
- `category` - Kategori (film, reklam, belgesel, muzik_video)
- `shortDescription` - Kısa açıklama
- `fullDescription` - Tam açıklama
- `thumbnail` - Kapak görseli
- `gallery` - Görsel galerisi (JSON)
- `videoUrl` - Video URL'i
- `status` - Durum (active, coming_soon, draft)
- `isFeatured` - Öne çıkan mı?
- `sortOrder` - Sıralama

Diğer tablolar için [drizzle/schema.ts](./drizzle/schema.ts) dosyasına bakın.

## Çevre Değişkenleri

### Gerekli
- `DATABASE_URL` - Veritabanı bağlantı URL'i
- `JWT_SECRET` - JWT imzalama secret'ı

### Opsiyonel
- `OAUTH_SERVER_URL` - OAuth sunucusu URL'i
- `VITE_OAUTH_PORTAL_URL` - OAuth portal URL'i
- `VITE_APP_ID` - Uygulama ID'si
- `OWNER_OPEN_ID` - Sahip OpenID'si
- `NODE_ENV` - Ortam (development, production)

## Build ve Deployment

### Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
```

### Production Çalıştırma
```bash
pnpm start
```

## Lisans

MIT

## İletişim

Sorular ve öneriler için lütfen admin@zenga.com adresine yazın.
