"use client";

import { useState, type FormEvent } from "react";
import { subscribe } from "@/app/actions/subscribe";

export default function EmailForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    const result = await subscribe(email);

    if (result.success) {
      setStatus("success");
    } else {
      setErrorMsg(result.error ?? "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="success-card animate-success-in relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-brand-accent/20 bg-brand-darker/80 px-6 py-5 backdrop-blur-sm">
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-accent/15 blur-3xl animate-success-glow" />
        <div
          className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl animate-success-glow"
          style={{ animationDelay: "0.3s" }}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
            <svg
              className="h-4 w-4 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M4 12l6 6L20 6"
                className="animate-draw-check"
                pathLength={1}
              />
            </svg>
          </div>
          <p className="font-display text-base font-semibold text-brand-text">
            You&rsquo;re on the list!
          </p>
        </div>

        <p className="relative font-body text-sm font-light leading-relaxed text-brand-muted">
          We&rsquo;ll notify you as soon as NuvedaAI is ready.
          <br />
          Stay tuned for something special.
        </p>

        <div className="pointer-events-none absolute right-6 top-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-1 w-1 rounded-full bg-brand-accent animate-sparkle"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="group relative flex flex-col gap-3 sm:flex-row sm:gap-0"
      >
        <div
          className="relative flex flex-col rounded-2xl p-px sm:flex-row transition-all duration-500"
          style={{
            background: focused
              ? "linear-gradient(135deg, #6f2fff 0%, #aa80ff 50%, #6f2fff 100%)"
              : "linear-gradient(135deg, #3d2e5c 0%, #1e1238 50%, #3d2e5c 100%)",
          }}
        >
          <div className="flex flex-col rounded-[calc(1rem-1px)] bg-brand-darker sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter your email"
              disabled={status === "loading"}
              className="h-14 w-full bg-transparent px-6 font-body text-sm font-light text-brand-text outline-none placeholder:text-brand-muted disabled:opacity-50 sm:w-72 md:w-80"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="group/btn relative h-14 cursor-pointer overflow-hidden whitespace-nowrap rounded-b-[calc(1rem-1px)] bg-brand-accent px-8 font-body text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:shadow-[0_0_32px_rgba(111,47,255,0.5)] active:scale-[0.98] disabled:cursor-wait sm:rounded-none sm:rounded-r-[calc(1rem-1px)]"
            >
              <span className="relative z-10">
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Joining…
                  </span>
                ) : (
                  "Be First to Know"
                )}
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-brand-accent to-[#9055ff] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
            </button>
          </div>
        </div>
      </form>
      {status === "error" && errorMsg && (
        <p className="animate-fade-up font-body text-[0.75rem] font-light text-red-400">
          {errorMsg}
        </p>
      )}
      <p className="font-body text-[0.7rem] font-light text-brand-dim">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
