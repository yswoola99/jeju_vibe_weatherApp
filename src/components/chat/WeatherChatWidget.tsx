import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Bot, Loader2, MessageCircle, Send, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { useWeatherChat } from "@/hooks/useWeatherChat";
import { buildWeatherSystemPrompt } from "@/lib/weatherChatContext";
import { cn } from "@/lib/utils";
import type { AirQualityData, ForecastData, Location } from "@/types/weather";

interface WeatherChatWidgetProps {
  location: Location;
  forecast?: ForecastData;
  airQuality?: AirQualityData;
}

export function WeatherChatWidget({ location, forecast, airQuality }: WeatherChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemInstruction = useMemo(
    () => buildWeatherSystemPrompt({ location, forecast, airQuality }),
    [location, forecast, airQuality],
  );
  const { messages, sendMessage, isSending, error } = useWeatherChat(systemInstruction);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending, open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    const text = input;
    setInput("");
    void sendMessage(text);
  };

  return (
    <>
      {open && (
        <Card className="fixed inset-x-4 bottom-24 z-50 flex h-[min(32rem,70vh)] flex-col gap-0 py-0 shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[23rem]">
          <CardHeader className="flex-row items-center justify-between border-b border-border/60 py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="size-4 text-primary" />
              날씨 챗봇
            </CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              aria-label="챗봇 닫기"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex items-end gap-2", m.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {m.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                    m.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 pl-8 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                답변 작성 중...
              </div>
            )}

            {error && <p className="pl-8 text-xs text-destructive">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border/60 p-2">
            <InputGroup>
              <InputGroupInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="날씨에 대해 물어보세요"
                disabled={isSending}
                autoFocus
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  size="icon-sm"
                  disabled={isSending || !input.trim()}
                  aria-label="전송"
                >
                  <Send className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </Card>
      )}

      <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" aria-hidden="true" />
        )}
        <Button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "챗봇 닫기" : "날씨 챗봇 열기"}
          className="relative size-14 rounded-full p-0 shadow-2xl sm:size-16"
        >
          {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </Button>
      </div>
    </>
  );
}
