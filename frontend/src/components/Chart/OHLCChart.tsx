import * as React from 'react'
import { Chart, ChartCanvas } from './Chart'
import { OHLCVData } from './Chart/type'
import YAxis from './Axis/YAxis'
import XAxis from './Axis/XAxis'
import CandleStickSeries from './Chart/CandleStickSeries'

interface OHLCChartProps {
    data: OHLCVData[]
}

export default function OHLCChart(props: OHLCChartProps) {

    const getExtentY = (arr: OHLCVData[]): [number, number] | undefined => {
        if (arr.length === 0) return undefined;
      
        let min = arr[0].low
        let max = arr[0].high

        for (let i = 1; i < arr.length; i++) {
          if (arr[i].low < min) min = arr[i].low;
          if (arr[i].high > max) max = arr[i].high;
        }
    
        const highest = max + (max - min) * 0.1;
        const minBoundary = (max - min) * 0.3;
        let startY = min - minBoundary;
        if (min > 0) min = Math.max(0, startY);
        const lowest = minBoundary > 3 ? 0 : startY;
        
        return [lowest, highest]
    }

    const getExtentX = (arr: OHLCVData[]): string[] | undefined => arr.map((value) => value.date);

  return (
    <ChartCanvas 
        width={1200} 
        height={500} 
        margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
        data={props.data}
        yExtent={getExtentY(props.data)!}
        xExtent={getExtentX(props.data)!}
    >
        <Chart>
            <YAxis />
            <XAxis />
            <CandleStickSeries/>
        </Chart>
    </ChartCanvas>
  )
}
