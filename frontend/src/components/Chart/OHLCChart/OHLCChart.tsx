import * as d3 from "d3";
import * as React from "react";

import { useD3 } from "common/hooks/useD3";

// OHLC chart component props
export interface OHLCData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface OHLCChartProps {
  data: OHLCData[];
  width?: number;
  height?: number;
}
// OHLC Chart Component
const OHLCChart: React.FC<OHLCChartProps> = ({
  data,
  width = 800,
  height = 300,
}) => {
  const ref = useD3(
    (svg) => {
      if (!svg) return;
      // Clear the SVG to prevent duplication
      svg.selectAll("*").remove();
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };

      svg
        .attr("viewBox", `0 0 ${width + 10} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .classed("svg-content-responsive", true);

      // Scales
      data = data.map((d) => {
        return { ...d, date: new Date(d.date) };
      });
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.date.toISOString()))
        .range([margin.left, width - margin.right]) // Adjust for margins
        .padding(1)
        
        const y = d3
        .scaleLinear()
        .domain([
          Math.min(...data.map((d) => d.low)),
          Math.max(...data.map((d) => d.high)),
        ])
        .range([height - margin.bottom, margin.top]); // Invert range for y
        
        const yAxis = d3.axisLeft(y).ticks(10);
        const xAxis = d3.axisBottom(x).ticks(10).tickSize(height);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .call((g: any) => g.select(".domain").remove());

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .call((g: any) => g.select(".domain").remove()); // Remove the vertical line

      svg
        .append("g")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .selectAll("path")
        .data(data)
        .join("path")
        .attr(
          "d",
          (d: OHLCData) => `
                            M${x(d.date.toISOString())},${y(d.low)}V${y(d.high)}
                            M${x(d.date.toISOString())},${y(d.open)}h-4
                            M${x(d.date.toISOString())},${y(d.close)}h4
                            `
        )
        .attr("stroke", (d: OHLCData) =>
          d.open > d.close
            ? d3.schemeSet1[0]
            : d.close > d.open
            ? d3.schemeSet1[2]
            : d3.schemeSet1[8]
        )
        .append("title")
    },
    [data, width, height]
  );

  return <svg ref={ref} style={{ width: "100%", height: "100%" }} />;
};

export default OHLCChart;
