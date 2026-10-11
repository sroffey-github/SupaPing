"use client";

import {
  useEffect,
  useId,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  X,
  Database,
  Link2,
  KeyRound,
  FileText,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
} from "lucide-react";

export type AddDatabaseValues = {
  name: string;
  projectUrl: string;
  publishableKey: string;
  description: string;
};

type AddDatabaseModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (
    values: AddDatabaseValues
  ) => Promise<unknown> | unknown;
};

const inputClassName =
  "w-full rounded-xl border border-white/80 bg-[#EEF2F6] px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10";

const labelClassName =
  "mb-2 block text-sm font-semibold text-slate-700";

const insetStyle = {
  boxShadow:
    "inset 4px 4px 8px #d5dbe3, inset -4px -4px 8px #ffffff",
};

const raisedStyle = {
  boxShadow:
    "6px 6px 14px #d5dbe3, -6px -6px 14px #ffffff",
};

const SETUP_SQL = `
-- Create the heartbeat table if it does not exist.
create table if not exists public.keep_alive (
  id integer primary key check (id = 1),
  last_ping_at timestamptz not null default now(),
  ping_token text not null
);

-- Enable Row Level Security.
alter table public.keep_alive enable row level security;

-- Remove the previous policies so this script is repeatable.
drop policy if exists "Allow heartbeat row read"
on public.keep_alive;

drop policy if exists "Allow heartbeat row insert"
on public.keep_alive;

drop policy if exists "Allow heartbeat row update"
on public.keep_alive;

-- Remove existing table-level privileges from public API roles.
revoke all on table public.keep_alive from anon, authenticated;

-- Grant only the column privileges required by the current upsert.
grant select (id)
on table public.keep_alive
to anon, authenticated;

grant insert (id, last_ping_at, ping_token)
on table public.keep_alive
to anon, authenticated;

grant update (last_ping_at, ping_token)
on table public.keep_alive
to anon, authenticated;

-- Allow visibility of the heartbeat row for the upsert operation.
-- Only the id column is selectable through SQL privileges.
create policy "Allow heartbeat row read"
on public.keep_alive
for select
to anon, authenticated
using (id = 1);

-- Allow creation of the single heartbeat row.
create policy "Allow heartbeat row insert"
on public.keep_alive
for insert
to anon, authenticated
with check (id = 1);

-- Allow updates only to the single heartbeat row.
create policy "Allow heartbeat row update"
on public.keep_alive
for update
to anon, authenticated
using (id = 1)
with check (id = 1);

-- Remove unnecessary schema privileges only if your project
-- does not require them for other existing functionality.
-- Do not revoke schema USAGE globally without checking first.`;

function validateProjectUrlInput(value: string): string | null {
  const input = value.trim();

  if (!input) {
    return "Enter your Supabase project URL.";
  }

  if (input.length > 255) {
    return "The project URL must be 255 characters or fewer.";
  }

  let url: URL;

  try {
    url = new URL(input);
  } catch {
    return "Enter a valid Supabase project URL.";
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.search ||
    url.hash ||
    url.pathname !== "/" ||
    !/^[a-z0-9]{20}\.supabase\.co$/.test(url.hostname)
  ) {
    return "Enter only your Supabase project root URL, e.g. https://abcdefghijklmnopqrst.supabase.co. Do not include /rest/v1 or another path.";
  }

  return null;
}


