import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const departments = [
  { value: "yonetim", label: "Yönetim" },
  { value: "kreatif", label: "Kreatif" },
  { value: "produksiyon", label: "Prodüksiyon" },
  { value: "teknik", label: "Teknik" },
];

type OrgForm = {
  title: string;
  name: string;
  department: "yonetim" | "kreatif" | "produksiyon" | "teknik";
  photo: string;
  bio: string;
  parentId: number | null;
  sortOrder: number;
};

const emptyForm: OrgForm = {
  title: "",
  name: "",
  department: "yonetim",
  photo: "",
  bio: "",
  parentId: null,
  sortOrder: 0,
};

export default function AdminOrgChart() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<OrgForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: positions, isLoading } = trpc.org.list.useQuery();

  const createMutation = trpc.org.create.useMutation({
    onSuccess: () => {
      utils.org.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      toast.success("Pozisyon başarıyla oluşturuldu");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const updateMutation = trpc.org.update.useMutation({
    onSuccess: () => {
      utils.org.list.invalidate();
      setIsDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success("Pozisyon başarıyla güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteMutation = trpc.org.delete.useMutation({
    onSuccess: () => {
      utils.org.list.invalidate();
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      toast.success("Pozisyon başarıyla silindi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const handleEdit = (position: any) => {
    setEditingId(position.id);
    setForm({
      title: position.title,
      name: position.name || "",
      department: position.department,
      photo: position.photo || "",
      bio: position.bio || "",
      parentId: position.parentId,
      sortOrder: position.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title) {
      toast.error("Lütfen pozisyon başlığı girin");
      return;
    }

    const data = {
      title: form.title,
      name: form.name || undefined,
      department: form.department,
      photo: form.photo || undefined,
      bio: form.bio || undefined,
      parentId: form.parentId || undefined,
      sortOrder: form.sortOrder,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Filter out current position from parent options
  const parentOptions = positions?.filter((p: any) => p.id !== editingId) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizasyon Şeması</h1>
          <p className="text-muted-foreground mt-1">Organizasyon yapısını yönetin</p>
        </div>
        <Button onClick={() => { setEditingId(null); setForm(emptyForm); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Pozisyon
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : positions && positions.length > 0 ? (
        <div className="grid gap-4">
          {positions.map((position: any) => (
            <Card key={position.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary flex-shrink-0 overflow-hidden rounded-full">
                    {position.photo ? (
                      <img src={position.photo} alt={position.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        {position.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{position.title}</h3>
                    <p className="text-sm text-muted-foreground">{position.name || "Atanmamış"}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-secondary">
                    {departments.find((d) => d.value === position.department)?.label}
                  </span>
                  {position.parentId && (
                    <span className="text-xs text-muted-foreground">
                      Bağlı: {positions.find((p: any) => p.id === position.parentId)?.title}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(position)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { setDeletingId(position.id); setIsDeleteDialogOpen(true); }}>
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
            <p className="text-muted-foreground">Henüz pozisyon eklenmemiş.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Pozisyon Düzenle" : "Yeni Pozisyon"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Pozisyon Başlığı *</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Genel Müdür" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Kişi Adı</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ahmet Yılmaz" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Departman</Label>
                <Select value={form.department} onValueChange={(value: any) => setForm({ ...form, department: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId">Bağlı Olduğu Pozisyon</Label>
                <Select value={form.parentId?.toString() || "none"} onValueChange={(value) => setForm({ ...form, parentId: value === "none" ? null : parseInt(value) })}>
                  <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Yok (Üst Düzey)</SelectItem>
                    {parentOptions.map((p: any) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Fotoğraf URL</Label>
              <Input id="photo" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
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
            <AlertDialogTitle>Pozisyonu Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu pozisyonu silmek istediğinizden emin misiniz?</AlertDialogDescription>
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
