
"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Database,
  FileText,
  KeyRound,
  Link2,
  LoaderCircle,
  Save,
  X,
} from "lucide-react";

export type EditDatabaseValues = {
  name: string;
  projectUrl: string;
  publishableKey: string;
  description: string;
};

type EditDatabaseModalProps = {
  open: boolean;
  initialValues: EditDatabaseValues;
  onClose: () => void;
  onSubmit: (values: EditDatabaseValues) => Promise<unknown>;
};

const inputClassName =
  "w-full rounded-xl border border-white/80 bg-[#EEF2F6] px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10";

const labelClassName = "mb-2 block text-sm font-semibold text-slate-700";

const insetStyle = {
  boxShadow: "inset 4px 4px 8px #d5dbe3, inset -4px -4px 8px #ffffff",
};

const raisedStyle = {
  boxShadow: "6px 6px 14px #d5dbe3, -6px -6px 14px #ffffff",
};

export default function EditDatabaseModal({
  open,
  initialValues,
  onClose,
  onSubmit,
}: EditDatabaseModalProps) {
  const id = useId();

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(initialValues.name);
  const [projectUrl, setProjectUrl] = useState(initialValues.projectUrl);
  const [publishableKey, setPublishableKey] = useState(
    initialValues.publishableKey
  );
  const [description, setDescription] = useState(initialValues.description);
  const [showKey, setShowKey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Populate the form each time the selected instance/modal changes.
  useEffect(() => {
    if (!open) return;

    setName(initialValues.name);
    setProjectUrl(initialValues.projectUrl);
    setPublishableKey(initialValues.publishableKey);
    setDescription(initialValues.description);
    setShowKey(false);
    setError("");
    setSubmitting(false);
  }, [
    open,
    initialValues.name,
    initialValues.projectUrl,
    initialValues.publishableKey,
    initialValues.description,
  ]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, submitting]);

  if (!mounted || !open) return null;

  function validate(): string | null {
    if (!name.trim()) return "Enter a name for this database.";
    if (name.trim().length > 100) {
      return "The database name must be 100 characters or fewer.";
    }
    if (description.length > 500) {
      return "The description must be 500 characters or fewer.";
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(projectUrl.trim());
    } catch {
      return "Enter a valid Supabase project URL.";
    }

    if (
      parsedUrl.protocol !== "https:" ||
      !/^[a-z0-9-]+\.supabase\.co$/i.test(parsedUrl.hostname) ||
      parsedUrl.username ||
      parsedUrl.password ||
      parsedUrl.port ||
      parsedUrl.search ||
      parsedUrl.hash
    ) {
      return "Enter a valid HTTPS Supabase project URL.";
    }

    if (!publishableKey.trim() || /\s/.test(publishableKey.trim())) {
      return "Enter a valid publishable or anon key.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        projectUrl: projectUrl.trim().replace(/\/+$/, ""),
        publishableKey: publishableKey.trim(),
        description: description.trim(),
      });

      onClose();
    } catch {
      // Do not expose raw backend errors in the UI.
      setError("We couldn't update this database. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/25 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="relative my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[700px] flex-col overflow-hidden rounded-[26px] border border-white/80 bg-[#EEF2F6] sm:max-h-[calc(100dvh-3rem)]"
        style={{
          boxShadow:
            "18px 18px 50px rgba(100,116,139,0.22), -12px -12px 40px rgba(255,255,255,0.9)",
        }}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/70 px-5 py-4 sm:px-7 sm:py-5">
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
                Edit database
              </h2>
              <p className="text-xs text-slate-500">
                Update your Supabase instance details
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

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-6"
        >
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Instance settings
            </p>
            <h3 className="text-lg font-bold text-slate-800">
              Your database details
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Changes will be saved to this registered instance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-name`} className={labelClassName}>
                Database name <span className="text-rose-500">*</span>
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
            </div>

            <div>
              <label htmlFor={`${id}-url`} className={labelClassName}>
                Supabase project URL <span className="text-rose-500">*</span>
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
            </div>
          </div>

          <div>
            <label htmlFor={`${id}-key`} className={labelClassName}>
              Anon / publishable key <span className="text-rose-500">*</span>
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
              Use a publishable or legacy anon key. Never enter a service_role
              or secret key.
            </p>
          </div>

          <div>
            <label htmlFor={`${id}-description`} className={labelClassName}>
              Description{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <FileText
                size={17}
                className="pointer-events-none absolute left-4 top-4 text-slate-400"
              />
              <textarea
                id={`${id}-description`}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What is this database used for?"
                rows={3}
                maxLength={500}
                className={`${inputClassName} resize-y pl-11`}
                style={insetStyle}
              />
            </div>
            <p className="mt-1 text-right text-xs text-slate-400">
              {description.length}/500
            </p>
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
              disabled={submitting}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A86B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#008F5B] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ boxShadow: "0 5px 12px rgba(0,168,107,0.22)" }}
            >
              {submitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Saving changes…
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
}