export enum TimeRanges {
  '1day' = '1day',
  '1week' = '1week',
  '1month' = '1month',
  '1year' = '1year',
  '3years' = '3years',
}

export type TimeRange = keyof typeof TimeRanges;
