
"use client";

import { useState, type FormEvent } from "react";
import {
  Bug,
  CheckCircle2,
  Lightbulb,
  LoaderCircle,
  LifeBuoy,
  MessageCircle,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const categories = [
  { id: "bug", label: "Bug report", icon: Bug },
  { id: "feature", label: "Feature request", icon: Lightbulb },
  { id: "feedback", label: "General feedback", icon: MessageCircle },
  { id: "support", label: "Support", icon: LifeBuoy },
] as const;

type Category = (typeof categories)[number]["id"];

export default function FeedbackForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [category, setCategory] = useState<Category>("feedback");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (message.trim().length < 10 || message.trim().length > 3000) {
      setError("Your message must be between 10 and 3,000 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message: message.trim(),
          email: email.trim(),
          pagePath: window.location.pathname,
          website,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      onSuccess?.();
    } catch {
      setError("Couldn't send your feedback. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: "#E6F8F1",
            boxShadow:
              "inset 2px 2px 5px rgba(0,135,86,.08), 4px 4px 10px rgba(166,175,195,.18)",
          }}
        >
          <CheckCircle2 size={28} className="text-[#008756]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#0F172A]">
            Thanks for helping improve SupaPing!
          </h3>
          <p className="text-sm leading-6 text-[#526174]">
            Your feedback has been saved. We appreciate you taking the time.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setSubmitted(false);
            setMessage("");
            setEmail("");
            setCategory("feedback");
          }}
        >
          Send more feedback
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[13px] font-semibold text-[#1E293B]">
          What can we help with?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(({ id, label, icon: Icon }) => {
            const selected = category === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                aria-pressed={selected}
                className={[
                  "flex min-h-[76px] flex-col items-start justify-center gap-2",
                  "rounded-2xl border p-3 text-left transition-all",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006B45]",
                ].join(" ")}
                style={{
                  background: selected ? "#E6F8F1" : "#EEF2F6",
                  borderColor: selected
                    ? "rgba(0,135,86,.35)"
                    : "rgba(255,255,255,.7)",
                  boxShadow: selected
                    ? "inset 2px 2px 5px rgba(0,135,86,.07)"
                    : "4px 4px 9px rgba(166,175,195,.22), -3px -3px 8px rgba(255,255,255,.8)",
                }}
              >
                <Icon
                  size={18}
                  className={selected ? "text-[#006B45]" : "text-[#64748B]"}
                />
                <span className="text-[12px] font-semibold text-[#1E293B]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="feedback-message"
          className="text-[13px] font-semibold text-[#1E293B]"
        >
          Your message
        </label>
        <textarea
          id="feedback-message"
          required
          minLength={10}
          maxLength={3000}
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={
            category === "bug"
              ? "What happened, and what did you expect?"
              : category === "feature"
                ? "What would you like SupaPing to do?"
                : category === "support"
                  ? "Tell us what you need help with."
                  : "Tell us what you think..."
          }
          className="w-full resize-y rounded-xl border border-white/80 bg-[#F7F5F6] px-4 py-3 text-[13px] leading-6 text-[#1E293B] outline-none transition focus:border-[#00A86B]/40 focus:ring-2 focus:ring-[#00A86B]/10 resize-none cursor-text"
          style={{
            minHeight: 130,
            boxShadow:
              "inset 2px 2px 5px rgba(166,175,195,.22), inset -2px -2px 5px rgba(255,255,255,.85)",
          }}
        />
        <span className="text-right font-mono text-[10px] text-[#64748B]">
          {message.length}/3000
        </span>
      </div>

      <Input
        label="Email address (optional)"
        type="email"
        name="feedback-email"
        autoComplete="email"
        maxLength={254}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        hint="Add an email if you'd like us to reply."
      />

      {/* Honeypot: invisible to normal users, useful against basic bots. */}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="feedback-website">Website</label>
        <input
          id="feedback-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
        icon={
          loading ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : undefined
        }
      >
        {loading ? "Sending feedback..." : "Send feedback"}
      </Button>

      <p className="text-center text-[11px] leading-5 text-[#64748B]">
        Please don't include passwords, API keys, or other sensitive information.
      </p>
    </form>
  );
}
