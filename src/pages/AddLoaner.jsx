import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../components/Field.jsx";
import ScannerModal from "../components/ScannerModal.jsx";
import { addLoaner } from "../lib/api.js";

export default function AddLoaner({ user, onAdded, onToast }){
  const nav = useNavigate();
  const [openScan, setOpenScan] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    type:"",
    brand:"",
    serial:"",
    barcode:"",
    location:"",
  });

  const set = (k) => (v) => setForm((p)=>({ ...p, [k]: v }));

  async function submit(){
    setErrors({});
    const next = {};
    ["type","brand","serial","barcode","location"].forEach(k => {
      if(!String(form[k]||"").trim()) next[k] = "Required";
    });
    if(Object.keys(next).length){ setErrors(next); return; }

    const payload = {
      userid: user._id,
      type: String(form.type).trim(),
      brand: String(form.brand).trim(),
      serial: String(form.serial).trim(),
      barcode: String(form.barcode).trim(), // backend casts to Number
      location: String(form.location).trim(),
    };

    try{
      setBusy(true);
      await addLoaner(payload);
      onAdded?.();
    }catch(e){
      const msg = (typeof e?.response?.data === "string" ? e.response.data : null) || e?.message || "Could not add loaner.";
      // Highlight likely field if possible
      if(/E11000|duplicate key/i.test(msg)) setErrors({ barcode: "Barcode already exists." });
      onToast?.({ title: "Save failed", message: msg });
    }finally{
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{padding:16}}>
      <div className="spread">
        <div>
          <div style={{fontWeight:900, fontSize:20}}>Add Loaner</div>
          <div style={{color:"var(--muted)", marginTop:6}}>Creates a new instrument for your user id.</div>
        </div>
        <div className="row">
          <button className="btn" onClick={() => nav("/")}>Back</button>
          <button className="btn" onClick={() => setOpenScan(true)}>Scan</button>
          <button className="btn primary" onClick={submit} disabled={busy}>{busy ? "Saving..." : "Save"}</button>
        </div>
      </div>

      <hr className="sep" />

      <div className="grid cols2">
        <Field label="Instrument Type" error={errors.type}>
          <input className={"input"} value={form.type} onChange={(e)=>set("type")(e.target.value)} />
        </Field>
        <Field label="Brand" error={errors.brand}>
          <input className="input" value={form.brand} onChange={(e)=>set("brand")(e.target.value)} />
        </Field>
        <Field label="Serial" error={errors.serial}>
          <input className="input" value={form.serial} onChange={(e)=>set("serial")(e.target.value)} />
        </Field>
        <Field label="Barcode" error={errors.barcode}>
          <input className="input" inputMode="numeric" value={form.barcode} onChange={(e)=>set("barcode")(e.target.value)} placeholder="Scan or type digits" />
        </Field>
        <Field label="Location" error={errors.location}>
          <input className="input" value={form.location} onChange={(e)=>set("location")(e.target.value)} />
        </Field>
      </div>

      <ScannerModal
        open={openScan}
        onClose={() => setOpenScan(false)}
        onDetected={(val) => set("barcode")(val)}
      />
    </div>
  );
}
