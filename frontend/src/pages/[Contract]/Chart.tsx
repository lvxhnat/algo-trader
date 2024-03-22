import * as React from 'react';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { Button, Skeleton } from "@mui/material";
import { OHLCVData } from 'components/Chart/Chart/type';
import { getHistoricalData } from './requests';
import OHLCChart from 'components/Chart/OHLCChart';

interface ChartProps {
    conId: string
}

export default function Chart(props: ChartProps) {
    const [isLine, setIsLine] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [historicalData, setHistoricalData] = React.useState<OHLCVData[]>([]);

    React.useEffect(() => {
        setLoading(true)
        getHistoricalData(props.conId!, {}).then((res) => {
          setLoading(false)
          setHistoricalData(res.data)
      });
      }, []);

  return (
    <div>
        {loading ? <Skeleton height="500px" width="100%"/> :
        <React.Fragment>
          <div style={{ display: "flex", justifyContent: "flex-end", width: '100%', padding: 0 }}>
            <Button disableFocusRipple onClick={() => setIsLine(!isLine)} style={{ padding: 0 }}>
            {isLine ? <CandlestickChartIcon fontSize="small" /> : <StackedLineChartIcon fontSize="small"/>}
            </Button>
        </div>
        <OHLCChart data={historicalData} isLine={isLine} />
        </React.Fragment>}
    </div>
  )
}
