# Zenga Film Prodüksiyon - Deployment Rehberi

## Sistem Gereksinimleri

- Node.js 22.13.0 veya üzeri
- MySQL 8.0 veya üzeri (veya TiDB)
- pnpm 10.4.1 veya üzeri

## Kurulum Adımları

### 1. Environment Variables Ayarlama

`.env` dosyasını oluşturun ve aşağıdaki değişkenleri ayarlayın:

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/zenga"

# JWT Secret (şifreleme için)
JWT_SECRET="your-secret-key-here-change-this-in-production"

# OAuth (opsiyonel - sadece Manus OAuth kullanacaksanız)
OAUTH_SERVER_URL="https://oauth.example.com"
VITE_OAUTH_PORTAL_URL="https://portal.example.com"
VITE_APP_ID="your-app-id"
OWNER_OPEN_ID="your-owner-id"

# Node Environment
NODE_ENV="production"
```

### 2. Bağımlılıkları Yükleme

```bash
pnpm install
```

### 3. Veritabanı Migration'ı Çalıştırma

```bash
DATABASE_URL="your-database-url" pnpm db:push
```

### 4. Admin Kullanıcı Oluşturma

İlk admin kullanıcıyı oluşturmak için:

```bash
DATABASE_URL="your-database-url" tsx scripts/create-admin.ts admin@example.com "your-password-here"
```

Örnek:
```bash
DATABASE_URL="mysql://root:password@localhost:3306/zenga" tsx scripts/create-admin.ts admin@zenga.com "13544425mibmiB-."
```

### 5. Projeyi Build Etme

```bash
pnpm build
```

### 6. Projeyi Çalıştırma

Development ortamında:
```bash
pnpm dev
```

Production ortamında:
```bash
pnpm start
```

## Giriş Bilgileri

### Admin Paneline Erişim

1. Tarayıcıda `http://localhost:5173/login` adresine gidin (development) veya domain'inize gidin
2. Admin e-postanız ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın

### Admin Paneli Özellikleri

- **Projeler**: Film, reklam, belgesel, müzik video projelerini yönetin
- **Pek Yakında**: Yakında yayınlanacak projeleri ekleyin
- **Ekip**: Ekip üyelerini ve pozisyonlarını yönetin
- **Organizasyon**: Organizasyon şemasını düzenleyin
- **Hakkımızda**: Şirket bilgilerini güncelleyin
- **İletişim**: İletişim mesajlarını yönetin
- **Ayarlar**: Site ayarlarını (logo, favicon, SEO) yapılandırın

## Domain Bağlantısı

### 1. DNS Ayarları

Domain sağlayıcınızda aşağıdaki DNS kayıtlarını ekleyin:

```
A Record: @ -> your-server-ip
CNAME Record: www -> your-domain.com
```

### 2. SSL Sertifikası (Let's Encrypt)

Nginx/Apache ile Let's Encrypt kullanıyorsanız:

```bash
# Certbot ile
certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

### 3. Reverse Proxy Ayarları (Nginx Örneği)

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Veritabanı Yedekleme

Düzenli olarak veritabanını yedekleyin:

```bash
# MySQL Dump
mysqldump -u user -p database_name > backup-$(date +%Y%m%d).sql

# Geri yükleme
mysql -u user -p database_name < backup-20240109.sql
```

## Sorun Giderme

### "DATABASE_URL is required" Hatası

`.env` dosyasının doğru konumda olduğundan ve `DATABASE_URL` değişkeninin ayarlandığından emin olun.

### Giriş Sayfasında "Invalid email or password"

- Admin kullanıcısının doğru oluşturulduğundan emin olun
- E-posta ve şifrenin doğru olduğunu kontrol edin
- Veritabanı bağlantısının çalışıp çalışmadığını kontrol edin

### Admin Paneline Erişilemiyor

- Giriş yaptığınızdan emin olun
- Tarayıcı çerezlerini temizlemeyi deneyin
- Konsol hatalarını kontrol edin (F12 > Console)

## Güvenlik Önerileri

1. **JWT_SECRET**: Production ortamında güçlü bir secret kullanın
2. **Şifre**: Admin şifresi en az 8 karakter olmalı, karmaşık olmalı
3. **HTTPS**: Her zaman HTTPS kullanın
4. **Veritabanı**: Veritabanı erişimini güvenli ağ üzerinden sınırlandırın
5. **Yedekleme**: Düzenli olarak veritabanı yedekleyin

## Destek

Sorunlar için lütfen admin e-postasından iletişime geçin.
