const KEY = "horntrax:user";

export function getStoredUser(){
  try{
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }catch{
    return null;
  }
}

export function storeUser(user){
  // Never store password in localStorage.
  const safe = user ? { ...user } : null;
  if (safe && "password" in safe) delete safe.password;
  localStorage.setItem(KEY, JSON.stringify(safe));
  return safe;
}

export function clearUser(){
  localStorage.removeItem(KEY);
}
