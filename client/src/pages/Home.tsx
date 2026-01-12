import { Link } from "wouter";
import { ArrowRight, Play, Film, Award, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef } from "react";

// Counter animation hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// Project Card Component
function ProjectCard({ project }: { project: any }) {
  const categoryLabels: Record<string, string> = {
    film: "Film",
    reklam: "Reklam",
    belgesel: "Belgesel",
    muzik_video: "Müzik Video",
  };

  return (
    <Link href={`/projelerimiz/${project.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-video overflow-hidden bg-secondary">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {categoryLabels[project.category] || project.category}
          </span>
          <h3 className="mt-1 text-lg font-semibold group-hover:text-muted-foreground transition-colors">
            {project.title}
          </h3>
          {project.shortDescription && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {project.shortDescription}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { data: featuredProjects } = trpc.projects.featured.useQuery();
  const { data: allProjects } = trpc.projects.list.useQuery({ status: "active" });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider metinleri
  const heroSlides = [
    "Sinemanın estetiğini edebiyatın derinliğiyle buluşturuyor, anlatılmaya değer hikayelerin peşinden gidiyoruz.",
    "Kültürel mirastan dijital platformlara, yarının klasiklerini inşa etmek için üretiyoruz.",
    "Ödüllü yönetmen ve yazarların ortak vizyonuyla, Türkiye'nin görsel hafızasına nitelikli imzalar atıyoruz."
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Stats with counter animation
  const projectCount = useCountUp(allProjects?.length || 50, 2000);
  const yearsCount = useCountUp(10, 2000);
  const awardsCount = useCountUp(25, 2000);
  const clientsCount = useCountUp(100, 2000);

  const stats = [
    { label: "Proje", value: projectCount.count, suffix: "+", icon: Film, ref: projectCount.ref },
    { label: "Yıl Tecrübe", value: yearsCount.count, suffix: "+", icon: Calendar, ref: yearsCount.ref },
    { label: "Ödül", value: awardsCount.count, suffix: "+", icon: Award, ref: awardsCount.ref },
    { label: "Müşteri", value: clientsCount.count, suffix: "+", icon: Users, ref: clientsCount.ref },
  ];

  // Display projects - use featured if available, otherwise first 3 active
  const displayProjects = featuredProjects?.length
    ? featuredProjects
    : allProjects?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Slider */}
      <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative z-10 text-center py-20">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
              ZENGA
            </h1>
            
            {/* Slider Text */}
            <div className="mt-6 min-h-[120px] flex items-center justify-center">
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 transition-opacity duration-500">
                {heroSlides[currentSlide]}
              </p>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-foreground w-8' 
                      : 'bg-foreground/30 hover:bg-foreground/50'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/projelerimiz">
                  Projelerimizi Keşfedin
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                <Link href="/iletisim">İletişime Geçin</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-sm uppercase tracking-wider text-muted-foreground">
                Öne Çıkan
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                Projelerimiz
              </h2>
            </div>
            <Link
              href="/projelerimiz"
              className="inline-flex items-center text-sm font-medium hover-underline"
            >
              Tüm Projeler
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {displayProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project: any, index: number) => (
                <div
                  key={project.id}
                  className={`animate-fade-in-up stagger-${index + 1}`}
                  style={{ opacity: 0 }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-secondary rounded" />
                  <div className="mt-4 h-4 bg-secondary rounded w-1/4" />
                  <div className="mt-2 h-6 bg-secondary rounded w-3/4" />
                  <div className="mt-2 h-4 bg-secondary rounded w-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-foreground text-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                ref={stat.ref}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 opacity-50" />
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="mt-2 text-sm md:text-base text-background/70 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Hayalinizdeki Projeyi Birlikte Yaratın
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Film, reklam, belgesel veya müzik videosu fark etmez. Her projeniz için
              yaratıcı çözümler sunuyoruz. Hikayenizi anlatmak için bizimle iletişime
              geçin.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/iletisim">
                  Proje Başlatın
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                <Link href="/hakkimizda">Bizi Tanıyın</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
