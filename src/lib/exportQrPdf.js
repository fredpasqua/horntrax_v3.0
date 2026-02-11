import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export async function exportLoanersToQrPdf(loaners, filename="horntrax-qr.pdf"){
  const doc = new jsPDF({ orientation:"portrait", unit:"pt", format:"letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const margin = 36;
  const cardW = (pageW - margin*2);
  const cardH = 170;

  let y = margin;

  doc.setFont("helvetica","bold");
  doc.setFontSize(16);
  doc.text("HornTrax QR Export", margin, y);
  y += 18;

  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  doc.text(`Items: ${loaners.length}`, margin, y);
  y += 18;

  for(let i=0;i<loaners.length;i++){
    const l = loaners[i];
    if(y + cardH > pageH - margin){
      doc.addPage();
      y = margin;
    }

    // card border
    doc.setDrawColor(70);
    doc.roundedRect(margin, y, cardW, cardH, 10, 10);

    const barcode = String(l?.barcode ?? "");
    const qrDataUrl = await QRCode.toDataURL(barcode || "0", { margin: 1, width: 140 });

    // QR image
    doc.addImage(qrDataUrl, "PNG", margin+14, y+14, 140, 140);

    const tx = margin + 170;
    const ty = y + 28;

    doc.setFont("helvetica","bold");
    doc.setFontSize(14);
    doc.text(`${l?.type ?? ""} • ${l?.brand ?? ""}`, tx, ty);

    doc.setFont("helvetica","normal");
    doc.setFontSize(11);
    doc.text(`Serial: ${l?.serial ?? ""}`, tx, ty+22);
    doc.text(`Barcode: ${barcode}`, tx, ty+42);
    doc.text(`Location: ${l?.location ?? ""}`, tx, ty+62);

    y += cardH + 12;
  }

  doc.save(filename);
}
