"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ComposeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [to, setTo] = useState(params.get("to") ?? "");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState(params.get("subject") ?? "");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submissionId = params.get("submissionId");

  async function send() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          cc: cc || undefined,
          subject,
          body,
          submissionId: submissionId ? Number(submissionId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      router.push(`/admin/email/${data.threadId}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Compose</h1>
          {submissionId && <p>Re: submission #{submissionId}</p>}
        </div>
        <button className="btn btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
      </header>

      <div className="compose-box">
        <div className="field">
          <label>To</label>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" />
        </div>
        <div className="field">
          <label>Cc</label>
          <input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="optional" />
        </div>
        <div className="field">
          <label>Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="field">
          <label>Message</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} />
        </div>
        <button
          className="btn btn-primary"
          onClick={send}
          disabled={sending || !to || !subject || !body}
          style={{ width: "100%" }}
        >
          {sending ? "Sending…" : "Send"}
        </button>
        {error && <div className="error" style={{ marginTop: "1rem" }}>{error}</div>}
      </div>
    </>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={<p style={{ padding: "2rem" }}>Loading…</p>}>
      <ComposeInner />
    </Suspense>
  );
}