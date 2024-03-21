import * as React from 'react'
import { ChartContext } from './ChartCanvas';

interface ChartProps {
    children: React.ReactNode;
  }
  
const Chart: React.FC<ChartProps> = (props) => {

    const { width, height, margin } = React.useContext(ChartContext)!;
    const viewBoxWidth = width + margin.left + margin.right
    const viewBoxHeight = height + margin.top + margin.bottom
    
    return (
        <svg 
            width="100%" // Make SVG responsive by setting width to 100%
            height="100%" // Make SVG responsive by setting height to 100%
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
            preserveAspectRatio="xMidYMid meet"
            className="svg-content-responsive" // Assuming you have defined styles for this class
            style={{ strokeWidth: 0 }} // Inline style for stroke-width
        >
            {props.children}
        </svg>  
  )
}

export default Chart