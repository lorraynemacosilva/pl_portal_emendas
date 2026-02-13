const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API error ${res.status}: ${txt}`);
  }
  return res.json();
}

export function fetchResumo() {
  return apiGet("/resumo");
}

export function fetchParlamentares(nivel, ano) {
  const qs = new URLSearchParams({ nivel, ano: String(ano) }).toString();
  return apiGet(`/parlamentares?${qs}`);
}

export function fetchParlamentarDetail(id, ano) {
  const qs = new URLSearchParams({ ano: String(ano) }).toString();
  return apiGet(`/parlamentares/${id}?${qs}`);
}

export function fetchEmendasByParlamentar(id, ano) {
  const qs = new URLSearchParams({ ano: String(ano) }).toString();
  return apiGet(`/parlamentares/${id}/emendas?${qs}`);
}