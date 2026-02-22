"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string>("");

  const disabled = status === "sending";

  const inputStyle = useMemo(
    () => ({
      borderColor: "var(--border)",
      background: "rgba(255,255,255,0.92)",
    }),
    []
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    setErr("");
    setStatus("sending");

    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      subject: String(fd.get("subject") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    if (!payload.email || !payload.message) {
      setStatus("error");
      setErr("Bitte E-Mail und Nachricht ausfüllen.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Senden fehlgeschlagen.");
      }

      setStatus("success");
      form.reset();
    } catch (e: any) {
      setStatus("error");
      setErr(e?.message || "Senden fehlgeschlagen.");
    }
  }

  return (
    <form className="mt-7 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      <div className="md:col-span-1">
        <label className="text-sm font-black">Name</label>
        <input
          name="name"
          disabled={disabled}
          className="mt-2 w-full p-3 rounded-[14px] border outline-none"
          style={inputStyle as any}
          placeholder="Dein Name"
          autoComplete="name"
        />
      </div>

      <div className="md:col-span-1">
        <label className="text-sm font-black">E-Mail *</label>
        <input
          name="email"
          disabled={disabled}
          className="mt-2 w-full p-3 rounded-[14px] border outline-none"
          style={inputStyle as any}
          placeholder="dein.name@mail.de"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-black">Betreff</label>
        <input
          name="subject"
          disabled={disabled}
          className="mt-2 w-full p-3 rounded-[14px] border outline-none"
          style={inputStyle as any}
          placeholder="z.B. Angebot / Fragen / Standort"
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-black">Nachricht *</label>
        <textarea
          name="message"
          disabled={disabled}
          className="mt-2 w-full p-3 rounded-[14px] border outline-none min-h-[140px]"
          style={inputStyle as any}
          placeholder="Kurze Info zu deinem Vorhaben…"
          required
        />
      </div>

      {/* Status */}
      <div className="md:col-span-2">
        {status === "success" && (
          <div
            className="p1p-card p-4"
            style={{
              borderColor: "rgba(27,82,61,0.35)",
              background: "rgba(27,82,61,0.06)",
              boxShadow: "none",
            }}
          >
            <div className="font-black" style={{ color: "var(--p1p-green)" }}>
              ✅ Nachricht wurde gesendet.
            </div>
            <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Danke! Wir melden uns schnellstmöglich.
            </div>
          </div>
        )}

        {status === "error" && (
          <div
            className="p1p-card p-4"
            style={{
              borderColor: "rgba(220, 38, 38, 0.25)",
              background: "rgba(220, 38, 38, 0.06)",
              boxShadow: "none",
            }}
          >
            <div className="font-black" style={{ color: "#b91c1c" }}>
              ⚠️ Konnte nicht senden
            </div>
            <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {err || "Bitte später erneut versuchen."}
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
        <button className="p1p-btn p1p-btn-primary" type="submit" disabled={disabled}>
          {status === "sending" ? "Sende…" : "Nachricht senden"}
        </button>

        <a className="p1p-btn p1p-btn-outline" href="#features" aria-disabled={disabled}>
          Erstmal Features ansehen
        </a>
      </div>

      <div className="md:col-span-2 text-xs" style={{ color: "var(--muted)" }}>
        * Pflichtfelder
      </div>
    </form>
  );
}