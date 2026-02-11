export function norm(s){
  return String(s ?? "").trim().toLowerCase();
}

export function fmtDate(d){
  if(!d) return "";
  try{
    const dt = new Date(d);
    if(Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"2-digit" });
  }catch{
    return String(d);
  }
}
