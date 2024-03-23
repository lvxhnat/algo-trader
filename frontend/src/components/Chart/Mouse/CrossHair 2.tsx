import * as React from "react";
import { ChartCanvasContext } from "../Chart/ChartCanvas";
import { ChartSettingsContent, useChartStore } from "../Chart/store";

const CrossHairCursor = ({
  stroke = "#000000",
  opacity = 0.3,
  strokeDasharray = "5 3",
}) => {
  const { chartId } = React.useContext(ChartCanvasContext)!;
  const { width, height, margin } = useChartStore(
    (state) =>
      state.chartSettings[
        chartId as keyof typeof state.chartSettings
      ] as ChartSettingsContent
  );
  const mousePosition = useChartStore(
    (state) => state.chartMouseEvents.mousePosition
  );

  return (
    <g className="react-stockcharts-crosshair">
      {mousePosition ? (
        <React.Fragment>
          <line
            stroke={stroke}
            strokeOpacity={opacity}
            strokeDasharray={strokeDasharray}
            x1={margin.left}
            y1={mousePosition[1]}
            x2={width}
            y2={mousePosition[1]}
          />
          <line
            stroke={stroke}
            strokeOpacity={opacity}
            strokeDasharray={strokeDasharray}
            x1={mousePosition[0]}
            y1={margin.top}
            x2={mousePosition[0]}
            y2={height - margin.bottom}
          />
        </React.Fragment>
      ) : null}
    </g>
  );
};

export default CrossHairCursor;
