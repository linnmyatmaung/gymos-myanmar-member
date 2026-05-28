import { FormEvent, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Dumbbell, LockKeyhole, LogIn, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/",
  }),
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Login - GymOS" }],
  }),
});

function LoginPage() {
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!login(username, password)) {
      setError(t("login.error"));
      return;
    }

    await router.invalidate();
    window.location.replace(redirect || "/");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-outline-variant/50 bg-surface-lowest p-6 shadow-elevated sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary-container text-secondary-container shadow-glow">
            <Dumbbell className="size-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-on-surface">{t("login.title")}</h1>
            <p className="mt-1 text-sm text-on-surface-variant">{t("login.subtitle")}</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-on-surface">{t("login.username")}</span>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-11 rounded-xl bg-surface-container-low pl-10"
                autoComplete="username"
                autoFocus
                required
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-on-surface">{t("login.password")}</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-xl bg-surface-container-low pl-10"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error ? (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="h-11 w-full rounded-xl">
            <LogIn className="size-4" />
            {t("login.signIn")}
          </Button>
        </form>
      </section>
    </main>
  );
}
