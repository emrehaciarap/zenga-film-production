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

  // Get content by section
  const getContent = (section: string) => {
    return aboutContent?.find((c: any) => c.section === section);
  };

  const vision = getContent("vision");
  const mission = getContent("mission");
  const story = getContent("story");

  // Default content if not set
  const defaultStory = `2015'ten beri Türk sinema ve reklam sektöründe öncü çalışmalara imza atan Zenga, yaratıcı vizyonu ve teknik mükemmeliyeti bir araya getiriyor. Her projemizde hikaye anlatımının gücüne inanıyor, izleyicilerimize unutulmaz deneyimler sunmayı hedefliyoruz.`;

  const defaultValues = [
    { id: 1, title: "Yaratıcılık", description: "Her projede yenilikçi ve özgün çözümler üretiyoruz.", icon: "lightbulb" },
    { id: 2, title: "Mükemmellik", description: "En yüksek kalite standartlarını hedefliyoruz.", icon: "star" },
    { id: 3, title: "İşbirliği", description: "Ekip çalışması ve ortak başarıya inanıyoruz.", icon: "users" },
    { id: 4, title: "Tutku", description: "Sinema sanatına olan tutkumuz bizi yönlendiriyor.", icon: "heart" },
  ];

  const defaultAchievements = [
    { id: 1, year: 2015, title: "Zenga Kuruldu", description: "İstanbul'da küçük bir stüdyo olarak yolculuğumuza başladık.", type: "milestone" },
    { id: 2, year: 2017, title: "İlk Ödülümüz", description: "Kısa film kategorisinde ulusal ödül.", type: "award" },
    { id: 3, year: 2019, title: "Uluslararası Tanınırlık", description: "Cannes Film Festivali'nde gösterim.", type: "award" },
    { id: 4, year: 2021, title: "Yeni Stüdyo", description: "Modern prodüksiyon tesisimize taşındık.", type: "milestone" },
    { id: 5, year: 2023, title: "50+ Proje", description: "50'den fazla başarılı projeyi tamamladık.", type: "milestone" },
  ];

  const displayValues = values && values.length > 0 ? values : defaultValues;
  const displayAchievements = achievements && achievements.length > 0 ? achievements : defaultAchievements;

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
              Zenga Film Prodüksiyon'un hikayesi, vizyonu ve değerleri.
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
                  {story?.title || "Sinema Tutkusuyla Başladı"}
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  {story?.content || defaultStory}
                </p>
              </div>
              <div className="relative aspect-video lg:aspect-square bg-secondary overflow-hidden">
                {story?.image ? (
                  <img
                    src={story.image}
                    alt="Zenga Hikayesi"
                    className="w-full h-full object-cover grayscale"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-muted-foreground/20">Z</span>
                  </div>
                )}
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
                  {vision?.title || "Türk Sinemasının Geleceğini Şekillendirmek"}
                </h3>
                <p className="mt-4 text-background/70 leading-relaxed">
                  {vision?.content ||
                    "Dünya standartlarında prodüksiyonlar üreterek Türk sinema ve reklam sektörünü uluslararası arenada temsil etmek."}
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
                  {mission?.title || "Hikayeleri Hayata Geçirmek"}
                </h3>
                <p className="mt-4 text-background/70 leading-relaxed">
                  {mission?.content ||
                    "Her projede yaratıcılık, teknik mükemmeliyet ve profesyonelliği bir araya getirerek unutulmaz içerikler üretmek."}
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
                Başarılar & Ödüller
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
