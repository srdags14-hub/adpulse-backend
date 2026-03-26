export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "AdPulse API online" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Analiza esta creatividad para redes sociales. Devuelve JSON con score_global, fortalezas, riesgos y mejoras_priorizadas."
              },
              {
                type: "input_image",
                image_url: `data:image/png;base64,${imageBase64}`
              }
            ]
          }
        ]
      })
    });

    const data = await openaiResponse.json();

    return res.status(openaiResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Error en análisis",
      details: error.message
    });
  }
}
