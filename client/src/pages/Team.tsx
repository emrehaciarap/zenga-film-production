import { useState } from "react";
import { User, Linkedin, Film as ImdbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
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
      <DialogContent className="max-w-2xl">
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
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                {member.fullBio || member.shortBio}
              </p>
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

  const { data: allMembers, isLoading } = trpc.team.list.useQuery();

  const filteredMembers =
    selectedDepartment === "all"
      ? allMembers
      : allMembers?.filter((m: any) => m.department === selectedDepartment);

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
              Zenga'nın arkasındaki yetenekli ekip. Her biri kendi alanında uzman,
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
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-secondary rounded" />
                    <div className="mt-4 h-5 bg-secondary rounded w-3/4" />
                    <div className="mt-2 h-4 bg-secondary rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredMembers && filteredMembers.length > 0 ? (
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
                  Henüz ekip üyesi eklenmemiş
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Bu departmanda henüz ekip üyesi bulunmuyor.
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
