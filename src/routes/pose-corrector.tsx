import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ScanLine } from "lucide-react";
import { ComingSoonHero } from "./calorie-counter";

export const Route = createFileRoute("/pose-corrector")({
  component: PoseCorrectorPage,
  head: () => ({ meta: [{ title: "Pose Corrector · GymOS" }] }),
});

function PoseCorrectorPage() {
  return (
    <AppShell>
      <ComingSoonHero
        icon={ScanLine}
        eyebrow="AI Module"
        title="Pose Corrector"
        subtitle="AI Pose Correction module coming soon."
        route="/gymos/postcorrector"
      />
    </AppShell>
  );
}
