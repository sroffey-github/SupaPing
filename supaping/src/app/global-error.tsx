"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#EEF2F6",
          color: "#0f172a",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <main
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <section style={{ width: "100%", maxWidth: "480px", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#008756",
              }}
            >
              SUPAPING // SYSTEM ERROR
            </p>

            <h1 style={{ fontSize: "32px", letterSpacing: "-0.04em" }}>
              Something broke at the root.
            </h1>

            <p style={{ color: "#475569", lineHeight: 1.8 }}>
              The application could not load normally. You can retry
              the page or refresh the browser.
            </p>

            {error.digest && (
              <p style={{ color: "#64748b", fontFamily: "monospace", fontSize: "12px" }}>
                Reference: {error.digest}
              </p>
            )}

            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: "16px",
                border: 0,
                borderRadius: "12px",
                padding: "13px 20px",
                background: "#008756",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}