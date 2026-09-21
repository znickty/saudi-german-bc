"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Member = {
  id: number;
  full_name: string;
  role: string;
  committee_email: string | null;
  title: string | null;
};

export default function AssignPanel({
  id,
  members,
  currentAssignee,
}: {
  id: number;
  members: Member[];
  currentAssignee: number | null;
}) {
  const router = useRouter();
  const [memberId, setMemberId] = useState(String(currentAssignee ?? ""));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function assign() {
    if (!memberId) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: Number(memberId), note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assignment failed");
      setMsg(`Assigned to ${data.member.full_name}`);
      setNote("");
      router.refresh();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h3 className="section-title">Assign to Committee Member</h3>

      <div className="field">
        <label>Member</label>
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
          <option value="">Select…</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name} — {m.role.replace("_", " ")}
              {m.committee_email ? ` (${m.committee_email})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Reason for assignment or specific instructions"
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={assign}
        disabled={saving || !memberId}
        style={{ width: "100%" }}
      >
        {saving ? "Assigning…" : "Assign"}
      </button>

      {msg && <div className="success" style={{ marginTop: ".75rem" }}>{msg}</div>}
    </div>
  );
}