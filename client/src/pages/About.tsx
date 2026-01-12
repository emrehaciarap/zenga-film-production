import { useEffect, useRef } from "react";
import { Target, Eye, Heart, Award, Star, Zap, Users, Lightbulb } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

// Icon mapping for values
const iconMap: Record<string, any> = {
  target: Target,
  eye: Eye,
  heart: Heart,
  award: Award,
  star: Star,
  zap: Zap,
  users: Users,
  lightbulb: Lightbulb,
};

// Value Card Component
function ValueCard({ value, index }: { value: any; index: number }) {
  const Icon = iconMap[value.icon] || Star;

  return (
    <div
      className={cn(
        "p-6 border border-border bg-background",
        "animate-fade-in-up opacity-0"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Icon className="w-8 h-8 mb-4" />
      <h3 className="text-lg font-semibold">{value.title}</h3>
      {value.description && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {value.description}
        </p>
      )}
    </div>
  );
}

// Timeline Item Component
function TimelineItem({
  achievement,
  index,
  isLast,
}: {
  achievement: any;
  index: number;
  isLast: boolean;
}) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-center justify-center">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full items-center">
        {/* Left Content */}
        <div className={cn("w-1/2 pr-8", isLeft ? "text-right" : "opacity-0")}>
          {isLeft && (
            <div className="animate-fade-in opacity-0" style={{ animationDelay: `${index * 0.15}s` }}>
              <span className="text-sm text-muted-foreground">{achievement.year}</span>
              <h4 className="mt-1 font-semibold">{achievement.title}</h4>
              {achievement.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Center Line & Dot */}
        <div className="relative flex flex-col items-center">
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 border-foreground bg-background z-10",
              achievement.type === "award" && "bg-foreground"
            )}
          />
          {!isLast && <div className="w-px h-24 bg-border" />}
        </div>

        {/* Right Content */}
        <div className={cn("w-1/2 pl-8", !isLeft ? "text-left" : "opacity-0")}>
          {!isLeft && (
            <div className="animate-fade-in opacity-0" style={{ animationDelay: `${index * 0.15}s` }}>
              <span className="text-sm text-muted-foreground">{achievement.year}</span>
              <h4 className="mt-1 font-semibold">{achievement.title}</h4>
              {achievement.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex w-full">
        <div className="relative flex flex-col items-center mr-4">
          <div
            className={cn(
              "w-3 h-3 rounded-full border-2 border-foreground bg-background z-10",
              achievement.type === "award" && "bg-foreground"
            )}
          />
          {!isLast && <div className="w-px flex-1 bg-border" />}
        </div>
        <div className="flex-1 pb-8">
          <span className="text-sm text-muted-foreground">{achievement.year}</span>
          <h4 className="mt-1 font-semibold">{achievement.title}</h4>
          {achievement.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {achievement.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Partners Marquee Component
function PartnersMarquee({ partners }: { partners: any[] }) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  if (!partners || partners.length === 0) return null;

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className="overflow-hidden">
      <div
        ref={marqueeRef}
        className="flex items-center gap-12 animate-marquee"
        style={{ width: "max-content" }}
      >
        {duplicatedPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex-shrink-0 h-12 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
          >
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-full w-auto object-contain"
              />
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">
                {partner.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  const { data: aboutContent } = trpc.about.content.useQuery();
  const { data: values } = trpc.about.values.useQuery();
  const { data: achievements } = trpc.about.achievements.useQuery();
  const { data: partners } = trpc.about.partners.useQuery();

  // Zenga Yapım hikayesi
  const zengaStory = `Zenga Yapım, sinema ve edebiyatın gücünü aynı potada eritmek amacıyla 2023 yılında yönetmen Mahmut Fazıl Coşkun ve yazar Selahattin Yusuf tarafından kuruldu. İki sanatçının ortak vizyonuyla şekillenen ajansımız, kuruluşundan bu yana nitelikli ve derinliği olan içeriklerle sektöre imzasını atmaktadır.

Kısa sürede büyük projelere imza atan Zenga Yapım; T.C. Kültür ve Turizm Bakanlığı bünyesinde 5 farklı şehirde kültür festivallerinin organizasyonunu üstlenmiş, Tarih TV için hazırladığı 110 bölümlük kapsamlı belgesel serisiyle kolektif hafızaya değerli bir katkı sunmuştur. 2025 yılında Diyanet TV için hazırlanan 60 bölümlük "Mecelle Medeniyeti" belgeseliyle köklü mirasımızı ekranlara taşımaya devam etmiştir.

Zenga Yapım bugün, Selahattin Yusuf'un kaleme aldığı "Eve Dönemezsin" romanını TRT Tabii platformu için diziye uyarlayarak iddialı yapımlarına bir yenisini eklemeye hazırlanmaktadır. Estetiği, anlatıyı ve kültürel derinliği odağına alan firmamız, Türkiye'nin görsel ve kültürel hafızasında iz bırakmaya devam ediyor.`;

  // Zenga değerleri
  const zengaValues = [
    { 
      id: 1, 
      title: "Sanatsal Mükemmellik", 
      description: "Sinemanın estetiğini edebiyatın derinliğiyle buluşturarak, her projede sanatsal mükemmelliği hedefliyoruz.", 
      icon: "star" 
    },
    { 
      id: 2, 
      title: "Kültürel Derinlik", 
      description: "Kültürel mirastan dijital platformlara, anlatılmaya değer hikayelerin peşinden gidiyoruz.", 
      icon: "lightbulb" 
    },
    { 
      id: 3, 
      title: "Ödüllü Vizyon", 
      description: "Ödüllü yönetmen ve yazarların ortak vizyonuyla, Türkiye'nin görsel hafızasına nitelikli imzalar atıyoruz.", 
      icon: "award" 
    },
    { 
      id: 4, 
      title: "İşbirliği", 
      description: "Ekip çalışması ve ortak başarıya inanıyor, her projede güçlü bir ekip ruhuyla hareket ediyoruz.", 
      icon: "users" 
    },
  ];

  // Zenga başarıları
  const zengaAchievements = [
    { 
      id: 1, 
      year: 2023, 
      title: "Zenga Yapım Kuruldu", 
      description: "Mahmut Fazıl Coşkun ve Selahattin Yusuf'un ortak vizyonuyla İstanbul'da kuruldu.", 
      type: "milestone" 
    },
    { 
      id: 2, 
      year: 2023, 
      title: "Kültür Festivalleri", 
      description: "T.C. Kültür ve Turizm Bakanlığı bünyesinde 5 farklı şehirde kültür festivallerinin organizasyonunu üstlendi.", 
      type: "milestone" 
    },
    { 
      id: 3, 
      year: 2023, 
      title: "Necip Fazıl Roman Ödülü", 
      description: "Selahattin Yusuf, Necip Fazıl Roman Ödülü'nü Cumhurbaşkanı Recep Tayyip Erdoğan'ın elinden aldı.", 
      type: "award" 
    },
    { 
      id: 4, 
      year: 2024, 
      title: "Kuş Bakışı Türkiye", 
      description: "Tarih TV için 110 bölümlük kapsamlı belgesel serisi tamamlandı.", 
      type: "milestone" 
    },
    { 
      id: 5, 
      year: 2025, 
      title: "Mecelle Medeniyeti", 
      description: "Diyanet TV için 60 bölümlük belgesel serisi yayınlandı.", 
      type: "milestone" 
    },
    { 
      id: 6, 
      year: 2025, 
      title: "Eve Dönemezsin Dizisi", 
      description: "TRT Tabii platformu için Selahattin Yusuf'un romanından dizi uyarlaması başladı.", 
      type: "milestone" 
    },
  ];

  const displayValues = values && values.length > 0 ? values : zengaValues;
  const displayAchievements = achievements && achievements.length > 0 ? achievements : zengaAchievements;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Header */}
        <section className="py-12 md:py-20 bg-background border-b border-border">
          <div className="container">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Hakkımızda
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Zenga Yapım'ın hikayesi, vizyonu ve değerleri.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm uppercase tracking-wider text-muted-foreground">
                  Hikayemiz
                </span>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                  Sinema ve Edebiyatın Buluşması
                </h2>
                <div className="mt-6 text-lg text-muted-foreground leading-relaxed space-y-4">
                  {zengaStory.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="relative aspect-video lg:aspect-square bg-secondary overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl font-bold text-muted-foreground/20">ZENGA</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 md:py-32 bg-foreground text-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              {/* Vision */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6" />
                  <span className="text-sm uppercase tracking-wider opacity-70">
                    Vizyon
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Türkiye'nin Görsel Hafızasına İz Bırakmak
                </h3>
                <p className="mt-4 text-background/70 leading-relaxed">
                  Estetiği, anlatıyı ve kültürel derinliği odağına alan yapımlarımızla, Türkiye'nin görsel ve kültürel hafızasında kalıcı izler bırakmak. Yarının klasiklerini bugünden inşa etmek.
                </p>
              </div>

              {/* Mission */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6" />
                  <span className="text-sm uppercase tracking-wider opacity-70">
                    Misyon
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Nitelikli İçerikler Üretmek
                </h3>
                <p className="mt-4 text-background/70 leading-relaxed">
                  Sinema ve edebiyatın gücünü aynı potada eriterek, anlatılmaya değer hikayeleri ekrana taşımak. Her projede sanatsal mükemmellik ve kültürel derinlik sunmak.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center mb-12">
              <span className="text-sm uppercase tracking-wider text-muted-foreground">
                İlkelerimiz
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                Değerlerimiz
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayValues.map((value: any, index: number) => (
                <ValueCard key={value.id} value={value} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 md:py-32 bg-secondary">
          <div className="container">
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-wider text-muted-foreground">
                Yolculuğumuz
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                Başarılar & Kilometre Taşları
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              {displayAchievements.map((achievement: any, index: number) => (
                <TimelineItem
                  key={achievement.id}
                  achievement={achievement}
                  index={index}
                  isLast={index === displayAchievements.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        {partners && partners.length > 0 && (
          <section className="py-20 md:py-32 border-t border-border">
            <div className="container">
              <div className="text-center mb-12">
                <span className="text-sm uppercase tracking-wider text-muted-foreground">
                  Güvenilir Ortaklıklar
                </span>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                  Referanslarımız
                </h2>
              </div>

              <PartnersMarquee partners={partners} />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
