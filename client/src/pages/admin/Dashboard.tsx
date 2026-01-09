import { Film, Clock, Users, Mail, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { data: projects } = trpc.projects.list.useQuery({});
  const { data: comingSoon } = trpc.comingSoon.listAll.useQuery();
  const { data: team } = trpc.team.listAll.useQuery();
  const { data: messages } = trpc.contact.messages.useQuery({});

  const stats = [
    {
      title: "Toplam Proje",
      value: projects?.length || 0,
      icon: Film,
      description: "Aktif ve taslak projeler",
    },
    {
      title: "Pek Yakında",
      value: comingSoon?.length || 0,
      icon: Clock,
      description: "Yakında gelecek projeler",
    },
    {
      title: "Ekip Üyesi",
      value: team?.length || 0,
      icon: Users,
      description: "Toplam ekip üyesi",
    },
    {
      title: "Mesajlar",
      value: messages?.filter((m: any) => m.status === "unread").length || 0,
      icon: Mail,
      description: "Okunmamış mesajlar",
    },
  ];

  const recentProjects = projects?.slice(0, 5) || [];
  const recentMessages = messages?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Zenga Admin Paneline hoş geldiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Son Projeler</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project: any) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.category}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {project.status === "active"
                        ? "Aktif"
                        : project.status === "draft"
                        ? "Taslak"
                        : "Yakında"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Henüz proje eklenmemiş.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Son Mesajlar</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message: any) => (
                  <div
                    key={message.id}
                    className="flex items-start justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{message.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {message.message}
                      </p>
                    </div>
                    <span
                      className={`ml-2 text-xs px-2 py-1 rounded flex-shrink-0 ${
                        message.status === "unread"
                          ? "bg-red-100 text-red-800"
                          : message.status === "read"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {message.status === "unread"
                        ? "Yeni"
                        : message.status === "read"
                        ? "Okundu"
                        : "Cevaplandı"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Henüz mesaj yok.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
