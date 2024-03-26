import * as React from "react";
import * as d3 from "d3";
import { ChartCanvasContext } from "../Chart/ChartCanvas";
import { ChartSettingsContent, useChartStore } from "../Chart/store";
import { ColorsEnum } from "common/theme";
import { useTheme } from "@emotion/react";
import { useThemeStore } from "store/theme";

const YAxis: React.FC = () => {
  const { chartId } = React.useContext(ChartCanvasContext)!;
  const theme = useThemeStore();
  const { width, yScale, margin } = useChartStore(
    (state) =>
      state.chartSettings[
        chartId as keyof typeof state.chartSettings
      ] as ChartSettingsContent
  );

  // Ref for the group element
  const ref = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    if (!ref.current || !yScale) return;
    const numTicks = 10;
    const yAxis = d3.axisLeft(yScale).ticks(numTicks);

    d3.select(ref.current)
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
      .classed("y", true)
      .classed("grid", true);

    d3.select(ref.current)
      .selectAll("line.horizontalGrid")
      .data(yScale.ticks(numTicks))
      .enter()
      .append("line")
      .attr("class", "horizontalGrid")
      .attr("x1", margin.right)
      .attr("x2", width)
      .attr("y1", function (d) {
        return yScale(d);
      })
      .attr("y2", function (d) {
        return yScale(d);
      })
      .attr("fill", "none")
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", ColorsEnum.warmgray4)
      .attr("stroke-width", "0.2px");
  }, [yScale, theme.mode]);

  return (
    <g ref={ref} className="yAxis" transform={`translate(${margin.left},0)`} />
  );
};

export default YAxis;
