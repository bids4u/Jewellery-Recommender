// src/api/api.js
const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function uploadFiles(files, clientName = "", notes = "") {
  const form = new FormData();
  files.forEach((f) => form.append("files", f)); // f is File
  form.append("client_name", clientName);
  form.append("notes", notes);

  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // { upload_id, message }
}

export async function recommend(uploadId, refineText = "") {
  const form = new FormData();
  form.append("refine_text", refineText);
  const res = await fetch(`${BASE}/recommend/${uploadId}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Recommend failed");
  return res.json(); // { recommendations: [...], message }
}

export async function selectProduct(productId) {
  const res = await fetch(`${BASE}/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  });
  if (!res.ok) throw new Error("Select failed");
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${BASE}/cart`);
  if (!res.ok) throw new Error("Get cart failed");
  return res.json();
}
