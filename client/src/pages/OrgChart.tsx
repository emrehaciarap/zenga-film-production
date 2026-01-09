import { useState, useMemo } from "react";
import { User, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

// Build tree structure from flat list
function buildOrgTree(positions: any[]) {
  const map = new Map<number, any>();
  const roots: any[] = [];

  // First pass: create map
  positions.forEach((pos) => {
    map.set(pos.id, { ...pos, children: [] });
  });

  // Second pass: build tree
  positions.forEach((pos) => {
    const node = map.get(pos.id);
    if (pos.parentId && map.has(pos.parentId)) {
      map.get(pos.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

// Department colors
const departmentColors: Record<string, string> = {
  yonetim: "bg-foreground text-background",
  kreatif: "bg-secondary text-foreground border border-border",
  produksiyon: "bg-muted text-foreground",
  teknik: "bg-accent text-accent-foreground",
};

// Org Node Component
function OrgNode({
  node,
  level = 0,
  onSelect,
}: {
  node: any;
  level?: number;
  onSelect: (node: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className={cn(
          "relative cursor-pointer transition-all hover:scale-105",
          "w-48 md:w-56 p-4 text-center",
          departmentColors[node.department] || "bg-secondary text-foreground border border-border"
        )}
        onClick={() => onSelect(node)}
      >
        {/* Photo */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-background/20">
          {node.photo ? (
            <img
              src={node.photo}
              alt={node.name || node.title}
              className="w-full h-full object-cover grayscale"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-8 h-8 opacity-50" />
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="font-semibold text-sm">{node.title}</h3>
        {node.name && (
          <p className="text-xs mt-1 opacity-70">{node.name}</p>
        )}
        {node.department && (
          <span className="text-xs uppercase tracking-wider opacity-50 mt-2 block">
            {node.department}
          </span>
        )}

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Connector Line */}
      {hasChildren && isExpanded && (
        <div className="w-px h-8 bg-border" />
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Horizontal Line */}
          {node.children.length > 1 && (
            <div
              className="absolute top-0 h-px bg-border"
              style={{
                left: "50%",
                width: `${(node.children.length - 1) * 100}%`,
                transform: "translateX(-50%)",
              }}
            />
          )}

          <div className="flex gap-4 md:gap-8">
            {node.children.map((child: any) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-8 bg-border" />
                <OrgNode node={child} level={level + 1} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Bio Modal
function BioModal({
  position,
  isOpen,
  onClose,
}: {
  position: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!position) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">{position.name || position.title}</DialogTitle>
        
        <div className="text-center">
          {/* Photo */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-secondary">
            {position.photo ? (
              <img
                src={position.photo}
                alt={position.name || position.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <h2 className="text-xl font-bold">{position.title}</h2>
          {position.name && (
            <p className="text-lg text-muted-foreground mt-1">{position.name}</p>
          )}
          {position.department && (
            <span className="inline-block mt-2 px-3 py-1 text-xs uppercase tracking-wider bg-secondary rounded-full">
              {position.department}
            </span>
          )}

          {/* Bio */}
          {position.bio && (
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed text-left">
              {position.bio}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simple List View for Mobile
function OrgList({
  positions,
  onSelect,
}: {
  positions: any[];
  onSelect: (node: any) => void;
}) {
  // Group by department
  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    positions.forEach((pos) => {
      const dept = pos.department || "diger";
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(pos);
    });
    return groups;
  }, [positions]);

  const departmentLabels: Record<string, string> = {
    yonetim: "Yönetim",
    kreatif: "Kreatif",
    produksiyon: "Prodüksiyon",
    teknik: "Teknik",
    diger: "Diğer",
  };

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([dept, items]) => (
        <div key={dept}>
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            {departmentLabels[dept] || dept}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {items.map((pos) => (
              <div
                key={pos.id}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:scale-105",
                  departmentColors[pos.department] || "bg-secondary text-foreground border border-border"
                )}
                onClick={() => onSelect(pos)}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden bg-background/20">
                  {pos.photo ? (
                    <img
                      src={pos.photo}
                      alt={pos.name || pos.title}
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 opacity-50" />
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-xs text-center">{pos.title}</h4>
                {pos.name && (
                  <p className="text-xs text-center opacity-70 mt-1">{pos.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrgChart() {
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const { data: positions, isLoading } = trpc.org.list.useQuery();

  const orgTree = useMemo(() => {
    if (!positions) return [];
    return buildOrgTree(positions);
  }, [positions]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Header */}
        <section className="py-12 md:py-20 bg-background border-b border-border">
          <div className="container">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Organizasyon Şeması
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Zenga'nın organizasyon yapısı ve ekip hiyerarşisi. Her pozisyona
              tıklayarak detaylı bilgi alabilirsiniz.
            </p>
          </div>
        </section>

        {/* Org Chart */}
        <section className="py-12 md:py-20 overflow-x-auto">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-pulse">
                  <div className="w-56 h-32 bg-secondary rounded mx-auto" />
                  <div className="w-px h-8 bg-secondary mx-auto" />
                  <div className="flex gap-8 justify-center">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="w-48 h-28 bg-secondary rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : positions && positions.length > 0 ? (
              <>
                {/* Desktop Tree View */}
                <div className="hidden md:flex justify-center min-w-max pb-8">
                  <div className="flex flex-col items-center gap-0">
                    {orgTree.map((root) => (
                      <OrgNode
                        key={root.id}
                        node={root}
                        onSelect={setSelectedPosition}
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile List View */}
                <div className="md:hidden">
                  <OrgList positions={positions} onSelect={setSelectedPosition} />
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <User className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">
                  Organizasyon şeması henüz oluşturulmadı
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yakında ekip yapımızı burada paylaşacağız.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Legend */}
        {positions && positions.length > 0 && (
          <section className="py-8 border-t border-border">
            <div className="container">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <span className="text-muted-foreground">Departmanlar:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-foreground" />
                  <span>Yönetim</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary border border-border" />
                  <span>Kreatif</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted" />
                  <span>Prodüksiyon</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-accent" />
                  <span>Teknik</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Bio Modal */}
      <BioModal
        position={selectedPosition}
        isOpen={!!selectedPosition}
        onClose={() => setSelectedPosition(null)}
      />

      <Footer />
    </div>
  );
}
