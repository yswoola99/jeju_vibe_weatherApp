const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

export default async function geminiChatHandler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST 요청만 지원합니다." });
  }

  const { message, history = [], systemInstruction } = req.body ?? {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message가 필요합니다." });
  }
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "서버에 GEMINI_API_KEY가 설정되어 있지 않습니다." });
  }

  try {
    const body = {
      contents: [...history, { role: "user", parts: [{ text: message }] }],
      ...(systemInstruction
        ? { systemInstruction: { parts: [{ text: systemInstruction }] } }
        : {}),
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(body),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`[gemini] API 오류 (${geminiRes.status}):`, errText);
      return res.status(502).json({ error: "Gemini 응답을 가져오지 못했습니다." });
    }

    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("[gemini] 요청 실패:", err);
    res.status(502).json({ error: "Gemini 응답을 가져오지 못했습니다." });
  }
}
