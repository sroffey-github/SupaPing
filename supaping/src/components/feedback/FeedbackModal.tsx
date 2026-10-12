
"use client";

import { useEffect, useState } from "react";
import { MessageSquareText, X } from "lucide-react";
import FeedbackForm from "@/components/feedback/FeedbackForm";

export default function FeedbackModal({
  floating = false,
}: {
  floating?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {floating ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-2xl border border-white/70 bg-[#EEF2F6] px-4 py-3 text-[13px] font-semibold text-[#006B45] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#006B45] sm:bottom-7 sm:right-7"
          style={{
            boxShadow:
              "6px 6px 16px rgba(166,175,195,.4), -5px -5px 14px rgba(255,255,255,.9)",
          }}
        >
          <MessageSquareText size={18} />
          <span>Feedback</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-[#006B45] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#006B45]"
        >
          <MessageSquareText size={14} />
          Support &amp; Feedback
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/35 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
            className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/70 bg-[#EEF2F6] p-5 sm:rounded-3xl sm:p-7"
            style={{
              boxShadow:
                "12px 12px 35px rgba(15,23,42,.16), -4px -4px 18px rgba(255,255,255,.6)",
            }}
          >
            <header className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E6F8F1] text-[#006B45]">
                  <MessageSquareText size={21} />
                </div>
                <div>
                  <h2
                    id="feedback-modal-title"
                    className="text-lg font-bold tracking-tight text-[#0F172A]"
                  >
                    Help us improve SupaPing
                  </h2>
                  <p className="mt-1 text-[12px] leading-5 text-[#526174]">
                    Report a bug, request a feature, or get in touch.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close feedback form"
                className="rounded-xl p-2 text-[#64748B] transition hover:bg-white/70 hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-[#006B45]"
              >
                <X size={19} />
              </button>
            </header>
            <FeedbackForm onSuccess={() => {}} />
          </section>
        </div>
      )}
    </>
  );
}
