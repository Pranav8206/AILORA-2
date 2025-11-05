const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();
  if (!response.ok) {
    const message = isJson && data && data.error ? data.error : response.statusText;
    throw new Error(message || "Request failed");
  }
  return data;
}

export function predict(symptoms, userId = "anonymous") {
  return apiRequest("/predict", {
    method: "POST",
    body: JSON.stringify({ symptoms, user_id: userId }),
  });
}
