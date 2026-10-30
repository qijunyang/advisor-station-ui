export type SecurityType = 'stock' | 'etf' | 'bond';

export interface Security {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly type: SecurityType;
  readonly exchange: string;
}
