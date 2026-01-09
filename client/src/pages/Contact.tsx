import { useState } from "react";
import { MapPin, Phone, Mail, Send, Loader2, Check, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const projectTypes = [
  { value: "film", label: "Film" },
  { value: "reklam", label: "Reklam" },
  { value: "belgesel", label: "Belgesel" },
  { value: "muzik_video", label: "Müzik Video" },
  { value: "diger", label: "Diğer" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "" as "film" | "reklam" | "belgesel" | "muzik_video" | "diger" | "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: contactInfo } = trpc.contact.info.useQuery();

  const sendMessageMutation = trpc.contact.sendMessage.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
      });
      toast.success("Mesajınız başarıyla gönderildi!");
    },
    onError: (error) => {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      sendMessageMutation.mutate({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        projectType: formData.projectType || undefined,
        message: formData.message,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (isSubmitted) setIsSubmitted(false);
  };

  // Default contact info
  const defaultContactInfo = {
    address: "Levent, İstanbul, Türkiye",
    phone: "+90 212 XXX XX XX",
    email: "info@zenga.com.tr",
    mapLat: "41.0821",
    mapLng: "29.0109",
  };

  const displayInfo = contactInfo || defaultContactInfo;

  const socialLinks = [
    { icon: Facebook, href: contactInfo?.facebook, label: "Facebook" },
    { icon: Instagram, href: contactInfo?.instagram, label: "Instagram" },
    { icon: Twitter, href: contactInfo?.twitter, label: "Twitter" },
    { icon: Youtube, href: contactInfo?.youtube, label: "YouTube" },
    { icon: Linkedin, href: contactInfo?.linkedin, label: "LinkedIn" },
  ].filter((link) => link.href);

  // Google Maps Embed URL with grayscale styling
  const mapUrl = displayInfo.mapLat && displayInfo.mapLng
    ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.5!2d${displayInfo.mapLng}!3d${displayInfo.mapLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzU1LjYiTiAyOcKwMDAnMzkuMiJF!5e0!3m2!1str!2str!4v1234567890`
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Header */}
        <section className="py-12 md:py-20 bg-background border-b border-border">
          <div className="container">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              İletişim
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Projeleriniz için bizimle iletişime geçin. Hayalinizdeki projeyi
              birlikte hayata geçirelim.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Bize Yazın</h2>

                {isSubmitted ? (
                  <div className="p-8 border border-border bg-secondary text-center">
                    <Check className="w-12 h-12 mx-auto text-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Mesajınız Alındı</h3>
                    <p className="mt-2 text-muted-foreground">
                      En kısa sürede size dönüş yapacağız.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Yeni Mesaj Gönder
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                          placeholder="Adınız Soyadınız"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+90 5XX XXX XX XX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Proje Türü</Label>
                        <Select
                          value={formData.projectType}
                          onValueChange={(value) => handleChange("projectType", value)}
                        >
                          <SelectTrigger id="projectType">
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mesajınız *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        required
                        placeholder="Projeniz hakkında bize bilgi verin..."
                        rows={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={sendMessageMutation.isPending}
                    >
                      {sendMessageMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Gönder
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Info & Map */}
              <div>
                <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>

                <div className="space-y-6">
                  {/* Address */}
                  {displayInfo.address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-secondary flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Adres</h4>
                        <p className="text-muted-foreground mt-1">
                          {displayInfo.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {displayInfo.phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-secondary flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Telefon</h4>
                        <a
                          href={`tel:${displayInfo.phone}`}
                          className="text-muted-foreground mt-1 hover:text-foreground transition-colors"
                        >
                          {displayInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {displayInfo.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-secondary flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">E-posta</h4>
                        <a
                          href={`mailto:${displayInfo.email}`}
                          className="text-muted-foreground mt-1 hover:text-foreground transition-colors"
                        >
                          {displayInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {socialLinks.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold mb-4">Sosyal Medya</h4>
                      <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                          <a
                            key={social.label}
                            href={social.href!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-secondary hover:bg-foreground hover:text-background transition-colors"
                            aria-label={social.label}
                          >
                            <social.icon className="w-5 h-5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="mt-8">
                  <div className="aspect-video bg-secondary grayscale-map overflow-hidden">
                    {mapUrl ? (
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Zenga Konum"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
