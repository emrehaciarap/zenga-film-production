import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminAbout() {
  const [activeTab, setActiveTab] = useState("content");
  
  // Content state
  const [visionTitle, setVisionTitle] = useState("");
  const [visionContent, setVisionContent] = useState("");
  const [missionTitle, setMissionTitle] = useState("");
  const [missionContent, setMissionContent] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  
  // Values state
  const [valueDialogOpen, setValueDialogOpen] = useState(false);
  const [editingValueId, setEditingValueId] = useState<number | null>(null);
  const [valueForm, setValueForm] = useState({ title: "", description: "", icon: "star" });
  
  // Achievements state
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [editingAchievementId, setEditingAchievementId] = useState<number | null>(null);
  const [achievementForm, setAchievementForm] = useState({ year: new Date().getFullYear(), title: "", description: "", type: "milestone" as "milestone" | "award" });
  
  // Partners state
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [partnerForm, setPartnerForm] = useState({ name: "", logo: "" });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number } | null>(null);

  const utils = trpc.useUtils();
  
  const { data: content } = trpc.about.content.useQuery();
  const { data: values } = trpc.about.values.useQuery();
  const { data: achievements } = trpc.about.achievements.useQuery();
  const { data: partners } = trpc.about.partners.useQuery();

  // Initialize form values when data loads
  useState(() => {
    if (content) {
      const vision = content.find((c: any) => c.section === "vision");
      const mission = content.find((c: any) => c.section === "mission");
      const story = content.find((c: any) => c.section === "story");
      if (vision) { setVisionTitle(vision.title || ""); setVisionContent(vision.content || ""); }
      if (mission) { setMissionTitle(mission.title || ""); setMissionContent(mission.content || ""); }
      if (story) { setStoryTitle(story.title || ""); setStoryContent(story.content || ""); }
    }
  });

  const updateContentMutation = trpc.about.updateContent.useMutation({
    onSuccess: () => {
      utils.about.content.invalidate();
      toast.success("İçerik güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const createValueMutation = trpc.about.createValue.useMutation({
    onSuccess: () => {
      utils.about.values.invalidate();
      setValueDialogOpen(false);
      setValueForm({ title: "", description: "", icon: "star" });
      toast.success("Değer eklendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const updateValueMutation = trpc.about.updateValue.useMutation({
    onSuccess: () => {
      utils.about.values.invalidate();
      setValueDialogOpen(false);
      setEditingValueId(null);
      toast.success("Değer güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteValueMutation = trpc.about.deleteValue.useMutation({
    onSuccess: () => {
      utils.about.values.invalidate();
      toast.success("Değer silindi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const createAchievementMutation = trpc.about.createAchievement.useMutation({
    onSuccess: () => {
      utils.about.achievements.invalidate();
      setAchievementDialogOpen(false);
      setAchievementForm({ year: new Date().getFullYear(), title: "", description: "", type: "milestone" });
      toast.success("Başarı eklendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const updateAchievementMutation = trpc.about.updateAchievement.useMutation({
    onSuccess: () => {
      utils.about.achievements.invalidate();
      setAchievementDialogOpen(false);
      setEditingAchievementId(null);
      toast.success("Başarı güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteAchievementMutation = trpc.about.deleteAchievement.useMutation({
    onSuccess: () => {
      utils.about.achievements.invalidate();
      toast.success("Başarı silindi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const createPartnerMutation = trpc.about.createPartner.useMutation({
    onSuccess: () => {
      utils.about.partners.invalidate();
      setPartnerDialogOpen(false);
      setPartnerForm({ name: "", logo: "" });
      toast.success("Referans eklendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const updatePartnerMutation = trpc.about.updatePartner.useMutation({
    onSuccess: () => {
      utils.about.partners.invalidate();
      setPartnerDialogOpen(false);
      setEditingPartnerId(null);
      toast.success("Referans güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deletePartnerMutation = trpc.about.deletePartner.useMutation({
    onSuccess: () => {
      utils.about.partners.invalidate();
      toast.success("Referans silindi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const handleSaveContent = async () => {
    // Save each section separately
    await updateContentMutation.mutateAsync({ section: "vision", title: visionTitle, content: visionContent });
    await updateContentMutation.mutateAsync({ section: "mission", title: missionTitle, content: missionContent });
    await updateContentMutation.mutateAsync({ section: "story", title: storyTitle, content: storyContent });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "value") deleteValueMutation.mutate({ id: deleteTarget.id });
    if (deleteTarget.type === "achievement") deleteAchievementMutation.mutate({ id: deleteTarget.id });
    if (deleteTarget.type === "partner") deletePartnerMutation.mutate({ id: deleteTarget.id });
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hakkımızda</h1>
        <p className="text-muted-foreground mt-1">Hakkımızda sayfası içeriklerini yönetin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">İçerik</TabsTrigger>
          <TabsTrigger value="values">Değerler</TabsTrigger>
          <TabsTrigger value="achievements">Başarılar</TabsTrigger>
          <TabsTrigger value="partners">Referanslar</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Vizyon</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Başlık</Label>
                <Input value={visionTitle} onChange={(e) => setVisionTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>İçerik</Label>
                <Textarea value={visionContent} onChange={(e) => setVisionContent(e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Misyon</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Başlık</Label>
                <Input value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>İçerik</Label>
                <Textarea value={missionContent} onChange={(e) => setMissionContent(e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hikayemiz</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Başlık</Label>
                <Input value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>İçerik</Label>
                <Textarea value={storyContent} onChange={(e) => setStoryContent(e.target.value)} rows={5} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveContent} disabled={updateContentMutation.isPending}>
            {updateContentMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </TabsContent>

        {/* Values Tab */}
        <TabsContent value="values" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingValueId(null); setValueForm({ title: "", description: "", icon: "star" }); setValueDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Değer
            </Button>
          </div>
          <div className="grid gap-4">
            {values?.map((value: any) => (
              <Card key={value.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => { setEditingValueId(value.id); setValueForm({ title: value.title, description: value.description || "", icon: value.icon || "star" }); setValueDialogOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { setDeleteTarget({ type: "value", id: value.id }); setDeleteDialogOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingAchievementId(null); setAchievementForm({ year: new Date().getFullYear(), title: "", description: "", type: "milestone" }); setAchievementDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Başarı
            </Button>
          </div>
          <div className="grid gap-4">
            {achievements?.map((achievement: any) => (
              <Card key={achievement.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">{achievement.year}</span>
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => { setEditingAchievementId(achievement.id); setAchievementForm({ year: achievement.year, title: achievement.title, description: achievement.description || "", type: achievement.type }); setAchievementDialogOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { setDeleteTarget({ type: "achievement", id: achievement.id }); setDeleteDialogOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingPartnerId(null); setPartnerForm({ name: "", logo: "" }); setPartnerDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Referans
            </Button>
          </div>
          <div className="grid gap-4">
            {partners?.map((partner: any) => (
              <Card key={partner.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {partner.logo && <img src={partner.logo} alt={partner.name} className="h-8 object-contain" />}
                    <span className="font-semibold">{partner.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => { setEditingPartnerId(partner.id); setPartnerForm({ name: partner.name, logo: partner.logo || "" }); setPartnerDialogOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => { setDeleteTarget({ type: "partner", id: partner.id }); setDeleteDialogOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Value Dialog */}
      <Dialog open={valueDialogOpen} onOpenChange={setValueDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingValueId ? "Değer Düzenle" : "Yeni Değer"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input value={valueForm.title} onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea value={valueForm.description} onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>İkon (star, heart, lightbulb, users, target, zap)</Label>
              <Input value={valueForm.icon} onChange={(e) => setValueForm({ ...valueForm, icon: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setValueDialogOpen(false)}>İptal</Button>
            <Button onClick={() => editingValueId ? updateValueMutation.mutate({ id: editingValueId, ...valueForm }) : createValueMutation.mutate(valueForm)}>
              {editingValueId ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Achievement Dialog */}
      <Dialog open={achievementDialogOpen} onOpenChange={setAchievementDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingAchievementId ? "Başarı Düzenle" : "Yeni Başarı"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Yıl</Label>
                <Input type="number" value={achievementForm.year} onChange={(e) => setAchievementForm({ ...achievementForm, year: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Tür</Label>
                <select className="w-full h-10 px-3 border rounded-md" value={achievementForm.type} onChange={(e) => setAchievementForm({ ...achievementForm, type: e.target.value as "milestone" | "award" })}>
                  <option value="milestone">Dönüm Noktası</option>
                  <option value="award">Ödül</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input value={achievementForm.title} onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea value={achievementForm.description} onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAchievementDialogOpen(false)}>İptal</Button>
            <Button onClick={() => editingAchievementId ? updateAchievementMutation.mutate({ id: editingAchievementId, ...achievementForm }) : createAchievementMutation.mutate(achievementForm)}>
              {editingAchievementId ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Partner Dialog */}
      <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingPartnerId ? "Referans Düzenle" : "Yeni Referans"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>İsim</Label>
              <Input value={partnerForm.name} onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input value={partnerForm.logo} onChange={(e) => setPartnerForm({ ...partnerForm, logo: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPartnerDialogOpen(false)}>İptal</Button>
            <Button onClick={() => editingPartnerId ? updatePartnerMutation.mutate({ id: editingPartnerId, ...partnerForm }) : createPartnerMutation.mutate(partnerForm)}>
              {editingPartnerId ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
