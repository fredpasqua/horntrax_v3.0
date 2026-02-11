import React, { useState } from "react";
import Field from "../components/Field.jsx";
import { login, registerUser } from "../lib/api.js";

export default function Login({ onAuthed, onToast }){
  const [mode, setMode] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  async function submit(){
    setErrors({});
    const u = username.trim();
    const p = password;

    const next = {};
    if(!u) next.username = "Required";
    if(!p) next.password = "Required";
    if(mode === "register"){
      if(!email.trim()) next.email = "Required";
    }
    if(Object.keys(next).length){
      setErrors(next);
      return;
    }

    try{
      setBusy(true);
      if(mode === "register"){
        await registerUser({ username: u, email, password: p });
      }
      const user = await login(u, p);
      onAuthed?.(user);
    }catch(e){
      const msg = (typeof e?.response?.data === "string" ? e.response.data : null) || e?.message || "Login failed.";
      onToast?.({ title: "Auth error", message: msg });
    }finally{
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{padding:16}}>
      <div className="spread">
        <div>
          <div style={{fontWeight:900, fontSize:22}}>{mode === "login" ? "Sign in" : "Create account"}</div>
          <div style={{color:"var(--muted)", marginTop:6}}>Works great as a link on GitHub Pages — installable as a PWA.</div>
        </div>
        <button className="btn" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Create account" : "Back to login"}
        </button>
      </div>

      <hr className="sep" />

      <div className="grid cols2">
        <Field label="Username" error={errors.username}>
          <input className="input" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="fredp" autoCapitalize="none" />
        </Field>

        {mode === "register" ? (
          <Field label="Email" error={errors.email}>
            <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="fredp@nemc.com" autoCapitalize="none" />
          </Field>
        ) : (
          <div />
        )}

        <Field label="Password" error={errors.password}>
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
      </div>

      <div className="row" style={{marginTop:14, justifyContent:"flex-end"}}>
        <button className="btn primary" onClick={submit} disabled={busy}>
          {busy ? "Working..." : (mode === "login" ? "Sign in" : "Create & sign in")}
        </button>
      </div>

      <div style={{marginTop:10, color:"var(--muted)", fontSize:12}}>
        Tip: Passwords are not stored in the browser. (Your backend currently stores them in MongoDB as plaintext.)
      </div>
    </div>
  );
}
