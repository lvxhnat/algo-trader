import * as React from "react";
import * as d3 from "d3";
import { throttle } from "lodash";
import { ChartSettingsContent, useChartStore } from "./store";
import { ChartCanvasContext } from "./ChartCanvas";

interface ChartProps {
  children: React.ReactNode;
}

const Chart: React.FC<ChartProps> = (props) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const { chartId } = React.useContext(ChartCanvasContext)!;
  const { width, height, margin } = useChartStore(
    (state) =>
      state.chartSettings[
        chartId as keyof typeof state.chartSettings
      ] as ChartSettingsContent
  );
  const setChartMouseEvents = useChartStore(
    (state) => state.setChartMouseEvents
  );

  const handleMouseMove = React.useCallback(
    throttle((event: MouseEvent) => {
      if (!svgRef.current) return;
      const [x, y] = d3.pointer(event);
      setChartMouseEvents({ mousePosition: [x, y] });
    }, 10),
    []
  );

  return (
    <svg
      id={chartId}
      ref={svgRef}
      width="100%" // Make SVG responsive by setting width to 100%
      height="100%" // Make SVG responsive by setting height to 100%
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="svg-content-responsive"
    >
      <rect
        x={margin.left}
        y={margin.top}
        width={width - margin.left - margin.right}
        height={height - margin.top - margin.bottom}
        fill="transparent"
        onMouseMove={handleMouseMove as any}
      />
      {props.children}
    </svg>
  );
};

export default Chart;
