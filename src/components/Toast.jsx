import React, { useEffect } from "react";

export default function Toast({ title, message, onClose }){
  useEffect(() => {
    const t = setTimeout(() => onClose?.(), 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  if(!title && !message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      {title && <strong>{title}</strong>}
      {message && <div style={{color:"var(--muted)", fontSize:13}}>{message}</div>}
    </div>
  );
}
