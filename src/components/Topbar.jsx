import React from "react";

export default function Topbar({ user, onLogout, right }){
  return (
    <div className="topbar">
      <div className="brand">
        <img src="favicon.svg" alt="" width="28" height="28" style={{borderRadius:8}} />
        <div>
          <div>HornTrax</div>
          <div className="badge">{user ? `Signed in as ${user.username}` : "Loaner inventory"}</div>
        </div>
      </div>
      <div className="row">
        {right}
        {user && <button className="btn" onClick={onLogout}>Log out</button>}
      </div>
    </div>
  );
}
