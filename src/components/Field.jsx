import React from "react";

export default function Field({ label, error, children }){
  return (
    <div className="field">
      <div className="label">{label}</div>
      {children}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
