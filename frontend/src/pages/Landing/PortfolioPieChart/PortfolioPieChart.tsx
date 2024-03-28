import * as React from "react";
import * as d3 from "d3";
import { throttle } from "lodash";
import { usePortfolioStore } from "store/portfolio/base";

interface PortfolioPieChartProps {
  size: number;
  margin: { left: number; right: number; top: number; bottom: number };
}

interface DataItem {
  count: number;
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = (props) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const margin = props.margin;
  const activePositions = usePortfolioStore((state) => state.activePositions);

  React.useEffect(() => {
    const dataset1 = [
      { count: 25 },
      { count: 20 },
      { count: 30 },
      { count: 40 },
    ];

    const dataset2 = [
      { count: 25 },
      { count: 20 },
      { count: 30 },
      { count: 40 },
    ];

    const donutWidth = 50;
    const radius1 = props.size / 2;
    const radius2 = radius1 - donutWidth;

    const color1 = d3.scaleOrdinal(d3.schemeCategory10);
    const color2 = d3.scaleOrdinal(d3.schemeCategory10);

    const arcGenerator1 = d3
      .arc()
      .innerRadius(radius1 - donutWidth)
      .outerRadius(radius1);

    const arcGenerator2 = d3
      .arc()
      .innerRadius(radius2 - donutWidth)
      .outerRadius(radius2);

    const pieGenerator = d3
      .pie<DataItem>()
      .value((d) => d.count) // TypeScript now knows `d` is of type `DataItem`
      .sort(null);
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${props.size} ${props.size}`)
      .append("g")
      .attr("transform", `translate(${props.size / 2}, ${props.size / 2})`);

    svg
      .selectAll(".arc1")
      .data(pieGenerator(dataset1))
      .enter()
      .append("path")
      .attr("d", arcGenerator1 as any)
      .attr("fill", (d, i) => color1(i.toString()));

    svg
      .selectAll(".arc2")
      .data(pieGenerator(dataset2))
      .enter()
      .append("path")
      .attr("d", arcGenerator2 as any)
      .attr("fill", (d, i) => color2(i.toString()));
  }, [props.size, props.margin]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
      }}
    >
      <svg
        ref={svgRef}
        width={props.size} // Make SVG responsive by setting width to 100%
        height={props.size} // Make SVG responsive by setting height to 100%
        viewBox={`0 0 ${props.size} ${props.size}`}
        preserveAspectRatio="xMidYMid meet"
        className="svg-content-responsive"
      >
        <rect
          x={margin.left}
          y={margin.top}
          width={props.size - margin.left - margin.right}
          height={props.size - margin.top - margin.bottom}
          fill="transparent"
        />
      </svg>
    </div>
  );
};

export default PortfolioPieChart;
