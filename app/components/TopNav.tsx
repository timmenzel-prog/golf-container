"use client";

import { useEffect, useMemo, useState } from "react";

type Item = { label: string; href: string; id: string };

const PRO1PUTT_LOGO =
  "https://levztgbjylvspmfxcbuj.supabase.co/storage/v1/object/public/public-assets/pro1putt-logo.png";

export default function TopNav() {
  const items: Item[] = useMemo(
    () => [
      { label: "Vorteile", href: "#features", id: "features" },
      { label: "Ablauf & Angebot", href: "#ablauf", id: "ablauf" },
      { label: "Stimmen", href: "#stimmen", id: "stimmen" },
      { label: "Kontakt", href: "#kontakt", id: "kontakt" },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-30% 0px -55% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const linkClass = (_id: string) =>
  "px-3 py-2 rounded-[12px] text-sm font-black transition hover:bg-black/5";

  const linkStyle = (_id: string): React.CSSProperties => ({
  color: "var(--fg)",
  background: "transparent",
  border: "1px solid transparent",
});

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.80)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="p1p-container">
        <div className="flex items-center justify-between py-3">
          <a href="#" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div
              className="p1p-card"
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                boxShadow: "none",
                overflow: "hidden",
                borderColor: "rgba(27,82,61,0.20)",
                background: "rgba(255,255,255,0.9)",
              }}
              aria-hidden
            >
              <img
  src={PRO1PUTT_LOGO}
  alt="PRO1PUTT"
  width={30}
  height={30}
  style={{ display: "block" }}
/>
            </div>

            <div className="leading-tight">
              <div className="text-sm font-black">PRO1PUTT</div>
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                Golf Container · powered by PRO1PUTT
              </div>
            </div>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-2">
            {items.map((it) => (
              <a
                key={it.id}
                href={it.href}
                className={linkClass(it.id)}
                style={linkStyle(it.id)}
                onClick={() => setOpen(false)}
              >
                {it.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a className="p1p-btn p1p-btn-outline hidden sm:inline-flex" href="#features">
              Mehr erfahren
            </a>
            <a className="p1p-btn p1p-btn-primary" href="#kontakt">
              Jetzt anfragen
            </a>

            {/* Mobile menu button */}
            <button
              className="md:hidden p1p-btn p1p-btn-outline"
              type="button"
              aria-label="Menü öffnen"
              onClick={() => setOpen((v) => !v)}
              style={{ padding: "10px 12px" }}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="p1p-card p-3" style={{ boxShadow: "none" }}>
              <div className="grid gap-2">
                {items.map((it) => (
                  <a
                    key={it.id}
                    href={it.href}
                    className="px-3 py-2 rounded-[12px] text-sm font-black"
                    style={{
                      color: "var(--fg)",
                      background: active === it.id ? "rgba(27,82,61,0.12)" : "transparent",
                      border:
                        active === it.id
                          ? "1px solid rgba(27,82,61,0.35)"
                          : "1px solid transparent",
                    }}
                    onClick={() => setOpen(false)}
                  >
                    {it.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}