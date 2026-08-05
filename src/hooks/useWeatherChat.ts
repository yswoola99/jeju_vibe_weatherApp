import { useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

const GREETING_ID = "greeting";

interface GeminiHistoryPart {
  role: "user" | "model";
  parts: { text: string }[];
}

function toHistory(messages: ChatMessage[]): GeminiHistoryPart[] {
  return messages
    .filter((m) => m.id !== GREETING_ID)
    .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
}

export function useWeatherChat(systemInstruction: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: GREETING_ID,
      role: "model",
      text: "안녕하세요! 현재 날씨나 예보에 대해 무엇이든 물어보세요. 🌤️",
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const history = toHistory(messages);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: trimmed }]);
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history, systemInstruction }),
      });

      let data: { reply?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("챗봇 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      }

      if (!res.ok) throw new Error(data.error ?? "챗봇 응답에 실패했습니다.");

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "model", text: data.reply || "응답을 생성하지 못했어요." },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "챗봇 응답에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return { messages, sendMessage, isSending, error };
}
