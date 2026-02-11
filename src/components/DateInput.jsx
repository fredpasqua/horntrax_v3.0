import React from "react";
import Field from "./Field.jsx";

export default function DateInput({ label, value, onChange, error }){
  return (
    <Field label={label} error={error}>
      <input
        className="input"
        type="date"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </Field>
  );
}
