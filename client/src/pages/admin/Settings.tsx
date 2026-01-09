import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type SettingsForm = {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
};

const defaultForm: SettingsForm = {
  siteName: "Zenga Film Prodüksiyon",
  siteDescription: "Profesyonel film ve reklam prodüksiyon şirketi",
  logo: "",
  favicon: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  googleAnalyticsId: "",
  facebookPixelId: "",
};

export default function AdminSettings() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  const utils = trpc.useUtils();
  const { data: settings } = trpc.settings.list.useQuery();

  const setMutation = trpc.settings.set.useMutation({
    onSuccess: () => {
      utils.settings.list.invalidate();
    },
  });

  // Initialize form when data loads
  useEffect(() => {
    if (settings && settings.length > 0) {
      const getSettingValue = (key: string, defaultValue: string) => {
        const setting = settings.find((s: any) => s.settingKey === key);
        return setting?.settingValue || defaultValue;
      };

      setForm({
        siteName: getSettingValue("siteName", defaultForm.siteName),
        siteDescription: getSettingValue("siteDescription", defaultForm.siteDescription),
        logo: getSettingValue("logo", ""),
        favicon: getSettingValue("favicon", ""),
        metaTitle: getSettingValue("metaTitle", ""),
        metaDescription: getSettingValue("metaDescription", ""),
        metaKeywords: getSettingValue("metaKeywords", ""),
        googleAnalyticsId: getSettingValue("googleAnalyticsId", ""),
        facebookPixelId: getSettingValue("facebookPixelId", ""),
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save each setting
      for (const [key, value] of Object.entries(form)) {
        if (value) {
          await setMutation.mutateAsync({ key, value });
        }
      }
      toast.success("Ayarlar kaydedildi");
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground mt-1">Site ayarlarını yönetin</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Genel Ayarlar</CardTitle>
            <CardDescription>Site adı ve açıklaması</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Adı</Label>
              <Input
                id="siteName"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Açıklaması</Label>
              <Textarea
                id="siteDescription"
                value={form.siteDescription}
                onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Marka</CardTitle>
            <CardDescription>Logo ve favicon ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                Önerilen boyut: 200x50 piksel, PNG veya SVG formatı
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                value={form.favicon}
                onChange={(e) => setForm({ ...form, favicon: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                Önerilen boyut: 32x32 piksel, ICO veya PNG formatı
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Ayarları</CardTitle>
            <CardDescription>Arama motoru optimizasyonu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Başlık</Label>
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder="Zenga Film Prodüksiyon | Profesyonel Film ve Reklam"
              />
              <p className="text-xs text-muted-foreground">
                Önerilen uzunluk: 50-60 karakter
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Açıklama</Label>
              <Textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                placeholder="Zenga, Türkiye'nin önde gelen film ve reklam prodüksiyon şirketidir..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Önerilen uzunluk: 150-160 karakter
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Anahtar Kelimeler</Label>
              <Input
                id="metaKeywords"
                value={form.metaKeywords}
                onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                placeholder="film prodüksiyon, reklam, belgesel, müzik video"
              />
              <p className="text-xs text-muted-foreground">
                Virgülle ayırarak yazın
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analitik</CardTitle>
            <CardDescription>Ziyaretçi takibi ve analiz araçları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                value={form.googleAnalyticsId}
                onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
              <Input
                id="facebookPixelId"
                value={form.facebookPixelId}
                onChange={(e) => setForm({ ...form, facebookPixelId: e.target.value })}
                placeholder="XXXXXXXXXXXXXXX"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        <Save className="w-4 h-4 mr-2" />
        Ayarları Kaydet
      </Button>
    </div>
  );
}
