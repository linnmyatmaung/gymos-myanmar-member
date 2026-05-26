import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
    >
      <div>
        {eyebrow && (
          <div className="inline-flex items-center gap-2 text-xs font-medium text-on-secondary-container bg-secondary-container/60 px-3 py-1 rounded-full mb-3">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">{title}</h1>
        {subtitle && <p className="text-on-surface-variant mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </motion.div>
  );
}
