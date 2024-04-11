import { TimeRange } from '../../../core/types/TimeRange';

export interface PortfolioParams {
  addresses: string;
  timerange?: TimeRange;
  chain_id?: number;
}
