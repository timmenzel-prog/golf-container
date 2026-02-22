import { NextResponse } from "next/server";
import { Resend } from "resend";

function norm(v: unknown) {
  return String(v ?? "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = norm(body?.name);
    const email = norm(body?.email);
    const subject = norm(body?.subject) || "Kontaktanfrage";
    const message = norm(body?.message);

    if (!email || !message) {
      return NextResponse.json(
        { ok: false, error: "Bitte E-Mail und Nachricht ausfüllen." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || "noreply@pro1putt.com";

    if (!apiKey || !to) {
      return NextResponse.json(
        { ok: false, error: "Server nicht konfiguriert (RESEND_API_KEY / CONTACT_TO_EMAIL)." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const safe = (s: string) =>
      s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Neue Kontaktanfrage</h2>
        <p><b>Name:</b> ${safe(name || "-")}</p>
        <p><b>E-Mail:</b> ${safe(email)}</p>
        <p><b>Betreff:</b> ${safe(subject)}</p>
        <p><b>Nachricht:</b><br/>${safe(message).replaceAll("\n", "<br/>")}</p>
      </div>
    `;

   const adminSend = await resend.emails.send({
  from,
  to,
  subject: `Golf Container: ${subject}`,
  replyTo: email,
  html,
  text: `Neue Kontaktanfrage\n\nName: ${name}\nE-Mail: ${email}\nBetreff: ${subject}\n\n${message}`,
});

console.log("RESEND adminSend:", adminSend);
    // Confirmation to sender (optional, but recommended)
const userSend = await resend.emails.send({
  from,
  to: email,
  subject: "Danke! Wir haben deine Anfrage erhalten (Golf Container by PRO1PUTT)",
  html: `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <p><b>Danke${name ? " " + safe(name) : ""}!</b></p>
      <p>Wir haben deine Anfrage erhalten und melden uns schnellstmöglich zurück.</p>
      <p style="margin-top:16px;color:#666;font-size:13px">
        <b>Deine Nachricht:</b><br/>
        ${safe(message).replaceAll("\n", "<br/>")}
      </p>
      <p style="margin-top:18px;color:#666;font-size:13px">
        Golf Container by PRO1PUTT
      </p>
    </div>
  `,
  text: `Danke${name ? " " + name : ""}!\n\nWir haben deine Anfrage erhalten und melden uns schnellstmöglich zurück.\n\nDeine Nachricht:\n${message}\n\nGolf Container by PRO1PUTT`,
});

console.log("RESEND userSend:", userSend);

    return NextResponse.json({ ok: true, adminSend, userSend });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Serverfehler" },
      { status: 500 }
    );
  }
}