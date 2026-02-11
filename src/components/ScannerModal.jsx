import React, { useEffect, useRef, useState } from "react";

function hasBarcodeDetector(){
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}

export default function ScannerModal({ open, onClose, onDetected }){
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if(!open) return;

    let alive = true;

    async function start(){
      setError("");
      try{
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if(videoRef.current){
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        if(!hasBarcodeDetector()){
          setError("Barcode scanning is not supported in this browser. Use manual entry.");
          return;
        }

        const detector = new window.BarcodeDetector({ formats: ["qr_code","code_128","code_39","ean_13","ean_8","upc_a","upc_e","itf"] });

        const tick = async () => {
          if(!alive) return;
          try{
            const video = videoRef.current;
            if(video && video.readyState >= 2){
              const codes = await detector.detect(video);
              if(codes && codes.length){
                const raw = codes[0]?.rawValue || "";
                const digits = String(raw).replace(/\D/g,"");
                onDetected?.(digits || raw);
                onClose?.();
                return;
              }
            }
          }catch(e){
            // ignore per-frame errors
          }
          requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      }catch(e){
        setError(e?.message || "Could not access camera.");
      }
    }

    start();

    return () => {
      alive = false;
      try{
        if(streamRef.current){
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
      }catch{}
    };
  }, [open, onClose, onDetected]);

  if(!open) return null;

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="modalHeader">
          <div style={{fontWeight:900}}>Scan barcode</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div className="modalBody">
          <video ref={videoRef} playsInline muted />
          {error && <div style={{marginTop:10, color:"var(--muted)"}}>{error}</div>}
          <div style={{marginTop:10, color:"var(--muted)", fontSize:13}}>
            Tip: If scanning doesn't work on iPhone Safari, try Chrome on iOS or manual entry.
          </div>
        </div>
      </div>
    </div>
  );
}
