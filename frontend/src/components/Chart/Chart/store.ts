import { create } from "zustand";
import { ChartCanvasProps } from "./type";

export interface ChartSettingsContent
  extends Omit<ChartCanvasProps, "children" | "xExtent" | "yExtent"> {
  xScale: d3.ScaleBand<string>;
  yScale: d3.ScaleLinear<number, number, never>;
}
interface ChartSettings {
  [chartId: string]: ChartSettingsContent;
}

interface ChartMouseEvents {
  mousePosition: [number, number] | undefined;
}

interface BaseProps {
  chartId: number;
  data: { [chartId: string]: any };
}

interface ChartSettingsProps extends BaseProps {}
interface ChartMouseEventsProps extends ChartMouseEvents {}

export interface ConnectedStoreTypes {
  chartSettings: ChartSettings | {};
  setChartSettings: (chartSettings: ChartSettingsProps) => void;
  chartMouseEvents: ChartMouseEvents;
  setChartMouseEvents: (chartEvents: ChartMouseEventsProps) => void;
}

export const useChartStore = create<ConnectedStoreTypes>((set) => ({
  chartSettings: {},
  setChartSettings: (chartSettings: ChartSettingsProps) => {
    set((state) => {
      let currentSettings: ChartSettingsContent =
        state.chartSettings[
          chartSettings.chartId as keyof typeof state.chartSettings
        ];
      currentSettings = currentSettings ?? {};
      const newChartSettings = {
        ...state.chartSettings,
        [chartSettings.chartId]: {
          ...currentSettings,
          ...chartSettings.data,
        },
      };
      return {
        chartSettings: newChartSettings,
      };
    });
  },
  chartMouseEvents: { mousePosition: undefined },
  setChartMouseEvents: (chartMouseEvents: ChartMouseEventsProps) => {
    set((state) => {
      return {
        ...state.chartMouseEvents,
        chartMouseEvents,
      };
    });
  },
}));
