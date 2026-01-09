# Zenga Film Prodüksiyon - Kurulum Rehberi

## İlk Adımlar

Bu rehber, Zenga Film Prodüksiyon website'ini kendi sunucunuzda kurmak için adım adım talimatlar içerir.

## Sistem Gereksinimleri

- **İşletim Sistemi**: Linux (Ubuntu 20.04+), macOS, veya Windows (WSL2)
- **Node.js**: 22.13.0 veya üzeri
- **pnpm**: 10.4.1 veya üzeri
- **MySQL**: 8.0 veya üzeri (veya uyumlu bir veritabanı)
- **Disk Alanı**: En az 2GB

## Adım 1: Projeyi Klonlama veya İndirme

```bash
# Eğer Git kullanıyorsanız:
git clone <repository-url> zenga
cd zenga

# Veya ZIP dosyasından:
unzip zenga.zip
cd zenga
```

## Adım 2: Bağımlılıkları Yükleme

```bash
pnpm install
```

Bu komut tüm Node.js bağımlılıklarını yükleyecektir.

## Adım 3: Veritabanı Hazırlığı

### MySQL Veritabanı Oluşturma

```bash
# MySQL'e bağlanın
mysql -u root -p

# Veritabanı oluşturun
CREATE DATABASE zenga CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Kullanıcı oluşturun (opsiyonel)
CREATE USER 'zenga_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON zenga.* TO 'zenga_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Adım 4: Environment Variables Ayarlama

Proje kökünde `.env` dosyası oluşturun:

```bash
# Temel konfigürasyon
NODE_ENV=production

# Veritabanı
DATABASE_URL="mysql://zenga_user:strong_password_here@localhost:3306/zenga"

# JWT Secret (güvenli bir string oluşturun)
JWT_SECRET="your-super-secret-key-change-this-in-production"

# OAuth (Manus OAuth kullanacaksanız)
OAUTH_SERVER_URL="https://oauth.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"
VITE_APP_ID="your-app-id"
OWNER_OPEN_ID="your-owner-id"
```

## Adım 5: Veritabanı Migration'ı Çalıştırma

```bash
DATABASE_URL="mysql://zenga_user:strong_password_here@localhost:3306/zenga" pnpm db:push
```

## Adım 6: Admin Kullanıcı Oluşturma

```bash
DATABASE_URL="mysql://zenga_user:strong_password_here@localhost:3306/zenga" tsx scripts/create-admin.ts admin@zenga.com "13544425mibmiB-."
```

## Adım 7: Projeyi Build Etme

```bash
pnpm build
```

## Adım 8: Projeyi Çalıştırma

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm start
```

## Domain Bağlantısı

DNS ayarlarını domain sağlayıcınızda yapılandırın ve Nginx reverse proxy kurun.

Detaylı bilgi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

## Sorun Giderme

Sorunlar için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasının "Sorun Giderme" bölümüne bakın.
