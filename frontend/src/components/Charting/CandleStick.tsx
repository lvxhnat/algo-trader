import * as d3 from "d3";
import * as React from "react";
import { useD3 } from "common/hooks/useD3";
import { ColorsEnum } from "common/theme";
import { OHLCData } from "components/Chart/OHLCChart/OHLCChart";

interface BaseChartProps {
  data: OHLCData[];
}

export default function BaseChart(props: BaseChartProps) {
  const ref = useD3((svg: d3.Selection<SVGElement, {}, HTMLElement, any>) => {
    // Ensure rerender does not duplicate chart
    if (!svg.selectAll("*").empty()) svg.selectAll("*").remove(); // removes any overlapping versions of the svgs

    const width = 1200;
    const height = 500;

    svg
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("svg-content-responsive", true)
      .attr("stroke-width", 0);

    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;
  }, []);

  return <svg ref={ref} style={{ height: "100%", width: "100%" }} />;
}