export default function AddDatabaseModal({
  open,
  onClose,
  onSubmit,
}: AddDatabaseModalProps) {
  const id = useId();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [publishableKey, setPublishableKey] = useState("");
  const [description, setDescription] = useState("");

  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sqlConfirmed, setSqlConfirmed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, submitting]);

  useEffect(() => {
    if (open) return;

    setStep(1);
    setName("");
    setProjectUrl("");
    setPublishableKey("");
    setDescription("");
    setShowKey(false);
    setCopied(false);
    setSubmitting(false);
    setError("");
    setSqlConfirmed(false);
  }, [open]);

  if (!mounted || !open) return null;

  function validate(): string | null {
    if (!name.trim()) {
      return "Enter a name for this database.";
    }

    if (/[\u0000-\u001F\u007F]/.test(name.trim())) {
      return "The database name contains invalid characters.";
    }

    if (name.trim().length > 100) {
      return "The database name must be 100 characters or fewer.";
    }

    if (/[\u0000-\u001F\u007F]/.test(description.trim())) {
      return "The description contains invalid characters.";
    }

    if (description.trim().length > 500) {
      return "The description must be 500 characters or fewer.";
    }

    const urlError = validateProjectUrlInput(projectUrl);

    if (urlError) {
      return urlError;
    }

    const key = publishableKey.trim();

    if (!key) {
      return "Enter your Supabase anon or publishable key.";
    }

    if (key.length > 4096) {
      return "The key is too long.";
    }

    if (/\s/.test(key)) {
      return "The key must not contain whitespace.";
    }

    if (/^sb_secret_/i.test(key)) {
      return "Secret keys are not supported. Use a publishable key or legacy anon key.";
    }

    // Legacy anon keys are JWTs. Reject a service_role JWT if supplied.
    const parts = key.split(".");

    if (parts.length === 3) {
      try {
        const payload = JSON.parse(
          atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        if (payload.role === "service_role") {
          return "Service-role keys are not supported. Use a publishable key or legacy anon key.";
        }
      } catch {
        // Leave detailed key validation to the server.
      }
    }

    return null;
  }

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setStep(2);
  }

  async function handleFinish() {
    setError("");

    if (!sqlConfirmed) {
      setError(
        "Please confirm that you have run the setup SQL in your Supabase project."
      );
      return;
    }

    if (!onSubmit) {
      setError(
        "Database saving isn't connected yet. Your details haven't been saved."
      );
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        projectUrl: `https://${new URL(projectUrl.trim()).hostname}`,
        publishableKey: publishableKey.trim(),
        description: description.trim(),
      });

      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't add this database. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopySql() {
    setError("");

    try {
      await navigator.clipboard.writeText(SETUP_SQL);
      setCopied(true);
    } catch {
      setError(
        "Couldn't copy automatically. Please select and copy the SQL manually."
      );
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/25 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitting
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="relative my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-[26px] border border-white/80 bg-[#EEF2F6] sm:max-h-[calc(100dvh-3rem)]"
        style={{
          boxShadow:
            "18px 18px 50px rgba(100,116,139,0.22), -12px -12px 40px rgba(255,255,255,0.9)",
        }}
      >
        {/* Compact header + stepper */}
        <div className="shrink-0 border-b border-slate-200/70 px-5 py-4 sm:px-7 sm:py-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF2F6] text-emerald-600"
                style={raisedStyle}
              >
                <Database size={19} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h2
                  id={`${id}-title`}
                  className="text-base font-bold tracking-tight text-slate-800"
                >
                  Add database
                </h2>
                <p className="text-xs text-slate-500">
                  Set up your Supabase keep-alive
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:text-slate-800 disabled:opacity-50"
              style={raisedStyle}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-[#EEF2F6] p-3 sm:gap-5 sm:p-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  step === 1
                    ? "bg-[#00A86B] text-white"
                    : "bg-emerald-100 text-emerald-700"
                }`}
                style={step === 1 ? raisedStyle : undefined}
              >
                {step === 1 ? "1" : <Check size={17} />}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">
                  Your details
                </p>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Connect your project
                </p>
              </div>
            </div>

            <div
              className={`h-px flex-1 ${
                step === 2 ? "bg-emerald-400" : "bg-slate-300"
              }`}
            />

            <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  step === 2
                    ? "bg-[#00A86B] text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                2
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">
                  Run the SQL
                </p>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Create the heartbeat table
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {step === 1 ? (
            <form onSubmit={handleContinue} className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Step 1 of 2
                </p>
                <h3 className="text-lg font-bold text-slate-800">
                  Your Supabase details
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Find your project URL and publishable key in
                  your project's API settings.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-name`} className={labelClassName}>
                    Database name
                    <span className="ml-1 text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Database
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id={`${id}-name`}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Production database"
                      maxLength={100}
                      required
                      className={`${inputClassName} pl-11`}
                      style={insetStyle}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    A name to identify this project.
                  </p>
                </div>

                <div>
                  <label htmlFor={`${id}-url`} className={labelClassName}>
                    Supabase project URL
                    <span className="ml-1 text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Link2
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id={`${id}-url`}
                      type="url"
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={projectUrl}
                      onChange={(event) => setProjectUrl(event.target.value)}
                      placeholder="https://your-project.supabase.co"
                      required
                      className={`${inputClassName} pl-11`}
                      style={insetStyle}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Your project root URL only. Do not include /rest/v1 or another path.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor={`${id}-key`} className={labelClassName}>
                  Anon / publishable key
                  <span className="ml-1 text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id={`${id}-key`}
                    type={showKey ? "text" : "password"}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    autoComplete="off"
                    value={publishableKey}
                    onChange={(event) => setPublishableKey(event.target.value)}
                    placeholder="sb_publishable_… or legacy anon key"
                    required
                    className={`${inputClassName} pl-11 pr-24`}
                    style={insetStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/10"
                  >
                    {showKey ? "Hide key" : "Show key"}
                  </button>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Use a publishable or legacy anon key. Never
                  enter a service_role or secret key.
                </p>
              </div>

              <div>
                <label
                  htmlFor={`${id}-description-field`}
                  className={labelClassName}
                >
                  Description{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <FileText
                    size={17}
                    className="pointer-events-none absolute left-4 top-4 text-slate-400"
                  />
                  <textarea
                    id={`${id}-description-field`}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What is this database used for?"
                    rows={2}
                    maxLength={500}
                    className={`${inputClassName} resize-y pl-11`}
                    style={insetStyle}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-slate-400">
                  {description.length}/500
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-700/10 bg-emerald-500/[0.045] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Secure connection
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Publishable keys are designed to be public.
                      Your project's permissions and row-level
                      security must still be configured correctly.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200/70 pt-5 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A86B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#008F5B]"
                  style={{
                    boxShadow: "0 5px 12px rgba(0,168,107,0.22)",
                  }}
                >
                  Continue
                  <ChevronRight size={17} />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Step 2 of 2
                </p>
                <h3 className="text-lg font-bold text-slate-800">
                  Run this SQL in your Supabase project
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  This prototype SQL creates a heartbeat table
                  and a function that updates its timestamp.
                  Run it in your project's SQL Editor.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-700/20 bg-[#142334] shadow-lg">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Code2 size={17} className="text-emerald-400" />
                    setup.sql
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/[0.12]"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copied ? "Copied!" : "Copy SQL"}
                  </button>
                </div>

                <pre className="max-h-[320px] overflow-auto p-4 text-xs leading-5 text-emerald-100 sm:max-h-[380px] sm:p-5">
                  <code>{SETUP_SQL}</code>
                </pre>
              </div>

              <div className="rounded-2xl border border-emerald-600/20 bg-emerald-500/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      How to run the SQL
                    </h4>
                    <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm leading-6 text-slate-600">
                      <li>Copy the SQL above.</li>
                      <li>Open your Supabase project dashboard.</li>
                      <li>Go to SQL Editor and create a new query.</li>
                      <li>Paste the SQL and click Run.</li>
                      <li>Return here after it has executed.</li>
                    </ol>
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      This is prototype SQL and has not yet been
                      security-reviewed for production. Completing
                      this step does not currently verify that
                      SupaPing can reach your project.
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/80 p-4">
                <input
                  type="checkbox"
                  checked={sqlConfirmed}
                  onChange={(event) => setSqlConfirmed(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-emerald-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  I've run the SQL in my Supabase project's SQL
                  Editor.
                </span>
              </label>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep(1);
                  }}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:text-slate-900 disabled:opacity-50"
                >
                  <ChevronLeft size={17} />
                  Back
                </button>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={submitting || !sqlConfirmed}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A86B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#008F5B] disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      boxShadow: "0 5px 12px rgba(0,168,107,0.22)",
                    }}
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle size={17} className="animate-spin" />
                        Adding database…
                      </>
                    ) : (
                      <>
                        Finish setup
                        <ChevronRight size={17} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>,
    document.body
  );
}