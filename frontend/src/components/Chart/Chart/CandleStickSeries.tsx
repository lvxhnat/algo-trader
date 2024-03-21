import * as React from 'react'
import * as d3 from 'd3';
import { ChartContext } from './ChartCanvas';
import { OHLCVData } from './type';

export default function CandleStickSeries() {
  const ref = React.useRef<SVGGElement>(null);
  const { data, xScale, yScale } = React.useContext(ChartContext)!;

  const candleStickWidth = 5

  React.useEffect(() => {
    if (!data) return;

    const svg = d3.select(ref.current);

    const candle = svg.selectAll(".CandleStickSeries")
                      .data(data)
                      .enter()

    candle.append("rect")
          .attr("x", (d: OHLCVData) => xScale(d.date) as number)
          .attr("y", d => yScale(Math.max(d.open, d.close)))
          .attr("width", candleStickWidth)
          .attr("height", d => Math.max(1, Math.abs(yScale(d.open) - yScale(d.close))))
          .attr("fill", d => d.open > d.close ? "red" : "green");

    candle.append("line")
          .attr("x1", (d) => xScale(d.date) as number + candleStickWidth / 2)
          .attr("x2", (d) => xScale(d.date) as number + candleStickWidth / 2)
          .attr("y1", d => yScale(d.high))
          .attr("y2", d => yScale(d.low))
          .attr("stroke", d => d.open > d.close ? "red" : "green");

  }, [data, xScale, yScale]); // Re-run the effect if data or scales change

  return <g className="CandleStickSeries" ref={ref} />;
};