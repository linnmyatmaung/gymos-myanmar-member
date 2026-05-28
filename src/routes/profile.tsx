import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { QRCard } from "@/components/qr/QRCard";
import { member } from "@/mockdata/member";
import { Crown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [{ title: "Profile · GymOS" }],
  }),
});

function ProfilePage() {
  const { t } = useI18n();

  return (
    <AppShell>
      <PageHeader
        eyebrow={t("profile.eyebrow")}
        title={t("profile.title")}
        subtitle={t("profile.subtitle")}
        actions={
          <div className="flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2.5 text-sm font-semibold text-on-secondary-container">
            <Crown className="size-4" />
            {member.membership}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileCard />
        </div>
        <QRCard />
      </div>
    </AppShell>
  );
}
