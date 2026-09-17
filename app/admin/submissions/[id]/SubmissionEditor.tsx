"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "new",
  "review",
  "assessment",
  "partner_search",
  "introduced",
  "active",
  "closed",
];

export default function SubmissionEditor({
  id,
  initial,
}: {
  id: number;
  initial: { status: string; sector_tag: string; assigned_to: string; internal_notes: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initial.status);
  const [sector, setSector] = useState(initial.sector_tag);
  const [assigned, setAssigned] = useState(initial.assigned_to);
  const [notes, setNotes] = useState(initial.internal_notes);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          sector_tag: sector || null,
          assigned_to: assigned || null,
          internal_notes: notes || null,
          __action: "update",
          __note: `Status: ${status}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage("Saved.");
      router.refresh();
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: "1rem" }}>Workflow</h3>

      <div className="field">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Sector tag</label>
        <input value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. manufacturing" />
      </div>

      <div className="field">
        <label>Assigned to</label>
        <input value={assigned} onChange={(e) => setAssigned(e.target.value)} placeholder="Reviewer name/email" />
      </div>

      <div className="field">
        <label>Internal notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
      </div>

      <button className="btn btn-primary" onClick={save} disabled={saving} style={{ width: "100%" }}>
        {saving ? "Saving…" : "Save changes"}
      </button>

      {message && <div className="success" style={{ marginTop: ".75rem" }}>{message}</div>}
    </div>
  );
}