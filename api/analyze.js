export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true, method: "OPTIONS", version: "test-v1" });
  }

  if (req.method === "GET") {
    return res.status(200).json({ ok: true, method: "GET", version: "test-v1" });
  }

  if (req.method === "POST") {
    return res.status(200).json({ ok: true, method: "POST", version: "test-v1" });
  }

  return res.status(405).json({ error: "Method not allowed", version: "test-v1" });
}
