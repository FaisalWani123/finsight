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
  id: string;                
  userId: string;            
  type: number;              
  label: string;             
  amount: number;            
  createdAt: string;         
  updatedAt?: string | null; 
  currency: number;  
}

export interface ClassStatisticRepsonse {
  total: number; 
  records: Finances[];
}
