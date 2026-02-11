import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { norm, fmtDate } from "../lib/format.js";

export default function Inventory({ user, loaners, onRefresh, onToast }){
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [location, setLocation] = useState("all");

  const types = useMemo(() => {
    const set = new Set(loaners.map(l => l?.type).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [loaners]);

  const locations = useMemo(() => {
    const set = new Set(loaners.map(l => l?.location).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [loaners]);

  const filtered = useMemo(() => {
    const nq = norm(q);
    return loaners.filter(l => {
      if(type !== "all" && l?.type !== type) return false;
      if(location !== "all" && l?.location !== location) return false;

      if(!nq) return true;
      const hay = [
        l?.type, l?.brand, l?.serial, l?.barcode, l?.location,
      ].map(norm).join(" ");
      return hay.includes(nq);
    });
  }, [loaners, q, type, location]);

  return (
    <div className="grid">
      <div className="card" style={{ padding: 14 }}>
        <div className="spread">
          <div>
            <div style={{ fontWeight: 900, fontSize: 20 }}>Tracked Inventory</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              Welcome back, {user.username}!
            </div>
          </div>
          <div className="row">
            <button
              className="btn"
              onClick={() => onRefresh?.().catch(() => {})}
            >
              Refresh
            </button>
            <button
              className="btn"
              onClick={() => nav("/export", { state: { filtered } })}
            >
              Export QR PDF
            </button>
            <button className="btn primary" onClick={() => nav("/add")}>
              + Add
            </button>
          </div>
        </div>

        <hr className="sep" />

        <div className="grid cols2">
          <div className="field">
            <div className="label">Search</div>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by serial, barcode, brand, location..."
            />
          </div>

          <div className="row" style={{ alignItems: "flex-end" }}>
            <div className="field" style={{ flex: 1, minWidth: 200 }}>
              <div className="label">Type</div>
              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ flex: 1, minWidth: 200 }}>
              <div className="label">Location</div>
              <select
                className="input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          className="row"
          style={{ marginTop: 12, color: "var(--muted)", fontSize: 12 }}
        >
          Showing{" "}
          <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> of{" "}
          {loaners.length}
        </div>
      </div>

      <div className="list">
        {filtered.map((l) => (
          <a key={l?._id} className="item" href={`#/edit/${l?._id}`}>
            <div>
              <h3>
                {l?.type || "(No type)"} • {l?.brand || "(No brand)"}
              </h3>
              <p>
                Serial:{" "}
                <strong style={{ color: "var(--text)" }}>
                  {l?.serial || "-"}
                </strong>{" "}
                · Barcode:{" "}
                <strong style={{ color: "var(--text)" }}>
                  {l?.barcode || "-"}
                </strong>
                <br />
                Location: {l?.location || "-"} · Last serviced:{" "}
                {fmtDate(l?.dateLastServiced) || "-"}
              </p>
            </div>
            <div className="kv">
              <span>Edit</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
