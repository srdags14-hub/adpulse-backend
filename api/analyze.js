export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `
Analiza esta creatividad para redes sociales.

Devuelve:
- score_global (0-100)
- 3 fortalezas
- 3 mejoras
- attention_order
`
              },
              {
                type: "input_image",
                image_base64: imageBase64
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Error en análisis",
      details: error.message
    });
  }
}
