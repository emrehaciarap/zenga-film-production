import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Film, Play, X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "Tümü" },
  { value: "film", label: "Film" },
  { value: "reklam", label: "Reklam" },
  { value: "belgesel", label: "Belgesel" },
  { value: "muzik_video", label: "Müzik Video" },
];

const categoryLabels: Record<string, string> = {
  film: "Film",
  reklam: "Reklam",
  belgesel: "Belgesel",
  muzik_video: "Müzik Video",
};

// Project Card Component
function ProjectCard({ project, onClick }: { project: any; onClick: () => void }) {
  return (
    <div
      className="group cursor-pointer card-hover"
      onClick={onClick}
    >
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
  );
}

// Project Detail Modal
function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const gallery = project?.gallery || [];
  const allImages = project?.thumbnail
    ? [project.thumbnail, ...gallery]
    : gallery;

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        
        {/* Hero Image/Video */}
        <div className="relative aspect-video bg-black">
          {project.videoUrl ? (
            <iframe
              src={project.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : allImages[activeImageIndex] ? (
            <img
              src={allImages[activeImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-24 h-24 text-white/30" />
            </div>
          )}

          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 text-white hover:bg-white/20 ml-2"
              onClick={onPrev}
              disabled={!hasPrev}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 text-white hover:bg-white/20 mr-2"
              onClick={onNext}
              disabled={!hasNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {categoryLabels[project.category] || project.category}
              </span>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold">
                {project.title}
              </h2>
            </div>
            {project.year && (
              <span className="text-lg font-semibold text-muted-foreground">
                {project.year}
              </span>
            )}
          </div>

          {project.fullDescription && (
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {project.fullDescription}
            </p>
          )}

          {/* Technical Details */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.director && (
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Yönetmen
                </span>
                <p className="mt-1 font-medium">{project.director}</p>
              </div>
            )}
            {project.camera && (
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Görüntü Yönetmeni
                </span>
                <p className="mt-1 font-medium">{project.camera}</p>
              </div>
            )}
            {project.duration && (
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Süre
                </span>
                <p className="mt-1 font-medium">{project.duration}</p>
              </div>
            )}
            {project.crew && (
              <div className="col-span-2 md:col-span-4">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Ekip
                </span>
                <p className="mt-1 font-medium">{project.crew}</p>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="mt-8">
              <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Galeri
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-14 overflow-hidden border-2 transition-colors",
                      activeImageIndex === index
                        ? "border-foreground"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const { data: allProjects, isLoading } = trpc.projects.list.useQuery({
    status: "active",
  });

  const filteredProjects =
    selectedCategory === "all"
      ? allProjects
      : allProjects?.filter((p: any) => p.category === selectedCategory);

  const selectedProject =
    selectedProjectIndex !== null && filteredProjects
      ? filteredProjects[selectedProjectIndex]
      : null;

  const handlePrevProject = () => {
    if (selectedProjectIndex !== null && selectedProjectIndex > 0) {
      setSelectedProjectIndex(selectedProjectIndex - 1);
    }
  };

  const handleNextProject = () => {
    if (
      selectedProjectIndex !== null &&
      filteredProjects &&
      selectedProjectIndex < filteredProjects.length - 1
    ) {
      setSelectedProjectIndex(selectedProjectIndex + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Header */}
        <section className="py-12 md:py-20 bg-background border-b border-border">
          <div className="container">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Projelerimiz
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Film, reklam, belgesel ve müzik videosu projelerimizi keşfedin.
              Her biri özenle hazırlanmış, hikaye anlatımının gücünü yansıtan
              çalışmalarımız.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container py-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12 md:py-20">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-secondary rounded" />
                    <div className="mt-4 h-4 bg-secondary rounded w-1/4" />
                    <div className="mt-2 h-6 bg-secondary rounded w-3/4" />
                    <div className="mt-2 h-4 bg-secondary rounded w-full" />
                  </div>
                ))}
              </div>
            ) : filteredProjects && filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project: any, index: number) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProjectIndex(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Film className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Henüz proje yok</h3>
                <p className="mt-2 text-muted-foreground">
                  Bu kategoride henüz proje bulunmuyor.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={selectedProjectIndex !== null}
        onClose={() => setSelectedProjectIndex(null)}
        onPrev={handlePrevProject}
        onNext={handleNextProject}
        hasPrev={selectedProjectIndex !== null && selectedProjectIndex > 0}
        hasNext={
          selectedProjectIndex !== null &&
          filteredProjects !== undefined &&
          selectedProjectIndex < filteredProjects.length - 1
        }
      />

      <Footer />
    </div>
  );
}

// Project Detail Page (for direct URL access)
export function ProjectDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();

  const { data: project, isLoading } = trpc.projects.bySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const gallery = project?.gallery || [];
  const allImages = project?.thumbnail
    ? [project.thumbnail, ...gallery]
    : gallery;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 md:pt-24">
          <div className="container py-12">
            <div className="animate-pulse">
              <div className="aspect-video bg-secondary rounded" />
              <div className="mt-8 h-8 bg-secondary rounded w-1/2" />
              <div className="mt-4 h-4 bg-secondary rounded w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 md:pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Proje Bulunamadı</h1>
            <p className="mt-2 text-muted-foreground">
              Aradığınız proje mevcut değil.
            </p>
            <Button asChild className="mt-4">
              <Link href="/projelerimiz">Projelere Dön</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Back Button */}
        <div className="container py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/projelerimiz")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Projeler
          </Button>
        </div>

        {/* Hero */}
        <section className="relative aspect-video md:aspect-cinema bg-black">
          {project.videoUrl ? (
            <iframe
              src={project.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : allImages[activeImageIndex] ? (
            <img
              src={allImages[activeImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-24 h-24 text-white/30" />
            </div>
          )}
        </section>

        {/* Content */}
        <section className="py-12 md:py-20">
          <div className="container max-w-4xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {categoryLabels[project.category] || project.category}
                </span>
                <h1 className="mt-1 text-3xl md:text-4xl lg:text-5xl font-bold">
                  {project.title}
                </h1>
              </div>
              {project.year && (
                <span className="text-xl font-semibold text-muted-foreground">
                  {project.year}
                </span>
              )}
            </div>

            {project.fullDescription && (
              <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
                {project.fullDescription}
              </p>
            )}

            {/* Technical Details */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-secondary rounded-lg">
              {project.director && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Yönetmen
                  </span>
                  <p className="mt-1 font-medium">{project.director}</p>
                </div>
              )}
              {project.camera && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Görüntü Yönetmeni
                  </span>
                  <p className="mt-1 font-medium">{project.camera}</p>
                </div>
              )}
              {project.duration && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Süre
                  </span>
                  <p className="mt-1 font-medium">{project.duration}</p>
                </div>
              )}
              {project.crew && (
                <div className="col-span-2 md:col-span-4">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Ekip
                  </span>
                  <p className="mt-1 font-medium">{project.crew}</p>
                </div>
              )}
            </div>

            {/* Gallery */}
            {allImages.length > 1 && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-6">Galeri</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allImages.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "aspect-video overflow-hidden border-2 transition-colors",
                        activeImageIndex === index
                          ? "border-foreground"
                          : "border-transparent hover:border-border"
                      )}
                    >
                      <img
                        src={img}
                        alt={`${project.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
