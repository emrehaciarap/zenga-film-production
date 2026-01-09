import { useState, useEffect } from "react";
import { Film, Clock, Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

// Countdown Timer Component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-4">
      {[
        { value: timeLeft.days, label: "Gün" },
        { value: timeLeft.hours, label: "Saat" },
        { value: timeLeft.minutes, label: "Dakika" },
        { value: timeLeft.seconds, label: "Saniye" },
      ].map((item, index) => (
        <div key={item.label} className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-foreground text-background flex items-center justify-center text-2xl md:text-3xl font-bold">
            {String(item.value).padStart(2, "0")}
          </div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2 block">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Coming Soon Card Component
function ComingSoonCard({ project }: { project: any }) {
  const hasReleaseDate = project.releaseDate && new Date(project.releaseDate) > new Date();

  return (
    <div className="group">
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {project.teaserImage ? (
          <img
            src={project.teaserImage}
            alt={project.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Film className="w-16 h-16 text-muted-foreground/50" />
          </div>
        )}

        {/* Mystery Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Coming Soon Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-black text-xs font-medium uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            Pek Yakında
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {project.title}
          </h3>
          {project.description && (
            <p className="mt-2 text-sm text-white/70 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Countdown */}
      {hasReleaseDate && (
        <div className="mt-6">
          <CountdownTimer targetDate={new Date(project.releaseDate)} />
        </div>
      )}
    </div>
  );
}

// Email Signup Form
function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subscribeMutation = trpc.comingSoon.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setEmail("");
      toast.success("Başarıyla abone oldunuz!");
    },
    onError: (error) => {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate({ email });
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center gap-2 text-foreground">
        <Check className="w-5 h-5" />
        <span>Teşekkürler! Haberdar edileceksiniz.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="E-posta adresiniz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={subscribeMutation.isPending}>
        {subscribeMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Bell className="w-4 h-4 mr-2" />
            Haberdar Ol
          </>
        )}
      </Button>
    </form>
  );
}

export default function ComingSoon() {
  const { data: projects, isLoading } = trpc.comingSoon.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Header */}
        <section className="py-12 md:py-20 bg-background border-b border-border">
          <div className="container">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Pek Yakında
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Üzerinde çalıştığımız ve yakında sizlerle buluşacak projelerimiz.
              Gelişmelerden haberdar olmak için e-posta listemize katılın.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12 md:py-20">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-secondary rounded" />
                    <div className="mt-6 flex justify-center gap-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="w-20 h-20 bg-secondary rounded" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {projects.map((project: any) => (
                  <ComingSoonCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Clock className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">
                  Şu an için yeni proje duyurusu yok
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yakında yeni projelerimizi burada paylaşacağız.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Email Signup Section */}
        <section className="py-20 md:py-32 bg-foreground text-background">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <Bell className="w-12 h-12 mx-auto mb-6 opacity-50" />
              <h2 className="text-2xl md:text-3xl font-bold">
                Gelişmelerden Haberdar Olun
              </h2>
              <p className="mt-4 text-background/70">
                Yeni projelerimiz ve özel içeriklerimizden ilk siz haberdar olun.
                E-posta listemize katılın.
              </p>
              <div className="mt-8">
                <EmailSignupForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
