import * as d3 from "d3";
import * as React from 'react';
import { OHLCVData } from "./type";

export const ChartContext = React.createContext<ChartContextProps | null>(null);

interface ChartCanvasProps {
  children: React.ReactNode;
  width: number,
  height: number,
  margin: { left: number, right: number, top: number, bottom: number },
  data: OHLCVData[],
  xExtent: string[],
  yExtent: [number, number],
}

interface ChartContextProps {
  width: number,
  height: number,
  margin: { left: number, right: number, top: number, bottom: number },
  data: OHLCVData[],
  xScale: d3.ScaleBand<string>;
  yScale: d3.ScaleLinear<number, number, never>;
}

const ChartCanvas: React.FC<ChartCanvasProps> = (props) => {

  const { children, ...contextProps } = props;

  if (!props.yExtent || !props.xExtent) return <></>

  const xScale = d3.scaleBand().range([0, props.width]).domain(props.xExtent).padding(0.2);
  const yScale = d3.scaleLinear().range([props.height, 0]).domain(props.yExtent)
  return ( 
    <ChartContext.Provider value={{...contextProps, xScale: xScale, yScale: yScale}}>
        {children}
    </ChartContext.Provider>
  );
};

export default ChartCanvas;
