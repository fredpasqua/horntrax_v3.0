import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Field from "../components/Field.jsx";
import DateInput from "../components/DateInput.jsx";
import ScannerModal from "../components/ScannerModal.jsx";
import { deleteLoaner, updateLoaner } from "../lib/api.js";

export default function EditLoaner({ loaners, onSaved, onDeleted, onToast }){
  const { id } = useParams();
  const nav = useNavigate();

  const item = useMemo(() => loaners.find(l => String(l?._id) === String(id)), [loaners, id]);
  const [openScan, setOpenScan] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => ({
    type: item?.type || "",
    brand: item?.brand || "",
    serial: item?.serial || "",
    barcode: String(item?.barcode ?? ""),
    location: item?.location || "",
    dateLastServiced: item?.dateLastServiced ? String(item.dateLastServiced).slice(0,10) : "",
  }));

  const set = (k) => (v) => setForm((p)=>({ ...p, [k]: v }));

  if(!item){
    return (
      <div className="card" style={{padding:16}}>
        <div style={{fontWeight:900}}>Not found</div>
        <div style={{color:"var(--muted)", marginTop:8}}>That instrument isn't in your current list. Try refreshing.</div>
        <div className="row" style={{marginTop:12}}>
          <button className="btn" onClick={() => nav("/")}>Back</button>
        </div>
      </div>
    );
  }

  async function save(){
    setErrors({});
    const next = {};
    ["type","brand","serial","barcode","location"].forEach(k => {
      if(!String(form[k]||"").trim()) next[k] = "Required";
    });
    if(Object.keys(next).length){ setErrors(next); return; }

    const payload = {
      userid: item.userid, // preserve
      type: String(form.type).trim(),
      brand: String(form.brand).trim(),
      serial: String(form.serial).trim(),
      barcode: String(form.barcode).trim(),
      location: String(form.location).trim(),
      // Optional: if you WANT to update in DB; your backend update just merges req.body
      dateLastServiced: form.dateLastServiced ? new Date(form.dateLastServiced).toISOString() : item.dateLastServiced,
    };

    try{
      setBusy(true);
      await updateLoaner(item._id, payload);
      onSaved?.();
    }catch(e){
      const msg = (typeof e?.response?.data === "string" ? e.response.data : null) || e?.message || "Could not update loaner.";
      if(/E11000|duplicate key/i.test(msg)) setErrors({ barcode: "Barcode already exists." });
      onToast?.({ title:"Update failed", message: msg });
    }finally{
      setBusy(false);
    }
  }

  async function del(){
    if(!confirm("Delete this instrument permanently?")) return;
    try{
      setBusy(true);
      await deleteLoaner(item._id);
      onDeleted?.();
    }catch(e){
      const msg = (typeof e?.response?.data === "string" ? e.response.data : null) || e?.message || "Could not delete.";
      onToast?.({ title:"Delete failed", message: msg });
    }finally{
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="spread">
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>Edit Loaner</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            ID: {item._id}
          </div>
        </div>
        <div className="row">
          <button type="button" className="btn" onClick={() => nav("/")}>
            Back
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setOpenScan(true)}
          >
            Scan
          </button>
          <button
            type="button"
            className="btn danger"
            onClick={del}
            disabled={busy}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={save}
            disabled={busy}
          >
            {busy ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <hr className="sep" />

      <div className="grid cols2">
        <Field label="Instrument Type" error={errors.type}>
          <input
            className="input"
            value={form.type}
            onChange={(e) => set("type")(e.target.value)}
          />
        </Field>
        <Field label="Brand" error={errors.brand}>
          <input
            className="input"
            value={form.brand}
            onChange={(e) => set("brand")(e.target.value)}
          />
        </Field>
        <Field label="Serial" error={errors.serial}>
          <input
            className="input"
            value={form.serial}
            onChange={(e) => set("serial")(e.target.value)}
          />
        </Field>
        <Field label="Barcode" error={errors.barcode}>
          <input
            className="input"
            inputMode="numeric"
            value={form.barcode}
            onChange={(e) => set("barcode")(e.target.value)}
            placeholder="Digits"
          />
        </Field>
        <Field label="Location" error={errors.location}>
          <input
            className="input"
            value={form.location}
            onChange={(e) => set("location")(e.target.value)}
          />
        </Field>
        <Field> <DateInput
          label="Date Last Serviced"
          value={form.dateLastServiced}
          onChange={set("dateLastServiced")}
        /></Field>
      
      </div>

      <ScannerModal
        open={openScan}
        onClose={() => setOpenScan(false)}
        onDetected={(val) => set("barcode")(val)}
      />
    </div>
  );
}
