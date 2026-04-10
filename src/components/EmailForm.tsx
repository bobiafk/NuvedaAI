"use client";

import { useState, useRef } from "react";

const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID ?? "";
const TALLY_SCRIPT = "https://tally.so/widgets/embed.js";

function styleTallyPopup() {
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        const iframe = node.querySelector?.('iframe[src*="tally.so"]') as HTMLIFrameElement | null;
        if (!iframe) continue;

        observer.disconnect();

        const overlay = iframe.closest("div[style]")?.parentElement ?? node;

        Object.assign(overlay.style, {
          background: "rgba(10, 6, 18, 0.8)",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
          transition: "opacity 0.3s ease",
        });

        const container = iframe.parentElement;
        if (container) {
          Object.assign(container.style, {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 0 0 1px rgba(111,47,255,0.2), 0 32px 80px -12px rgba(0,0,0,0.7), 0 0 80px -20px rgba(111,47,255,0.25)",
            transform: "translateY(0)",
            animation: "none",
          });
          container.animate(
            [
              { opacity: 0, transform: "translateY(20px) scale(0.97)" },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ],
            { duration: 400, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "forwards" }
          );
        }

        iframe.style.borderRadius = "20px";

        const closeBtn = overlay.querySelector("button") ?? overlay.querySelector("[class*=close]");
        if (closeBtn instanceof HTMLElement) {
          Object.assign(closeBtn.style, {
            background: "rgba(30, 18, 56, 0.9)",
            border: "1px solid rgba(111,47,255,0.3)",
            borderRadius: "12px",
            color: "#aa80ff",
            backdropFilter: "blur(8px)",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            cursor: "pointer",
          });
          closeBtn.addEventListener("mouseenter", () => {
            closeBtn.style.background = "rgba(111,47,255,0.35)";
            closeBtn.style.color = "#fff";
          });
          closeBtn.addEventListener("mouseleave", () => {
            closeBtn.style.background = "rgba(30,18,56,0.9)";
            closeBtn.style.color = "#aa80ff";
          });
        }

        return;
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 5000);
}

function loadTallyScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Tally) {
      resolve();
      return;
    }
    if (document.querySelector(`script[src="${TALLY_SCRIPT}"]`)) {
      const check = setInterval(() => {
        if (window.Tally) { clearInterval(check); resolve(); }
      }, 50);
      return;
    }
    const script = document.createElement("script");
    script.src = TALLY_SCRIPT;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}

export default function EmailForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const submittedRef = useRef(false);

  async function handleClick() {
    if (status === "loading") return;

    setStatus("loading");
    submittedRef.current = false;

    if (TALLY_FORM_ID) {
      await loadTallyScript();

      if (window.Tally) {
        styleTallyPopup();
        window.Tally.openPopup(TALLY_FORM_ID, {
          layout: "modal",
          width: 400,
          hideTitle: true,
          overlay: true,
          autoClose: 2000,
          customFormUrl: `https://tally.so/embed/${TALLY_FORM_ID}?transparentBackground=1&hideTitle=1`,
          onOpen: () => {
            setStatus("idle");
          },
          onSubmit: () => {
            submittedRef.current = true;
            setStatus("success");
          },
          onClose: () => {
            if (!submittedRef.current) {
              setStatus("idle");
            }
          },
        });
        return;
      }
    }

    setStatus("idle");
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
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="group/btn relative h-14 cursor-pointer overflow-hidden whitespace-nowrap rounded-2xl bg-brand-accent px-10 font-body text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(111,47,255,0.5)] active:scale-[0.97] disabled:cursor-wait"
    >
      <span className="relative z-10">
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Loading…
          </span>
        ) : (
          "Be First to Know"
        )}
      </span>
      <span className="absolute inset-0 bg-linear-to-r from-brand-accent to-[#9055ff] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
    </button>
  );
}
