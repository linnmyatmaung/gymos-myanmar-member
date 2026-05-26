import { member } from "@/mockdata/member";
import { Mail, Phone, IdCard, Crown, CalendarCheck, User, Target } from "lucide-react";
import { motion } from "framer-motion";

export function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="m3-card-elevated p-6 relative overflow-hidden"
    >
      <div className="absolute -right-20 -top-20 size-56 rounded-full bg-secondary-container/40 blur-3xl" />
      <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-primary-container/10 blur-3xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="relative">
          <img
            src={member.avatar}
            alt={member.name}
            className="size-24 rounded-3xl bg-surface-container ring-4 ring-white shadow-soft"
          />
          <div className="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full">
            ACTIVE
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-on-surface-variant">Welcome back</div>
          <h2 className="font-display text-2xl font-bold text-on-surface truncate">{member.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <Crown className="size-3.5 text-secondary" />
            <span className="font-medium text-on-surface">{member.membership}</span>
            <span className="text-outline">•</span>
            <span className="text-on-surface-variant">Expires {member.expiry}</span>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <Field icon={IdCard} label="Member ID" value={member.memberId} />
        <Field icon={Mail} label="Email" value={member.email} />
        <Field icon={Phone} label="Phone" value={member.phone} />
        <Field icon={CalendarCheck} label="Expires" value={member.expiry} />
        <Field icon={User} label="Trainer" value={member.trainer} />
        <Field icon={Target} label="Goal" value={member.goal} />
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
