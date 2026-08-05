import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { celsiusToFahrenheit, formatHour } from "@/lib/format";
import type { HourlyForecastEntry, TemperatureUnit } from "@/types/weather";

interface HourlyTemperatureChartProps {
  hours: HourlyForecastEntry[];
  unit: TemperatureUnit;
}

const LINE_COLOR = "#2a78d6";
const WIDTH = 600;
const HEIGHT = 160;
const PADDING = { top: 28, right: 12, bottom: 24, left: 12 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;
const LABEL_STEP = 3;

export function HourlyTemperatureChart({ hours, unit }: HourlyTemperatureChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const chart = useMemo(() => {
    const temps = hours.map((h) => (unit === "F" ? celsiusToFahrenheit(h.temperature) : h.temperature));
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = Math.max(max - min, 1);

    const xFor = (i: number) => PADDING.left + (i / Math.max(temps.length - 1, 1)) * PLOT_WIDTH;
    const yFor = (t: number) => PADDING.top + PLOT_HEIGHT - ((t - min) / range) * PLOT_HEIGHT;

    const points = temps.map((t, i) => ({ x: xFor(i), y: yFor(t), temp: t }));
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const baselineY = PADDING.top + PLOT_HEIGHT;
    const areaPath =
      `${linePath} L ${points[points.length - 1].x} ${baselineY} ` + `L ${points[0].x} ${baselineY} Z`;

    const maxIndex = temps.indexOf(max);
    const minIndex = temps.indexOf(min);

    return { points, linePath, areaPath, maxIndex, minIndex };
  }, [hours, unit]);

  const handlePointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || hours.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const index = Math.round(ratio * (hours.length - 1));
    setHoverIndex(index);
  };

  if (hours.length === 0) return null;

  const hovered = hoverIndex !== null ? chart.points[hoverIndex] : null;
  const tooltipLeftPct = hovered ? (hovered.x / WIDTH) * 100 : 0;
  const tooltipClamped = Math.min(Math.max(tooltipLeftPct, 8), 92);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-32 w-full touch-none sm:h-36"
        role="img"
        aria-label={`향후 ${hours.length}시간 기온 변화 그래프`}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <path d={chart.areaPath} fill={LINE_COLOR} fillOpacity={0.1} stroke="none" />
        <path d={chart.linePath} fill="none" stroke={LINE_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Direct labels on the extremes */}
        <text
          x={chart.points[chart.maxIndex].x}
          y={chart.points[chart.maxIndex].y - 10}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-medium"
        >
          {Math.round(chart.points[chart.maxIndex].temp)}°
        </text>
        <text
          x={chart.points[chart.minIndex].x}
          y={chart.points[chart.minIndex].y - 10}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-medium"
        >
          {Math.round(chart.points[chart.minIndex].temp)}°
        </text>

        {/* Hour labels */}
        {hours.map((h, i) =>
          i % LABEL_STEP === 0 ? (
            <text
              key={h.time}
              x={chart.points[i].x}
              y={HEIGHT - 6}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {formatHour(h.time)}
            </text>
          ) : null,
        )}

        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PADDING.top}
              y2={PADDING.top + PLOT_HEIGHT}
              stroke="currentColor"
              className="text-muted-foreground/30"
              strokeWidth={1}
            />
            <circle cx={hovered.x} cy={hovered.y} r={5} fill={LINE_COLOR} stroke="white" strokeWidth={2} />
          </>
        )}
      </svg>

      {hovered && hoverIndex !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background shadow-md"
          style={{ left: `${tooltipClamped}%` }}
        >
          {formatHour(hours[hoverIndex].time)} · {Math.round(hovered.temp)}°{unit}
        </div>
      )}
    </div>
  );
}
