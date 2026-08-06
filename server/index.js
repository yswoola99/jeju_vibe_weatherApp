import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import geminiChatHandler from "./geminiChatHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT ?? 8787;

if (!process.env.GEMINI_API_KEY) {
  console.warn("[server] GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.");
}

const app = express();
app.use(express.json());

app.post("/api/gemini/chat", geminiChatHandler);

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.listen(PORT, () => {
  console.log(`[server] API server listening on http://localhost:${PORT}`);
});
