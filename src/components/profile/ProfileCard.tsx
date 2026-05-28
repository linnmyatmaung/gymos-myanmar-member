import { member } from "@/mockdata/member";
import { getCurrentUser, logout } from "@/lib/auth";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Mail, Phone, IdCard, Crown, CalendarCheck, User, Target, LogOut, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { languages, useI18n, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ProfileCard() {
  const navigate = useNavigate();
  const router = useRouter();
  const user = getCurrentUser();
  const profileName = user?.displayName ?? member.name;
  const { language, setLanguage, t } = useI18n();

  const handleLogout = async () => {
    logout();
    await router.invalidate();
    await navigate({ to: "/login", search: { redirect: "/" }, replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="m3-card-elevated p-6 relative overflow-hidden"
    >
      <div className="absolute -right-20 -top-20 size-56 rounded-full bg-secondary-container/40 blur-3xl" />
      <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-primary-container/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative">
          <img
            src={member.avatar}
            alt={profileName}
            className="size-24 rounded-3xl bg-surface-container ring-4 ring-white shadow-soft"
          />
          <div className="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {t("common.active")}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-on-surface-variant">{t("profile.welcomeBack")}</div>
          <h2 className="font-display text-2xl font-bold text-on-surface truncate">{profileName}</h2>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <Crown className="size-3.5 text-secondary" />
            <span className="font-medium text-on-surface">{member.membership}</span>
            <span className="text-outline">•</span>
            <span className="text-on-surface-variant">{t("common.expires")} {member.expiry}</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="h-10 w-full rounded-xl bg-surface-lowest sm:w-auto"
        >
          <LogOut className="size-4" />
          {t("common.logout")}
        </Button>
      </div>

      <div className="relative mt-6 rounded-2xl bg-surface-container-low p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-on-surface-variant">
              <Languages className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-on-surface">{t("profile.languageSettings")}</div>
              <div className="text-xs text-on-surface-variant">{t("common.languageSubtitle")}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white p-1">
            {languages.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => setLanguage(option.code as Language)}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-bold transition",
                  language === option.code
                    ? "bg-secondary-container text-on-secondary-container shadow-soft"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                )}
                aria-pressed={language === option.code}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <Field icon={IdCard} label={t("common.memberId")} value={member.memberId} />
        <Field icon={Mail} label={t("common.email")} value={member.email} />
        <Field icon={Phone} label={t("common.phone")} value={member.phone} />
        <Field icon={CalendarCheck} label={t("common.expires")} value={member.expiry} />
        <Field icon={User} label={t("common.trainer")} value={member.trainer} />
        <Field icon={Target} label={t("common.goal")} value={member.goal} />
      </div>
    </motion.div>
  );
}

function Field({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low">
      <div className="size-9 rounded-xl bg-white grid place-items-center text-on-surface-variant shrink-0">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</div>
        <div className="text-sm font-medium text-on-surface truncate">{value}</div>
      </div>
    </div>
  );
}
