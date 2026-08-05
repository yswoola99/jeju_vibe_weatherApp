import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT ?? 8787;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

if (!GEMINI_API_KEY) {
  console.warn("[server] GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.");
}

const app = express();
app.use(express.json());

app.post("/api/gemini/chat", async (req, res) => {
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
      console.error(`[server] Gemini API 오류 (${geminiRes.status}):`, errText);
      return res.status(502).json({ error: "Gemini 응답을 가져오지 못했습니다." });
    }

    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    res.json({ reply });
  } catch (err) {
    console.error("[server] Gemini 요청 실패:", err);
    res.status(502).json({ error: "Gemini 응답을 가져오지 못했습니다." });
  }
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.listen(PORT, () => {
  console.log(`[server] API server listening on http://localhost:${PORT}`);
});
