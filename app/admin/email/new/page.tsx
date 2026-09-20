"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ComposeNew() {
  const router = useRouter();
  const params = useSearchParams();
  const [to, setTo] = useState(params.get("to") ?? "");
  const [subject, setSubject] = useState(params.get("subject") ?? "");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setSending(true);
    setError(null);
    const res = await fetch("/api/admin/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to, subject, body,
        submissionId: params.get("submissionId") ? Number(params.get("submissionId")) : null,
      }),
    });
    setSending(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Failed to send");
      return;
    }
    const { threadId } = await res.json();
    router.push(`/admin/email/${threadId}`);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f1eedb", padding: "2rem 0" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Compose</h1>
        <div className="form-wrap">
          <div className="field"><label>To</label><input value={to} onChange={(e) => setTo(e.target.value)} /></div>
          <div className="field"><label>Subject</label><input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <div className="field"><label>Message</label><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} /></div>
          <button className="btn btn-primary" onClick={send} disabled={sending} style={{ width: "100%" }}>
            {sending ? "Sending…" : "Send"}
          </button>
          {error && <div className="error" style={{ marginTop: "1rem" }}>{error}</div>}
        </div>
      </div>
    </main>
  );
}