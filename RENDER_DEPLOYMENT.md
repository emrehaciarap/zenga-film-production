# Render.com Deployment Rehberi - Zenga Film Prodüksiyon

## 📋 İçindekiler
1. [GitHub Repository Bilgileri](#github-repository-bilgileri)
2. [Render.com'da Deployment Adımları](#rendercomda-deployment-adımları)
3. [Environment Variables Ayarları](#environment-variables-ayarları)
4. [Domain Bağlantısı](#domain-bağlantısı)
5. [Sorun Giderme](#sorun-giderme)

---

## GitHub Repository Bilgileri

**Repository URL**: https://github.com/emrehaciarap/zenga-film-production

**Repository Durumu**: Public (Herkes görebilir)

**Klonlama**:
```bash
git clone https://github.com/emrehaciarap/zenga-film-production.git
cd zenga-film-production
```

---

## Render.com'da Deployment Adımları

### Adım 1: Render.com'a Gir
1. https://render.com adresine git
2. "Sign up" → GitHub ile giriş yap
3. Render'ın GitHub erişim izni iste (Onayla)

### Adım 2: Yeni Web Service Oluştur
1. Render Dashboard'a gir
2. **"+ New"** butonuna tıkla
3. **"Web Service"** seç
4. **Repository seç**: `zenga-film-production`
5. **"Connect"** tıkla

### Adım 3: Deployment Ayarları
Render otomatik olarak `render.yaml` dosyasını okuyacak. Aşağıdaki ayarları kontrol et:

| Ayar | Değer | Açıklama |
|------|-------|----------|
| **Name** | zenga-film-production | Hizmetin adı |
| **Runtime** | Node | Node.js runtime |
| **Build Command** | `pnpm install && pnpm build` | Build komutu |
| **Start Command** | `NODE_ENV=production node dist/server.js` | Başlangıç komutu |
| **Plan** | Free | Ücretsiz plan |

### Adım 4: Environment Variables Ayarla
1. Deployment sayfasında **"Environment"** sekmesine git
2. Aşağıdaki değişkenleri ekle:

```
NODE_ENV = production
JWT_SECRET = (Render otomatik oluşturacak)
DATABASE_URL = file:./zenga.db
```

**Önemli**: JWT_SECRET'ı Render otomatik oluşturacak. Eğer manuel girmek istersen, güvenli bir değer kullan.

### Adım 5: Deploy Et
1. **"Deploy"** butonuna tıkla
2. Build ve deployment süreci başlayacak (5-10 dakika)
3. Tamamlandığında, Render sana bir URL verecek:
   - Örn: `https://zenga-film-production.onrender.com`

---

## Environment Variables Ayarları

### Render Dashboard'da Ayarlama

1. **Deployed Service'i seç**
2. Sol menüden **"Environment"** tıkla
3. **"Add Environment Variable"** tıkla

### Gerekli Variables

| Variable | Değer | Zorunlu | Açıklama |
|----------|-------|---------|----------|
| `NODE_ENV` | `production` | ✅ | Production ortamı |
| `JWT_SECRET` | `[güvenli-anahtar]` | ✅ | JWT imzalama anahtarı |
| `DATABASE_URL` | `file:./zenga.db` | ✅ | SQLite veritabanı |
| `PORT` | `10000` | ❌ | Render otomatik ayarlar |

### JWT_SECRET Oluşturma

Güvenli bir JWT_SECRET oluşturmak için:

```bash
# Terminal'de çalıştır
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Çıkan değeri Render'da `JWT_SECRET` olarak kaydet.

---

## Domain Bağlantısı

### Adım 1: Render'da Custom Domain Ekle

1. **Service Dashboard** → **"Settings"** sekmesi
2. **"Custom Domain"** bölümüne git
3. **"Add Custom Domain"** tıkla
4. Domain adını gir: `zengafilm.com.tr`
5. **"Add Domain"** tıkla

Render sana bir **CNAME record** verecek:
```
CNAME: zengafilm.com.tr → zenga-film-production.onrender.com
```

### Adım 2: İsimTecil'de DNS Ayarla

1. **İsimTecil.com** → Hesabına gir
2. **"Domainlerim"** → `zengafilm.com.tr` seç
3. **"DNS Ayarları"** → **"DNS Kayıtlarını Yönet"**
4. Mevcut A record'ları sil
5. **Yeni CNAME Record Ekle**:
   - **Ad**: `zengafilm.com.tr` (veya boş bırak)
   - **Tür**: `CNAME`
   - **Hedef**: `zenga-film-production.onrender.com`
   - **TTL**: 3600 (varsayılan)

6. **Kaydet** ve bekle (DNS yayılması 15-30 dakika sürebilir)

### Adım 3: SSL Sertifikası

Render otomatik olarak Let's Encrypt SSL sertifikası kuracak. HTTPS otomatik aktif olacak.

---

## Sorun Giderme

### Sorun: "Build Failed" Hatası

**Çözüm**:
1. Build log'unu kontrol et (Render Dashboard → Logs)
2. Genellikle `pnpm install` hatası
3. `pnpm-lock.yaml` dosyasının GitHub'da olduğundan emin ol

### Sorun: "Port Already in Use"

**Çözüm**: Render otomatik port ayarlar. `PORT` environment variable'ını silip tekrar deploy et.

### Sorun: "Database Connection Error"

**Çözüm**:
1. `DATABASE_URL` doğru ayarlandığını kontrol et
2. SQLite dosyası oluşturulduğundan emin ol
3. Veritabanı migration'ını çalıştır

### Sorun: Domain Çalışmıyor

**Çözüm**:
1. DNS yayılmasını bekle (15-30 dakika)
2. `nslookup zengafilm.com.tr` ile DNS'i kontrol et
3. CNAME record'unu doğru girdiğini doğrula
4. Render'da custom domain verified olduğundan emin ol

---

## Monitoring ve Logs

### Logs Görüntüleme

1. Render Dashboard → Service seç
2. **"Logs"** sekmesi
3. Build ve runtime log'larını gör

### Health Check

Render otomatik olarak `/` path'ine health check gönderir. Eğer hata alırsan:

1. Backend'in çalışıp çalışmadığını kontrol et
2. `render.yaml`'da `healthCheckPath` doğru ayarlandığını doğrula

---

## Deployment Sonrası

### 1. Veritabanı Kurulumu

İlk deployment'tan sonra:

```bash
# Local'de çalıştır
pnpm db:push
```

Veya Render'da **"Run Command"** kullan:
```bash
pnpm db:push
```

### 2. Admin Kullanıcı Oluşturma

```bash
# Local'de
pnpm exec tsx scripts/create-admin.ts

# Render'da (SSH ile)
render run pnpm exec tsx scripts/create-admin.ts
```

### 3. Test Et

1. https://zenga-film-production.onrender.com adresine git
2. /login sayfasına git
3. Admin bilgileriyle giriş yap
4. Admin paneli çalışıyor mu kontrol et

---

## Güvenlik Notları

⚠️ **Önemli**:
- JWT_SECRET'ı asla public repo'ya commit etme
- Environment variables'ları Render'da sakla
- Production'da güvenli şifre kullan
- Regular backups al

---

## İletişim ve Destek

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **GitHub Issues**: https://github.com/emrehaciarap/zenga-film-production/issues

---

**Son Güncelleme**: 2026-01-09
**Versiyon**: 1.0
