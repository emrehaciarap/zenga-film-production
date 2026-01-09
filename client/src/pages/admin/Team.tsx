import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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

const departments = [
  { value: "yonetim", label: "Yönetim" },
  { value: "kreatif", label: "Kreatif" },
  { value: "produksiyon", label: "Prodüksiyon" },
  { value: "teknik", label: "Teknik" },
];

type TeamForm = {
  name: string;
  position: string;
  department: "yonetim" | "kreatif" | "produksiyon" | "teknik";
  photo: string;
  shortBio: string;
  fullBio: string;
  linkedinUrl: string;
  imdbUrl: string;
  isActive: boolean;
  sortOrder: number;
};

const emptyForm: TeamForm = {
  name: "",
  position: "",
  department: "yonetim",
  photo: "",
  shortBio: "",
  fullBio: "",
  linkedinUrl: "",
  imdbUrl: "",
  isActive: true,
  sortOrder: 0,
};

export default function AdminTeam() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<TeamForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: members, isLoading } = trpc.team.listAll.useQuery();

  const createMutation = trpc.team.create.useMutation({
    onSuccess: () => {
      utils.team.listAll.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      toast.success("Ekip üyesi başarıyla oluşturuldu");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const updateMutation = trpc.team.update.useMutation({
    onSuccess: () => {
      utils.team.listAll.invalidate();
      setIsDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success("Ekip üyesi başarıyla güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteMutation = trpc.team.delete.useMutation({
    onSuccess: () => {
      utils.team.listAll.invalidate();
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      toast.success("Ekip üyesi başarıyla silindi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      position: member.position,
      department: member.department,
      photo: member.photo || "",
      shortBio: member.shortBio || "",
      fullBio: member.fullBio || "",
      linkedinUrl: member.linkedinUrl || "",
      imdbUrl: member.imdbUrl || "",
      isActive: member.isActive,
      sortOrder: member.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.position) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }

    const data = {
      name: form.name,
      position: form.position,
      department: form.department,
      photo: form.photo || undefined,
      shortBio: form.shortBio || undefined,
      fullBio: form.fullBio || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      imdbUrl: form.imdbUrl || undefined,
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
          <h1 className="text-3xl font-bold tracking-tight">Ekip</h1>
          <p className="text-muted-foreground mt-1">Ekip üyelerini yönetin</p>
        </div>
        <Button onClick={() => { setEditingId(null); setForm(emptyForm); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Üye
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : members && members.length > 0 ? (
        <div className="grid gap-4">
          {members.map((member: any) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary flex-shrink-0 overflow-hidden rounded-full">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-secondary">
                    {departments.find((d) => d.value === member.department)?.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(member)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { setDeletingId(member.id); setIsDeleteDialogOpen(true); }}>
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
            <p className="text-muted-foreground">Henüz ekip üyesi eklenmemiş.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Üye Düzenle" : "Yeni Üye"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">İsim *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Pozisyon *</Label>
                <Input id="position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>
            </div>
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
              <Label htmlFor="photo">Fotoğraf URL</Label>
              <Input id="photo" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortBio">Kısa Bio</Label>
              <Textarea id="shortBio" value={form.shortBio} onChange={(e) => setForm({ ...form, shortBio: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input id="linkedinUrl" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imdbUrl">IMDB URL</Label>
                <Input id="imdbUrl" value={form.imdbUrl} onChange={(e) => setForm({ ...form, imdbUrl: e.target.value })} />
              </div>
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
            <AlertDialogTitle>Üyeyi Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu üyeyi silmek istediğinizden emin misiniz?</AlertDialogDescription>
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
