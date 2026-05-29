import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const poseCorrectorUrl =
  "https://huggingface.co/spaces/Ambatakam89/burmese-voice-pose-corrector";

export const Route = createFileRoute("/pose-corrector")({
  component: PoseCorrectorRedirect,
  head: () => ({ meta: [{ title: "Pose Corrector - GymOS" }] }),
});

function PoseCorrectorRedirect() {
  useEffect(() => {
    window.location.replace(poseCorrectorUrl);
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4 text-center text-on-surface">
      <div>
        <h1 className="text-xl font-semibold">Opening Pose Corrector</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Redirecting to the Hugging Face Space.
        </p>
        <a
          href={poseCorrectorUrl}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-secondary-container px-5 py-2.5 text-sm font-bold text-on-secondary-container transition-transform hover:scale-105"
        >
          Open Pose Corrector
        </a>
      </div>
    </main>
  );
}
