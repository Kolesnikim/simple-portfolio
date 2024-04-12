export interface Chain {
  chain_id: number | null;
  abs_profit_usd: number;
  roi: number;
}

export interface Address {
  address: string;
  abs_profit_usd: number;
  roi: number;
}

export interface TotalProfitsAndLosses {
  chains: Chain[];
  addresses: Address[];
}
