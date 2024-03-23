import React, { useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { ChartCanvasContext } from "../ChartCanvas";
import { ChartSettingsContent, useChartStore } from "../store";
import { ColorsEnum } from "common/theme";
import { useThemeStore } from "store/theme";
import { OHLCVData } from "../type";

interface LineSeriesProps {}

export default function LineSeries(props: LineSeriesProps) {
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

    svg.selectAll("path").remove();

    const line = d3
      .line<OHLCVData>()
      .x(function (_, i) {
        return xScale(data[i].date)!;
      })
      .y(function (_, i) {
        return yScale(data[i].close);
      })
      .defined((_, i) => !!data[i]);

    svg
      .append("path")
      .attr("fill", "none")
      .attr(
        "stroke",
        theme.mode === "dark" ? ColorsEnum.white : ColorsEnum.black
      )
      .attr("stroke-width", 1)
      .attr("d", line(data));
  }, [data, xScale, yScale, theme.mode]);

  return <g className="LineSeries" ref={ref} />;
}
