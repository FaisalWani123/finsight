export type FinanceRow = {
  label: string;
  amount: number;
};

export type FinanceFormData = {
  inflows: FinanceRow[];
  outflows: FinanceRow[];
  assets: FinanceRow[];
  liabilities: FinanceRow[];
};

export type FinanceInsertRow = {
  userId: string;
  type: number;
  label: string;
  amount: number;
  currency: number;
};

export interface Finances {
  id: string;                // UUID
  userId: string;            // references user.userId
  type: number;              // numeric, references type.type
  label: string;             // text
  amount: number;            // numeric
  createdAt: string;         // timestamp with time zone
  updatedAt?: string | null; // timestamp with time zone, nullable
  currency?: number | null;  // numeric, references currency.currencyId, nullable
}
