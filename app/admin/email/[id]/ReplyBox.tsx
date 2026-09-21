"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReplyBox({
  threadId,
  to,
  subject,
}: {
  threadId: number;
  to: string;
  subject: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, to, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setBody("");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="compose-box">
      <h3 className="section-title">Reply</h3>
      <div className="field">
        <label>To</label>
        <input value={to} readOnly />
      </div>
      <div className="field">
        <label>Message</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} />
      </div>
      <button
        className="btn btn-primary"
        onClick={send}
        disabled={sending || !body.trim()}
        style={{ width: "100%" }}
      >
        {sending ? "Sending…" : "Send Reply"}
      </button>
      {error && <div className="error" style={{ marginTop: "1rem" }}>{error}</div>}
    </div>
  );
}