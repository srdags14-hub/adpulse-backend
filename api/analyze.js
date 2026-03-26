export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "AdPulse API online with OpenRouter" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://adpulse-backend.vercel.app",
        "X-Title": "AdPulse"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-11b-vision-instruct:free",
        provider: {
          sort: "throughput"
        },
        messages: [
          {
            role: "system",
            content: "Eres un analista de creatividades para redes sociales. Responde siempre en JSON valido."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Analiza esta creatividad para redes sociales y devuelve SOLO JSON con esta estructura exacta: " +
                  "{\"score_global\": number, \"fortalezas\": string[], \"riesgos\": string[], \"mejoras_priorizadas\": string[], \"attention_order\": string[] }"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    const data = await openrouterResponse.json();
    return res.status(openrouterResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Error en análisis",
      details: error.message
    });
  }
}
