import * as React from "react";
import moment from "moment";
import { ChartCanvasContext } from "../Chart/ChartCanvas";
import { ChartSettingsContent, useChartStore } from "../Chart/store";
import { OHLCVData } from "../Chart/type";
import { ColorsEnum } from "common/theme";

const PriceTooltip = () => {
  const [values, setValues] = React.useState<OHLCVData>();
  const { chartId } = React.useContext(ChartCanvasContext)!;
  const { margin, xScale, data } = useChartStore(
    (state) =>
      state.chartSettings[
        chartId as keyof typeof state.chartSettings
      ] as ChartSettingsContent
  );
  const mousePosition = useChartStore(
    (state) => state.chartMouseEvents.mousePosition
  );

  React.useEffect(() => {
    if (mousePosition) {
      const indexDec = (mousePosition[0] - margin.left ) / xScale.step() // Decimalised
        const index = Math.floor(indexDec) - 1
        if (data[index]) setValues(data[index])
    }
  }, [mousePosition])

  return (
    <div style={{ gap: 10, fontSize: 10, paddingTop: 15, paddingLeft: margin.left, height: 10 }}>
        {
          values ? 
            <React.Fragment>
              <span style={{ color: ColorsEnum.machoBlue }}> Date: </span> <span>{moment(new Date(values.date)).format("DD MMM YY HH:mm")}</span>
              <span style={{ color: ColorsEnum.machoBlue }}> O: </span> <span> {values.open} </span>
              <span style={{ color: ColorsEnum.machoBlue }}> H: </span> <span>{values.high}</span>
              <span style={{ color: ColorsEnum.machoBlue }}> L: </span> <span>{values.low}</span>
              <span style={{ color: ColorsEnum.machoBlue }}> C: </span> <span>{values.close}</span>
            </React.Fragment>
           : null 
        }
    </div>
  );
};

export default PriceTooltip;
