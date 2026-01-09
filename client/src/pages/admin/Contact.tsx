import { useState } from "react";
import { Mail, Eye, Trash2, Loader2, Save, Check, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminContact() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Contact info form
  const [contactForm, setContactForm] = useState({
    address: "",
    phone: "",
    email: "",
    mapLat: "",
    mapLng: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  });

  const utils = trpc.useUtils();
  const { data: messages, isLoading: messagesLoading } = trpc.contact.messages.useQuery({});
  const { data: contactInfo } = trpc.contact.info.useQuery();

  // Initialize form when data loads
  useState(() => {
    if (contactInfo) {
      setContactForm({
        address: contactInfo.address || "",
        phone: contactInfo.phone || "",
        email: contactInfo.email || "",
        mapLat: contactInfo.mapLat || "",
        mapLng: contactInfo.mapLng || "",
        facebook: contactInfo.facebook || "",
        instagram: contactInfo.instagram || "",
        twitter: contactInfo.twitter || "",
        youtube: contactInfo.youtube || "",
        linkedin: contactInfo.linkedin || "",
      });
    }
  });

  const updateInfoMutation = trpc.contact.updateInfo.useMutation({
    onSuccess: () => {
      utils.contact.info.invalidate();
      toast.success("İletişim bilgileri güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const updateStatusMutation = trpc.contact.updateMessageStatus.useMutation({
    onSuccess: () => {
      utils.contact.messages.invalidate();
      toast.success("Durum güncellendi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const deleteMessageMutation = trpc.contact.deleteMessage.useMutation({
    onSuccess: () => {
      utils.contact.messages.invalidate();
      setDeleteDialogOpen(false);
      setDeletingId(null);
      toast.success("Mesaj silindi");
    },
    onError: () => toast.error("Bir hata oluştu"),
  });

  const handleSaveInfo = () => {
    updateInfoMutation.mutate(contactForm);
  };

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      updateStatusMutation.mutate({ id: message.id, status: "read" });
    }
  };

  const handleMarkAsReplied = (id: number) => {
    updateStatusMutation.mutate({ id, status: "replied" });
    setSelectedMessage(null);
  };

  const statusColors: Record<string, string> = {
    unread: "bg-red-100 text-red-800",
    read: "bg-yellow-100 text-yellow-800",
    replied: "bg-green-100 text-green-800",
  };

  const statusLabels: Record<string, string> = {
    unread: "Yeni",
    read: "Okundu",
    replied: "Cevaplandı",
  };

  const projectTypeLabels: Record<string, string> = {
    film: "Film",
    reklam: "Reklam",
    belgesel: "Belgesel",
    muzik_video: "Müzik Video",
    diger: "Diğer",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">İletişim</h1>
        <p className="text-muted-foreground mt-1">İletişim bilgileri ve mesajları yönetin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="messages">
            Mesajlar
            {messages && messages.filter((m: any) => m.status === "unread").length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {messages.filter((m: any) => m.status === "unread").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="info">İletişim Bilgileri</TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          {messagesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="grid gap-4">
              {messages.map((message: any) => (
                <Card key={message.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{message.name}</h3>
                          <Badge className={statusColors[message.status]}>
                            {statusLabels[message.status]}
                          </Badge>
                          {message.projectType && (
                            <Badge variant="outline">
                              {projectTypeLabels[message.projectType] || message.projectType}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {message.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(message.createdAt).toLocaleString("tr-TR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleViewMessage(message)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => { setDeletingId(message.id); setDeleteDialogOpen(true); }}>
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
                <Mail className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">Henüz mesaj yok.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Temel Bilgiler</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Adres</Label>
                <Input value={contactForm.address} onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>E-posta</Label>
                  <Input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Harita Enlem (Lat)</Label>
                  <Input value={contactForm.mapLat} onChange={(e) => setContactForm({ ...contactForm, mapLat: e.target.value })} placeholder="41.0821" />
                </div>
                <div className="space-y-2">
                  <Label>Harita Boylam (Lng)</Label>
                  <Input value={contactForm.mapLng} onChange={(e) => setContactForm({ ...contactForm, mapLng: e.target.value })} placeholder="29.0109" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Sosyal Medya</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input value={contactForm.facebook} onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })} placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input value={contactForm.instagram} onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })} placeholder="https://instagram.com/..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Twitter</Label>
                  <Input value={contactForm.twitter} onChange={(e) => setContactForm({ ...contactForm, twitter: e.target.value })} placeholder="https://twitter.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>YouTube</Label>
                  <Input value={contactForm.youtube} onChange={(e) => setContactForm({ ...contactForm, youtube: e.target.value })} placeholder="https://youtube.com/..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input value={contactForm.linkedin} onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })} placeholder="https://linkedin.com/..." />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveInfo} disabled={updateInfoMutation.isPending}>
            {updateInfoMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </TabsContent>
      </Tabs>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Mesaj Detayı</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Gönderen</Label>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">E-posta</Label>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
              </div>
              {selectedMessage.phone && (
                <div>
                  <Label className="text-muted-foreground">Telefon</Label>
                  <p className="font-medium">{selectedMessage.phone}</p>
                </div>
              )}
              {selectedMessage.projectType && (
                <div>
                  <Label className="text-muted-foreground">Proje Türü</Label>
                  <p className="font-medium">{projectTypeLabels[selectedMessage.projectType] || selectedMessage.projectType}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Mesaj</Label>
                <p className="mt-1 p-3 bg-secondary rounded-md">{selectedMessage.message}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tarih</Label>
                <p className="font-medium">{new Date(selectedMessage.createdAt).toLocaleString("tr-TR")}</p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => window.location.href = `mailto:${selectedMessage.email}`}>
                  <Reply className="w-4 h-4 mr-2" />
                  E-posta Gönder
                </Button>
                {selectedMessage.status !== "replied" && (
                  <Button onClick={() => handleMarkAsReplied(selectedMessage.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Cevaplandı İşaretle
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mesajı Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu mesajı silmek istediğinizden emin misiniz?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMessageMutation.mutate({ id: deletingId })} className="bg-destructive text-destructive-foreground">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
