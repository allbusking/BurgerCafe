import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Eye, EyeOff, Flame, Mail, Lock, User } from "lucide-react";
import { LoadingButton } from "@/components/LoadingButton";
import { PageTransition } from "@/components/PageTransition";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Sign Up — HOT B&B" },
      { name: "description", content: "Access your House of Tea account." },
    ],
  }),
  component: AuthPage,
});

type Tab = "signin" | "signup";

function AuthPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const { login, signup, loginWithGoogle } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<typeof form> = {};
    if (tab === "signup" && form.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    if (tab === "signup" && form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords must match";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (tab === "signin") {
        await login(form.email, form.password);
      } else {
        await signup(form.email, form.password, form.name);
      }
      showToast("Signed in successfully", "success");
      navigate({ to: "/" });
    } catch {
      showToast("Try Again", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background grid + glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--neon) 40%, transparent), transparent 70%)" }}
      />

      <div className="relative z-10 min-h-screen grid place-items-center px-4 py-16">
        <div className="w-full max-w-[440px] glass-dark rounded-[1.25rem] sm:rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl shadow-black/60 border border-white/5 animate-fade-in">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-1.5 mb-8">
            <span className="font-display text-4xl tracking-wide text-foreground leading-none">
              HOT B&B
            </span>
            <Flame size={22} className="text-neon" strokeWidth={2.5} />
          </Link>

          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-white/5 mb-8">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "py-2.5 text-sm font-bold rounded-full transition-all duration-300",
                  tab === t
                    ? "bg-neon text-black shadow-[0_0_20px_rgba(200,241,53,0.3)]"
                    : "text-foreground/60 hover:text-foreground",
                ].join(" ")}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Forms */}
          {tab === "signin" ? (
            <form className="space-y-4 animate-fade-in" onSubmit={submit}>
              <Field icon={<Mail size={16} />} type="email" placeholder="Email address" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} valid={Boolean(form.email && !errors.email)} />
              <Field
                icon={<Lock size={16} />}
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                error={errors.password}
                valid={Boolean(form.password && !errors.password)}
                right={
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="text-foreground/50 hover:text-neon">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <div className="flex justify-end">
                <button type="button" className="text-xs font-semibold text-neon hover:underline">
                  Forgot Password?
                </button>
              </div>
              <LoadingButton
                isLoading={submitting}
                className="w-full rounded-full bg-neon py-3.5 text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] hover:scale-[1.01] active:scale-95 disabled:opacity-70"
              >
                Sign In
              </LoadingButton>
            </form>
          ) : (
            <form className="space-y-4 animate-fade-in" onSubmit={submit}>
              <Field icon={<User size={16} />} type="text" placeholder="Full Name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} valid={Boolean(form.name && !errors.name)} />
              <Field icon={<Mail size={16} />} type="email" placeholder="Email address" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} valid={Boolean(form.email && !errors.email)} />
              <Field
                icon={<Lock size={16} />}
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                error={errors.password}
                valid={Boolean(form.password && !errors.password)}
                right={
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="text-foreground/50 hover:text-neon">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <Field
                icon={<Lock size={16} />}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
                valid={Boolean(form.confirmPassword && !errors.confirmPassword)}
                right={
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-foreground/50 hover:text-neon">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <LoadingButton
                isLoading={submitting}
                className="w-full rounded-full bg-neon py-3.5 text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] hover:scale-[1.01] active:scale-95 disabled:opacity-70"
              >
                Create Account
              </LoadingButton>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-widest text-foreground/40">or continue with</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={async () => {
              await loginWithGoogle();
              showToast("Signed in with Google", "success");
              navigate({ to: "/" });
            }}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-white py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] text-foreground/40 leading-relaxed">
            By signing up you agree to our{" "}
            <a className="text-foreground/70 hover:text-neon">Terms</a> &{" "}
            <a className="text-foreground/70 hover:text-neon">Privacy Policy</a>
          </p>
        </div>
      </div>
    </main>
    </PageTransition>
  );
}

function Field({
  icon,
  right,
  error,
  valid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  right?: React.ReactNode;
  error?: string;
  valid?: boolean;
}) {
  return (
    <div>
      <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">{icon}</span>
      <input
        {...props}
        className={[
          "min-h-12 w-full rounded-2xl bg-white/[0.04] border pl-11 pr-11 py-3.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-neon focus:bg-white/[0.06]",
          error ? "border-red-500" : valid ? "border-emerald-500" : "border-white/10",
        ].join(" ")}
      />
      {right ? <span className="absolute right-4 top-1/2 -translate-y-1/2">{right}</span> : valid ? <Check className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" /> : null}
      </div>
      {error && <p className="mt-1.5 animate-fade-in text-xs text-red-500">{error}</p>}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5c-7.5 0-14 4.3-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13.1-5l-6-5.1c-2 1.4-4.4 2.1-7.1 2.1-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.9 39.1 16.4 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.2 5.4l6 5.1C40.9 35.9 43.5 30.4 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
