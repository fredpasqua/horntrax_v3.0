import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { exportLoanersToQrPdf } from "../lib/exportQrPdf.js";

export default function ExportQr({ loaners, onToast }){
  const nav = useNavigate();
  const location = useLocation();

  const filtered = location.state?.filtered || null;
  const list = useMemo(() => Array.isArray(filtered) ? filtered : loaners, [filtered, loaners]);

  async function exportNow(){
    try{
      await exportLoanersToQrPdf(list, `horntrax-qr-${new Date().toISOString().slice(0,10)}.pdf`);
      onToast?.({ title:"Exported", message:"PDF downloaded." });
    }catch(e){
      onToast?.({ title:"Export failed", message: e?.message || "Could not create PDF." });
    }
  }

  return (
    <div className="card" style={{padding:16}}>
      <div className="spread">
        <div>
          <div style={{fontWeight:900, fontSize:20}}>QR Export</div>
          <div style={{color:"var(--muted)", marginTop:6}}>Exports the currently filtered list.</div>
        </div>
        <div className="row">
          <button className="btn" onClick={() => nav("/")}>Back</button>
          <button className="btn primary" onClick={exportNow}>Download PDF</button>
        </div>
      </div>

      <hr className="sep" />

      <div style={{color:"var(--muted)"}}>
        Items to export: <strong style={{color:"var(--text)"}}>{list.length}</strong>
      </div>
      <div style={{marginTop:10, color:"var(--muted)", fontSize:12}}>
        Tip: Use filters/search on Inventory first, then click “Export QR PDF”.
      </div>
    </div>
  );
}
