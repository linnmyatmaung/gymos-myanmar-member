import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Flame,
  ImageUp,
  Loader2,
  RotateCcw,
  Save,
  UploadCloud,
  UtensilsCrossed,
} from "lucide-react";
import { type ChangeEvent, type DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const BACKEND_URL = "https://j22lb47qctisbi7d7d4urx4k3a0ptmty.lambda-url.ap-southeast-1.on.aws/api/scan";
const HEALTH_URL = "https://j22lb47qctisbi7d7d4urx4k3a0ptmty.lambda-url.ap-southeast-1.on.aws/api/health";
const DAILY_TARGET = 1850;
const colors = ["#006a61", "#131b2e", "#76777d", "#8b5e00", "#7a4bb0"];

type ApiStatus = "checking" | "ready" | "demo" | "offline";

type Ingredient = {
  name?: string;
  calories?: number | string;
  weight_grams?: number | string;
};

type ScanResult = {
  meal_title?: string;
  total_calories?: number | string;
  ingredients?: Ingredient[];
};

export const Route = createFileRoute("/calorie-counter")({
  component: CalorieCounterPage,
  head: () => ({ meta: [{ title: "Calorie Counter · GymOS" }] }),
});

function CalorieCounterPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const ingredients = useMemo(() => (Array.isArray(result?.ingredients) ? result.ingredients : []), [result]);
  const totalCalories = useMemo(() => {
    const total = Number(result?.total_calories);
    if (Number.isFinite(total) && total > 0) return Math.round(total);

    return ingredients.reduce((sum, item) => sum + safeNumber(item.calories), 0);
  }, [ingredients, result?.total_calories]);
  const dailyPercentage = Math.round((totalCalories / DAILY_TARGET) * 100);

  async function checkHealth() {
    setApiStatus("checking");
    try {
      const response = await fetch(HEALTH_URL);
      const data = await response.json();
      setApiStatus(data.openrouter_configured || data.gemini_configured ? "ready" : "demo");
    } catch {
      setApiStatus("offline");
    }
  }

  async function scanImage(file: File) {
    setError("");
    setResult(null);
    setIsSaved(false);
    setIsLoading(true);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.detail || "The scan request failed.");
      }

      setResult(payload);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Unable to connect to the backend API.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void scanImage(file);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) void scanImage(file);
  }

  function resetScanner() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setResult(null);
    setError("");
    setIsLoading(false);
    setIsSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    void checkHealth();
  }

  function saveScan() {
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 1400);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={t("calorie.eyebrow")}
        title={t("calorie.title")}
        subtitle={t("calorie.subtitle")}
        actions={<StatusPill status={apiStatus} />}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] gap-5">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="m3-card-elevated overflow-hidden"
        >
          <div className="border-b border-outline-variant/40 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-secondary-container grid place-items-center text-on-secondary-container">
                <ImageUp className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-on-surface">{t("calorie.scanPhoto")}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {t("calorie.scanHint")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <input
              ref={fileInputRef}
              id="calorie-image-upload"
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <AnimatePresence mode="wait">
              {previewUrl ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="relative min-h-[320px] overflow-hidden rounded-[1.25rem] border border-outline-variant/50 bg-surface-container"
                >
                  <img
                    src={previewUrl}
                    alt={t("calorie.previewAlt")}
                    className="h-full min-h-[320px] w-full object-cover"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 grid place-items-center bg-primary-container/55 backdrop-blur-sm">
                      <div className="rounded-2xl bg-white/95 px-5 py-4 text-center shadow-elevated">
                        <Loader2 className="mx-auto size-7 animate-spin text-secondary" />
                        <div className="mt-2 text-sm font-bold text-on-surface">{t("calorie.analyzing")}</div>
                        <div className="text-xs text-on-surface-variant">{t("calorie.estimatingIngredients")}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.label
                  key="dropzone"
                  htmlFor="calorie-image-upload"
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={cn(
                    "grid min-h-[320px] cursor-pointer place-items-center rounded-[1.25rem] border-2 border-dashed p-8 text-center transition",
                    isDragging
                      ? "border-secondary bg-secondary-container/50"
                      : "border-secondary/45 bg-secondary-container/20 hover:border-secondary hover:bg-secondary-container/35",
                  )}
                >
                  <span className="max-w-sm">
                    <span className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-secondary-container text-on-secondary-container shadow-soft">
                      <UploadCloud className="size-7" />
                    </span>
                    <span className="block font-display text-xl font-bold text-on-surface">{t("calorie.chooseImage")}</span>
                    <span className="mt-2 block text-sm leading-6 text-on-surface-variant">
                      {t("calorie.uploadHint")}
                    </span>
                  </span>
                </motion.label>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
          className="m3-card-elevated flex min-h-[520px] flex-col overflow-hidden"
          aria-live="polite"
        >
          <div className="border-b border-outline-variant/40 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-on-surface">
                  {result?.meal_title || t("calorie.breakdown")}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {result
                    ? apiStatus === "demo"
                      ? t("calorie.demoComplete")
                      : t("calorie.analysisComplete")
                    : t("calorie.dashboard")}
                </p>
              </div>
              <div className="grid size-11 place-items-center rounded-2xl bg-surface-container-high text-secondary">
                <UtensilsCrossed className="size-5" />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
            {error && (
              <div className="flex gap-3 rounded-2xl border border-destructive/20 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <div>{error}</div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!result && !isLoading ? (
                <EmptyState key="empty" />
              ) : isLoading ? (
                <LoadingState key="loading" />
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-1 flex-col gap-5"
                >
                  <div className="grid gap-3">
                    {ingredients.length > 0 ? (
                      ingredients.map((item, index) => (
                        <IngredientRow key={`${item.name ?? "ingredient"}-${index}`} item={item} index={index} />
                      ))
                    ) : (
                      <div className="rounded-2xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                        {t("calorie.noIngredients")}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex items-center gap-4 rounded-[1.25rem] border border-outline-variant/40 bg-surface-container-low p-4">
                    <ProgressRing percentage={dailyPercentage} />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-on-surface">{t("calorie.totalCalories")}</div>
                      <div className="mt-1 text-sm text-on-surface-variant">
                        <span className="font-display text-2xl font-bold text-on-surface">{totalCalories}</span>{" "}
                        {t("calorie.dailyTarget", { target: DAILY_TARGET })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-3 border-t border-outline-variant/40 bg-white/70 p-5 sm:flex-row sm:p-6">
            <Button
              type="button"
              className="h-12 flex-1 rounded-2xl bg-secondary text-white hover:bg-secondary/90"
              disabled={!result}
              onClick={saveScan}
            >
              {isSaved ? <Check className="size-4" /> : <Save className="size-4" />}
              {isSaved ? t("calorie.saved") : t("calorie.saveToLog")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 flex-1 rounded-2xl border-outline-variant bg-surface-low"
              disabled={!previewUrl && !result && !error}
              onClick={resetScanner}
            >
              <RotateCcw className="size-4" />
              {t("calorie.retake")}
            </Button>
          </div>
        </motion.section>
      </div>
    </AppShell>
  );
}

function StatusPill({ status }: { status: ApiStatus }) {
  const { t } = useI18n();
  const label = {
    checking: t("status.checking"),
    ready: t("status.ready"),
    demo: t("status.demo"),
    offline: t("status.offline"),
  }[status];

  return (
    <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 text-sm font-semibold text-on-surface">
      <span
        className={cn(
          "size-2 rounded-full",
          status === "ready" && "bg-secondary",
          status === "demo" && "bg-amber-500",
          status === "offline" && "bg-destructive",
          status === "checking" && "bg-outline animate-pulse",
        )}
      />
      {label}
    </div>
  );
}

function EmptyState() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid flex-1 place-items-center text-center"
    >
      <div className="max-w-xs">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-surface-container-high text-secondary">
          <Flame className="size-7" />
        </div>
        <h3 className="font-display text-xl font-bold text-on-surface">{t("calorie.readyBreakdown")}</h3>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          {t("calorie.readyText")}
        </p>
      </div>
    </motion.div>
  );
}

function LoadingState() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid flex-1 place-items-center text-center"
    >
      <div className="max-w-xs">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-secondary-container text-on-secondary-container">
          <Loader2 className="size-7 animate-spin" />
        </div>
        <h3 className="font-display text-xl font-bold text-on-surface">{t("calorie.analyzing")}</h3>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          {t("calorie.estimatingTotals")}
        </p>
      </div>
    </motion.div>
  );
}

function IngredientRow({ item, index }: { item: Ingredient; index: number }) {
  const { t } = useI18n();
  const calories = safeNumber(item.calories);
  const weight = safeNumber(item.weight_grams);
  const fillRatio = Math.min((calories / 300) * 100, 100);

  return (
    <div className="rounded-2xl bg-surface-container-low p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-on-surface">{item.name || t("calorie.foodItem")}</div>
          <div className="mt-0.5 text-xs text-on-surface-variant">
            {t("calorie.portion", { weight })}
          </div>
        </div>
        <div className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-on-surface shadow-soft">
          {calories} kcal
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-high">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillRatio}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: colors[index % colors.length] }}
        />
      </div>
    </div>
  );
}

function ProgressRing({ percentage }: { percentage: number }) {
  const visiblePercentage = Math.min(percentage, 100);

  return (
    <div className="relative size-16 shrink-0">
      <svg className="size-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
        <path
          d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          className="text-surface-container-high"
        />
        <motion.path
          d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.5"
          initial={{ strokeDasharray: "0, 100" }}
          animate={{ strokeDasharray: `${visiblePercentage}, 100` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-secondary"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-extrabold text-on-surface">
        {percentage}%
      </div>
    </div>
  );
}

function safeNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : 0;
}
