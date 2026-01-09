import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const categories = [
  { value: "film", label: "Film" },
  { value: "reklam", label: "Reklam" },
  { value: "belgesel", label: "Belgesel" },
  { value: "muzik_video", label: "Müzik Video" },
];

const statuses = [
  { value: "active", label: "Aktif" },
  { value: "coming_soon", label: "Pek Yakında" },
  { value: "draft", label: "Taslak" },
];

type ProjectForm = {
  title: string;
  slug: string;
  category: "film" | "reklam" | "belgesel" | "muzik_video";
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  videoUrl: string;
  director: string;
  camera: string;
  duration: string;
  year: number | undefined;
  crew: string;
  status: "active" | "coming_soon" | "draft";
  isFeatured: boolean;
  sortOrder: number;
};

const emptyForm: ProjectForm = {
  title: "",
  slug: "",
  category: "film",
  shortDescription: "",
  fullDescription: "",
  thumbnail: "",
  videoUrl: "",
  director: "",
  camera: "",
  duration: "",
  year: undefined,
  crew: "",
  status: "draft",
  isFeatured: false,
  sortOrder: 0,
};

export default function AdminProjects() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: projects, isLoading } = trpc.projects.list.useQuery({});

  const createMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      toast.success("Proje başarıyla oluşturuldu");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const updateMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      setIsDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success("Proje başarıyla güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      toast.success("Proje başarıyla silindi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      slug: project.slug,
      category: project.category,
      shortDescription: project.shortDescription || "",
      fullDescription: project.fullDescription || "",
      thumbnail: project.thumbnail || "",
      videoUrl: project.videoUrl || "",
      director: project.director || "",
      camera: project.camera || "",
      duration: project.duration || "",
      year: project.year || undefined,
      crew: project.crew || "",
      status: project.status,
      isFeatured: project.isFeatured || false,
      sortOrder: project.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.slug || !form.category) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form, year: form.year || undefined });
    } else {
      createMutation.mutate({ ...form, year: form.year || undefined });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projeler</h1>
          <p className="text-muted-foreground mt-1">
            Tüm projeleri yönetin
          </p>
        </div>
        <Button onClick={() => { setEditingId(null); setForm(emptyForm); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Proje
        </Button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project: any) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 bg-secondary flex-shrink-0 overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        Görsel Yok
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{project.title}</h3>
                      {project.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {categories.find((c) => c.value === project.category)?.label} •{" "}
                      {statuses.find((s) => s.value === project.status)?.label}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(project)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Henüz proje eklenmemiş.</p>
            <Button
              className="mt-4"
              onClick={() => { setEditingId(null); setForm(emptyForm); setIsDialogOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-2" />
              İlk Projeyi Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Proje Düzenle" : "Yeni Proje"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    if (!editingId) {
                      setForm((f) => ({ ...f, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  placeholder="Proje başlığı"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="proje-url"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={form.category}
                  onValueChange={(value: any) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select
                  value={form.status}
                  onValueChange={(value: any) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Kısa Açıklama</Label>
              <Textarea
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="Kısa açıklama (liste görünümü için)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Detaylı Açıklama</Label>
              <Textarea
                id="fullDescription"
                value={form.fullDescription}
                onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                placeholder="Detaylı açıklama"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="YouTube/Vimeo embed URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="director">Yönetmen</Label>
                <Input
                  id="director"
                  value={form.director}
                  onChange={(e) => setForm({ ...form, director: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="camera">Görüntü Yönetmeni</Label>
                <Input
                  id="camera"
                  value={form.camera}
                  onChange={(e) => setForm({ ...form, camera: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Süre</Label>
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="90 dk"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Yıl</Label>
                <Input
                  id="year"
                  type="number"
                  value={form.year || ""}
                  onChange={(e) => setForm({ ...form, year: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sıralama</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crew">Ekip</Label>
              <Textarea
                id="crew"
                value={form.crew}
                onChange={(e) => setForm({ ...form, crew: e.target.value })}
                placeholder="Ekip bilgileri"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isFeatured"
                checked={form.isFeatured}
                onCheckedChange={(checked) => setForm({ ...form, isFeatured: checked })}
              />
              <Label htmlFor="isFeatured">Öne Çıkan Proje</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingId ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Projeyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate({ id: deletingId })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
