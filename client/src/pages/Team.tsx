import { useState } from "react";
import { User, Linkedin, Film as ImdbIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const departments = [
  { value: "all", label: "Tümü" },
  { value: "yonetim", label: "Yönetim" },
  { value: "kreatif", label: "Kreatif" },
  { value: "produksiyon", label: "Prodüksiyon" },
  { value: "teknik", label: "Teknik" },
];

const departmentLabels: Record<string, string> = {
  yonetim: "Yönetim",
  kreatif: "Kreatif",
  produksiyon: "Prodüksiyon",
  teknik: "Teknik",
};

// Zenga Ekip Üyeleri
const zengaTeamMembers = [
  {
    id: 1,
    name: "Mahmut Fazıl Coşkun",
    position: "Yönetmen & Senarist / Kurucu Ortak",
    department: "yonetim",
    shortBio: "1973 yılında doğan Mahmut Fazıl Coşkun, UCLA'de eğitim almış, Türk sinemasının uluslararası arenadaki en önemli temsilcilerinden biri.",
    fullBio: `1973 yılında doğan Mahmut Fazıl Coşkun, Yıldız Teknik Üniversitesi'ndeki eğitiminin ardından sinema dünyasına adım atmış, eğitimini UCLA'de (University of California, Los Angeles) Film, TV ve Yeni Medya bölümlerinde tamamlamıştır.

Türk sinemasının uluslararası arenadaki en önemli temsilcilerinden biri olan Coşkun; senaristliğini ve yönetmenliğini üstlendiği yapımlarla Rotterdam, Venedik ve İstanbul gibi dünyanın en prestijli film festivallerinden çok sayıda ödülle dönmüştür. Sinemadaki kendine özgü estetik diliyle tanınan Coşkun, halen yeni uzun metrajlı sinema projesi olan "Ölüleri Yakma Cemiyeti" üzerinde çalışmalarını sürdürmektedir.

Seçilmiş Filmografi: Uzak İhtimal (2009) - Rotterdam Film Festivali Kaplan Ödülü, Yozgat Blues (2013) - Varşova ve San Sebastian ödülleri, Anons (2018) - Venedik Film Festivali Orizzonti Bölümü Jüri Özel Ödülü, Crossroads (2022), Derin Mor (2023).`,
    imdbUrl: "https://www.imdb.com/name/nm2543633/",
    photo: null,
  },
  {
    id: 2,
    name: "Selahattin Yusuf",
    position: "Yazar & Kurucu Ortak",
    department: "yonetim",
    shortBio: "1974 yılında Trabzon'da doğan Selahattin Yusuf, 2023 Necip Fazıl Roman Ödülü sahibi, Türk edebiyatının önemli isimlerinden.",
    fullBio: `1974 yılında Trabzon'da doğan Selahattin Yusuf, Türkiye'nin en köklü okullarından biri olan Ankara Üniversitesi Siyasal Bilgiler Fakültesi'nden (Mülkiye) mezun olmuştur. Kariyeri boyunca serbest yazarlık ve televizyon yorumculuğu yapan Yusuf, özellikle roman ve öykü türünde Türk edebiyatına özgün eserler kazandırmıştır.

Edebiyat dünyasındaki yetkinliğini 2023 yılında prestijli Necip Fazıl Roman Ödülü ile taçlandıran Selahattin Yusuf, ödülünü Cumhurbaşkanı Sayın Recep Tayyip Erdoğan'ın elinden almıştır. Zenga Yapım bünyesinde edebi derinliği sinematografik vizyonla birleştiren Yusuf, halen roman çalışmalarına ve dizi/film senaryo projelerine odaklanmaktadır.

TRT Tabii platformu için hazırlanan "Eve Dönemezsin" dizisi, kendi romanından uyarlanmaktadır.`,
    imdbUrl: null,
    photo: null,
  },
  {
    id: 3,
    name: "Mahmut İslam Bilir",
    position: "İdari Yapımcı",
    department: "produksiyon",
    shortBio: "1987 yılında Kahramanmaraş'ta doğdu. Elektrik Mühendisliği ve Sosyoloji eğitimlerinin ardından sinema ve belgesel alanında uzmanlaştı.",
    fullBio: `1987 yılında Kahramanmaraş'ta doğan Mahmut İslam Bilir, akademik altyapısını disiplinlerarası bir derinlik üzerine inşa etmiştir. Yıldız Teknik Üniversitesi Elektrik Mühendisliği bölümünden mezun olduktan sonra, toplum ve sanat arasındaki bağları güçlendirmek amacıyla Sosyoloji eğitimine yönelmiş; eş zamanlı olarak İbn Haldun Üniversitesi'nde Radyo, Televizyon ve Sinema alanında yüksek lisans çalışmalarına başlamıştır.

Genç yaşlarda fotoğrafla başlayan görsel yolculuğu, kısa sürede sinema ve belgesel alanına evrilmiştir. Mühendislik formasyonunun getirdiği analitik disiplini film yapım süreçlerine entegre eden Bilir, yapımcılığın operasyonel ve stratejik kanadında uzmanlaşmıştır. Kariyeri boyunca 3 uzun metrajlı film, popüler dijital platform dizileri ve 140 bölümü aşan geniş ölçekli belgesel projelerinin idari liderliğini üstlenmiştir.

Öne Çıkan Projeler: Şanzelize Düğün Salonu (Dizi), Can Kuşu, Kuş Bakışı Türkiye (81 Bölüm), Mecelle Medeniyeti (60 Bölüm), Ankara Okulu ve çok sayıda festival organizasyonu.`,
    imdbUrl: null,
    photo: null,
  },
  {
    id: 4,
    name: "Emrah Göçen",
    position: "Uygulayıcı Yapımcı",
    department: "produksiyon",
    shortBio: "90'ı aşkın dizi, sinema filmi, belgesel ve reklam projesinde Uygulayıcı Yapımcı (Line Producer) olarak görev aldı.",
    fullBio: `Sinema ve televizyon sektörünün operasyonel süreçlerinde köklü bir kariyere sahip olan Emrah Göçen, bugüne kadar 90'ı aşkın dizi, sinema filmi, belgesel ve reklam projesinde Uygulayıcı Yapımcı (Line Producer) olarak görev almıştır. Saha yönetiminden bütçe planlamasına, teknik koordinasyondan set operasyonlarına kadar yapım sürecinin her aşamasında derin bir tecrübeye sahiptir.

Hem ulusal hem de uluslararası çapta büyük prodüksiyonlara imza atan Göçen, projelerin kağıt üzerindeki hazırlık aşamasından ekrana yansıyan son haline kadar olan tüm teknik ve idari süreçleri yüksek profesyonellikle yönetmektedir.

Emrah Göçen, şu anda Zenga Yapım bünyesinde, TRT Tabii platformu için hayata geçirilen iddialı proje "Eve Dönemezsin" dizisinin Uygulayıcı Yapımcılığını üstlenmektedir.`,
    imdbUrl: "https://www.imdb.com/name/nm4851273/",
    photo: null,
  },
  {
    id: 5,
    name: "George Ovashvili",
    position: "Yönetmen, Senarist & Yapımcı",
    department: "kreatif",
    shortBio: "Gürcü sinemasının uluslararası prestijli temsilcisi. Oscar Kısa Listesi'ne giren 'Corn Island' filmiyle tanınır.",
    fullBio: `Gürcü sinemasının uluslararası arenadaki en prestijli temsilcilerinden biri olan George Ovashvili; Berlin, Karlovy Vary ve Oscar gibi sinema dünyasının zirve noktalarında kabul görmüş bir yönetmendir. Hollywood Universal Stüdyoları bünyesindeki New York Film Akademisi'nde eğitim alan Ovashvili, hikaye anlatıcılığındaki görsel derinlik ve insani odaklı sinemasıyla tanınır.

Dünya çapında 50'den fazla ödül kazanan "The Other Bank" filmiyle Avrupa Film Ödülleri'nde (EFA) adaylık elde etmiş; ikinci uzun metrajı "Corn Island" (Mısır Adası) ile Karlovy Vary Film Festivali'nde büyük ödül olan "Kristal Küre"yi kazanarak Akademi Ödülleri'nde (Oscar) "En İyi Yabancı Film" kategorisinde ilk 9 film (Shortlist) arasına girmeyi başarmıştır.

Tiflis merkezli Wagonnet Films'in de kurucusu olan Ovashvili, Zenga Yapım ile uluslararası ortak yapımlar ve sanatsal sinema projelerinde stratejik iş birliği içinde bulunmaktadır.`,
    imdbUrl: "https://www.imdb.com/name/nm1653199/",
    photo: null,
  },
  {
    id: 6,
    name: "Andreas Sinanos",
    position: "Görüntü Yönetmeni (Cinematographer)",
    department: "teknik",
    shortBio: "Dünya sinemasının efsane görüntü yönetmenlerinden. Theo Angelopoulos'un filmlerinde çalıştı.",
    fullBio: `Dünya sinemasının yaşayan efsanelerinden biri olan Andreas Sinanos, ışığın ve kompozisyonun şiirsel dilini beyaz perdeye aktaran en önemli görüntü yönetmenlerinden biridir. Özellikle Yunan sinemasının dünyaca ünlü ustası Theo Angelopoulos ile gerçekleştirdiği uzun soluklu iş birliğiyle (The Weeping Meadow, The Dust of Time) sinema tarihine adını yazdırmıştır.

Sinanos, sadece Avrupa sinemasında değil, Türk sinemasında da derin izler bırakmıştır. Işığı bir ressam titizliğiyle kullanması ve uzun planlardaki ustalığıyla tanınan Sinanos, Zenga Yapım'ın görsel estetik anlayışına ve uluslararası projelerine dünya standartlarında bir derinlik katmaktadır.

Seçilmiş Filmografi: The Weeping Meadow (Ağlayan Çayır), The Dust of Time (Zamanın Tozu), Eternity and a Day (Sonsuzluk ve Bir Gün).`,
    imdbUrl: "https://www.imdb.com/name/nm0801823/",
    photo: null,
  },
  {
    id: 7,
    name: "Zeynep Burcu Keçecioğlu",
    position: "Yardımcı Yönetmen & Senarist",
    department: "kreatif",
    shortBio: "Mimar Sinan Güzel Sanatlar Üniversitesi mezunu. Netflix, BBC Studios, Disney projelerinde çalıştı.",
    fullBio: `Mimar Sinan Güzel Sanatlar Üniversitesi Sinema ve Televizyon bölümünden mezun olan Zeynep Burcu Keçecioğlu, uluslararası sinema ve dizi sektöründe geniş bir tecrübeye sahip olan nitelikli bir yardımcı yönetmen ve senaristtir. Netflix, BBC Studios, Disney ve Euroimage destekli pek çok prestijli yapımda üstlendiği kritik rollerle tanınmaktadır.

Kariyeri boyunca yerel ve küresel prodüksiyonlar arasında köprü kuran Keçecioğlu, set yönetimi, çekim planlaması ve yaratıcı süreçlerin koordinasyonu konularında uzmanlaşmıştır. Şu anda "Beyond the Sea" adlı uzun metrajlı orijinal senaryo projesini geliştirmekte olan Keçecioğlu, Zenga Yapım projelerinde kreatif ve operasyonel gücüyle yer almaktadır.

Seçilmiş Filmografi: Pera (Disney), The Night Agent (Netflix/Sony), Man Like Mobeen (BBC Studios), The Amateur (20th Century Studios), Cairo Conspiracy, Gibi/As If, Vatanım Sensin.`,
    imdbUrl: "https://www.imdb.com/name/nm5576998/",
    photo: null,
  },
  {
    id: 8,
    name: "Bülent Yörük",
    position: "Senarist",
    department: "kreatif",
    shortBio: "Ege Üniversitesi Sinema ve Televizyon bölümü mezunu. 'Ben Bu Cihana Sığmazam' dizisinin senaryo ekibinde yer aldı.",
    fullBio: `Ege Üniversitesi Sinema ve Televizyon bölümünden mezun olan Bülent Yörük, edebiyat altyapısını sinematografik anlatıyla birleştiren çok yönlü bir senaristtir. Kariyeri boyunca Zeynep Atakan (Yapımlab) ve Prof. Dr. Beliz Güçbilmez gibi sektörün duayen isimlerinden yaratıcı yazarlık ve yapım eğitimi alan Yörük, hem ana akım televizyon projelerinde hem de bağımsız sinemada yetkinliğini kanıtlamıştır.

ATV'de yayınlanan "Ben Bu Cihana Sığmazam" dizisinin senaryo ekibinde yer alan ve farklı yapım evlerinde drama raportörlüğü ve senaryo koordinasyonu görevlerini üstlenen Yörük, hikaye tasarımı ve dramatik yapı kurma süreçlerinde geniş bir deneyime sahiptir.

Kültür ve Turizm Bakanlığı Sinema Genel Müdürlüğü'nden "Sessiz Sahil" ve "Dit-Hamal" projeleriyle senaryo ve yapım desteği almaya hak kazanmıştır. Halen Zenga Yapım bünyesinde TRT Tabii platformu için hazırlanan "Eve Dönemezsin" dizisinin senaryo ekibinde yer almaktadır.`,
    imdbUrl: null,
    photo: null,
  },
];

// Team Member Card
function TeamMemberCard({
  member,
  onClick,
}: {
  member: any;
  onClick: () => void;
}) {
  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-16 h-16 text-muted-foreground/50" />
          </div>
        )}

        {/* Hover Overlay with Bio */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {member.shortBio && (
            <p className="text-white text-sm line-clamp-4">
              {member.shortBio}
            </p>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-3 mt-4">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/70 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {member.imdbUrl && (
              <a
                href={member.imdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/70 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ImdbIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4">
        <h3 className="font-semibold">{member.name}</h3>
        <p className="text-sm text-muted-foreground">{member.position}</p>
        <span className="text-xs uppercase tracking-wider text-muted-foreground/70">
          {departmentLabels[member.department] || member.department}
        </span>
      </div>
    </div>
  );
}

// Team Member Detail Modal
function TeamMemberModal({
  member,
  isOpen,
  onClose,
}: {
  member: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">{member.name}</DialogTitle>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="aspect-[3/4] overflow-hidden bg-secondary">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-muted-foreground/50" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {departmentLabels[member.department] || member.department}
            </span>
            <h2 className="mt-1 text-2xl font-bold">{member.name}</h2>
            <p className="text-lg text-muted-foreground">{member.position}</p>

            {/* Bio */}
            {(member.fullBio || member.shortBio) && (
              <div className="mt-6 text-sm text-muted-foreground leading-relaxed space-y-3">
                {(member.fullBio || member.shortBio).split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              {member.imdbUrl && (
                <a
                  href={member.imdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ImdbIcon className="w-4 h-4" />
                  IMDB
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Team() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Use static Zenga team members
  const allMembers = zengaTeamMembers;

  const filteredMembers =
    selectedDepartment === "all"
      ? allMembers
      : allMembers.filter((m: any) => m.department === selectedDepartment);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Header */}
        <section className="py-12 md:py-20 bg-background border-b border-border">
          <div className="container">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Ekibimiz
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Zenga Yapım'ın arkasındaki yetenekli ekip. Her biri kendi alanında uzman,
              tutkulu ve yaratıcı profesyonellerden oluşan ailemiz.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container py-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {departments.map((dept) => (
                <Button
                  key={dept.value}
                  variant={selectedDepartment === dept.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept.value)}
                  className="whitespace-nowrap"
                >
                  {dept.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-12 md:py-20">
          <div className="container">
            {filteredMembers && filteredMembers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredMembers.map((member: any) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onClick={() => setSelectedMember(member)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <User className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">
                  Bu departmanda ekip üyesi bulunmuyor
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Lütfen başka bir departman seçin.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Member Detail Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      <Footer />
    </div>
  );
}
