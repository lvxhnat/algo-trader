import * as React from 'react';
import * as d3 from 'd3';
import { ChartContext } from '../Chart';

const YAxis: React.FC = () => {

    const { yScale, margin } = React.useContext(ChartContext)!;

    // Ref for the group element
    const ref = React.useRef<SVGGElement>(null);

    React.useEffect(() => {
        if (!ref.current || !yScale) return;
        const yAxis = d3.axisLeft(yScale);
        d3.select(ref.current).call(yAxis);
    }, [yScale]);

    return <g ref={ref} className="yAxis" transform={`translate(${margin.left + margin.right},0)`} />;
};

export default YAxis;
