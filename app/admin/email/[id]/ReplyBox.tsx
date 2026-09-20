"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReplyBox({
  threadId, to, subject,
}: { threadId: number; to: string; subject: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    setSending(true);
    await fetch("/api/admin/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, to, subject, body }),
    });
    setBody("");
    setSending(false);
    router.refresh();
  }

  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      <h3>Reply</h3>
      <div className="field">
        <label>To</label>
        <input value={to} readOnly />
      </div>
      <div className="field">
        <label>Subject</label>
        <input value={subject} readOnly />
      </div>
      <div className="field">
        <label>Message</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} />
      </div>
      <button className="btn btn-primary" onClick={send} disabled={sending || !body.trim()}>
        {sending ? "Sending…" : "Send Reply"}
      </button>
    </div>
  );
}