import * as React from 'react';
import * as d3 from 'd3';
import { ChartContext } from '../Chart';

const XAxis: React.FC = () => {

    const { xScale, margin, height } = React.useContext(ChartContext)!;

    const ref = React.useRef<SVGGElement>(null);
    React.useEffect(() => {
        if (!ref.current || !xScale) return;
        const xAxis = d3.axisBottom(xScale).ticks(10);
        d3.select(ref.current).call(xAxis);
    }, [xScale]);

    return <g ref={ref} className="xAxis" transform={`translate(0,${height})`} />;
};

export default XAxis;
