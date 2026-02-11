import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Topbar from "./components/Topbar.jsx";
import Toast from "./components/Toast.jsx";
import { clearUser, getStoredUser, storeUser } from "./lib/auth.js";
import { getLoanersByUserId } from "./lib/api.js";

import Login from "./pages/Login.jsx";
import Inventory from "./pages/Inventory.jsx";
import AddLoaner from "./pages/AddLoaner.jsx";
import EditLoaner from "./pages/EditLoaner.jsx";
import ExportQr from "./pages/ExportQr.jsx";

export default function App(){
  const [user, setUser] = useState(() => getStoredUser());
  const [loaners, setLoaners] = useState([]);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const authed = !!user?._id;

  async function refresh(){
    if(!user?._id) return;
    const data = await getLoanersByUserId(user._id);
    setLoaners(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if(!authed) return;
    refresh().catch((e) => setToast({ title:"Sync failed", message: e?.message || "Could not load loaners." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, user?._id]);

  const onLogout = () => {
    clearUser();
    setUser(null);
    setLoaners([]);
    navigate("/login");
  };

  const right = useMemo(() => null, []);

  // Protect routes
  const guard = (el) => authed ? el : <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return (
    <>
      <Topbar user={user} onLogout={onLogout} right={right} />
      <div className="container">
        <Routes>
          <Route path="/login" element={
            <Login
              onAuthed={(u) => {
                const safe = storeUser(u);
                setUser(safe);
                navigate("/");
              }}
              onToast={setToast}
            />
          } />
          <Route path="/" element={guard(<Inventory user={user} loaners={loaners} onRefresh={refresh} onToast={setToast} />)} />
          <Route path="/add" element={guard(<AddLoaner user={user} onAdded={() => { setToast({title:"Saved", message:"Instrument added."}); refresh(); navigate("/"); }} onToast={setToast} />)} />
          <Route path="/edit/:id" element={guard(<EditLoaner user={user} loaners={loaners} onSaved={() => { setToast({title:"Saved", message:"Instrument updated."}); refresh(); navigate("/"); }} onDeleted={() => { setToast({title:"Deleted", message:"Instrument removed."}); refresh(); navigate("/"); }} onToast={setToast} />)} />
          <Route path="/export" element={guard(<ExportQr user={user} loaners={loaners} onToast={setToast} />)} />
          <Route path="*" element={<Navigate to={authed ? "/" : "/login"} replace />} />
        </Routes>
      </div>

      <Toast title={toast?.title} message={toast?.message} onClose={() => setToast(null)} />
    </>
  );
}
