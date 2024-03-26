import React, { useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { ChartCanvasContext } from "../ChartCanvas";
import { ChartSettingsContent, useChartStore } from "../store";
import { ColorsEnum } from "common/theme";
import { useThemeStore } from "store/theme";

interface HorizontalLineSeriesProps {
  d1: { date: string; value: number };
  d2: { date: string; value: number };
  color: string;
  text?: string;
}

export default function HorizontalLineSeries(props: HorizontalLineSeriesProps) {
  const theme = useThemeStore();
  const ref = useRef<SVGGElement>(null);
  const { chartId } = useContext(ChartCanvasContext)!;
  const { data, xScale, yScale } = useChartStore(
    (state) =>
      state.chartSettings[
        chartId as keyof typeof state.chartSettings
      ] as ChartSettingsContent
  );

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(ref.current);

    const d1X = xScale(props.d1.date)!;
    const d2X = xScale(props.d2.date)!;
    const d1Y = yScale(props.d1.value);
    const d2Y = yScale(props.d2.value);
    svg
      .append("line")
      .attr("x1", d1X)
      .attr("y1", d1Y)
      .attr("x2", d2X)
      .attr("y2", d2Y)
      .attr("fill", "none")
      .attr("stroke", props.color)
      .attr("stroke-width", 1);

    if (props.text)
      svg
        .append("text")
        .attr("x", (d1X + d2X) / 10) // Center the text horizontally based on the line's start and end points
        .attr("y", d1Y + 15) // Position the text 20 pixels below the line
        .attr("text-anchor", "middle") // Center the text horizontally around the x position
        .attr("fill", props.color)
        .attr("font-size", `calc(0.4rem + 0.3vw)`)
        .attr("font-weight", "bold")
        .text(props.text);
  }, [data, xScale, yScale, theme.mode]);

  return <g className="HorizontalLineSeries" ref={ref} />;
}
