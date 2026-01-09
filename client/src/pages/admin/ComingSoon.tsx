import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type ComingSoonForm = {
  title: string;
  description: string;
  teaserImage: string;
  teaserVideo: string;
  releaseDate: string;
  isActive: boolean;
  sortOrder: number;
};

const emptyForm: ComingSoonForm = {
  title: "",
  description: "",
  teaserImage: "",
  teaserVideo: "",
  releaseDate: "",
  isActive: true,
  sortOrder: 0,
};

export default function AdminComingSoon() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<ComingSoonForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: projects, isLoading } = trpc.comingSoon.listAll.useQuery();

  const createMutation = trpc.comingSoon.create.useMutation({
    onSuccess: () => {
      utils.comingSoon.listAll.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      toast.success("Proje başarıyla oluşturuldu");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const updateMutation = trpc.comingSoon.update.useMutation({
    onSuccess: () => {
      utils.comingSoon.listAll.invalidate();
      setIsDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success("Proje başarıyla güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteMutation = trpc.comingSoon.delete.useMutation({
    onSuccess: () => {
      utils.comingSoon.listAll.invalidate();
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
      description: project.description || "",
      teaserImage: project.teaserImage || "",
      teaserVideo: project.teaserVideo || "",
      releaseDate: project.releaseDate ? new Date(project.releaseDate).toISOString().split("T")[0] : "",
      isActive: project.isActive,
      sortOrder: project.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title) {
      toast.error("Lütfen başlık girin");
      return;
    }

    const data = {
      title: form.title,
      description: form.description || undefined,
      teaserImage: form.teaserImage || undefined,
      teaserVideo: form.teaserVideo || undefined,
      releaseDate: form.releaseDate ? new Date(form.releaseDate) : undefined,
      isActive: form.isActive,
      sortOrder: form.sortOrder,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pek Yakında</h1>
          <p className="text-muted-foreground mt-1">Yakında gelecek projeleri yönetin</p>
        </div>
        <Button onClick={() => { setEditingId(null); setForm(emptyForm); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Proje
        </Button>
      </div>

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
                  <div className="w-24 h-16 bg-secondary flex-shrink-0 overflow-hidden">
                    {project.teaserImage ? (
                      <img src={project.teaserImage} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Görsel Yok</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.releaseDate ? new Date(project.releaseDate).toLocaleDateString("tr-TR") : "Tarih belirtilmemiş"}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${project.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {project.isActive ? "Aktif" : "Pasif"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(project)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { setDeletingId(project.id); setIsDeleteDialogOpen(true); }}>
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
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Proje Düzenle" : "Yeni Proje"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teaserImage">Teaser Görsel URL</Label>
              <Input id="teaserImage" value={form.teaserImage} onChange={(e) => setForm({ ...form, teaserImage: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Yayın Tarihi</Label>
              <Input id="releaseDate" type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isActive" checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
              <Label htmlFor="isActive">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Projeyi Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu projeyi silmek istediğinizden emin misiniz?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate({ id: deletingId })} className="bg-destructive text-destructive-foreground">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
