export interface OHLCVData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartCanvasProps {
  children: React.ReactNode;
  chartId: string;
  width: number;
  height: number;
  margin: { left: number; right: number; top: number; bottom: number };
  data: OHLCVData[];
  xExtent: string[];
  yExtent: [number, number];
}
