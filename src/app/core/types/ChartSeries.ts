import { StringOrNumberOrDate } from '@swimlane/ngx-charts';

export type ChartSeries = AreaChartSeries[];

export interface AreaChartSeries {
  name: StringOrNumberOrDate;
  series?: ChartDataItem[];
}

export interface ChartDataItem {
  name: Date;
  value: number;
}
