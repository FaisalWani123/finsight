import { createClient } from "@/lib/supabase/client"; // adjust path as needed

type FinanceRow = {
  label: string;
  amount: number;
};

type FinanceFormData = {
  inflows: FinanceRow[];
  outflows: FinanceRow[];
  assets: FinanceRow[];
  liabilities: FinanceRow[];
};

type FinanceInsertRow = {
  userId: string;
  type: number;
  label: string;
  amount: number;
  currency: number;
};

type BackendResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// Map each section to its corresponding type value
const FINANCE_TYPE_MAP = {
  inflows: 1,
  outflows: 2,
  assets: 3,
  liabilities: 4,
} as const;

function buildSuccess<T>(message: string, data?: T): BackendResponse<T> {
  return { success: true, message, data };
}

function buildError<T>(message: string): BackendResponse<T> {
  return { success: false, message };
}

export async function insertFinancesFromFormFromClient(userId: string, formData: FinanceFormData, currency: number): Promise<BackendResponse<FinanceInsertRow[]>> {
  const supabase = await createClient();
  // Transform nested form data into flat array of rows
  const financesToInsert: FinanceInsertRow[] = [];

  (Object.keys(FINANCE_TYPE_MAP) as Array<keyof typeof FINANCE_TYPE_MAP>).forEach((section) => {
    formData[section].forEach((row) => {
      // Filter out empty rows
      if (row.label.trim() !== "" || row.amount !== 0) {
        financesToInsert.push({
          userId,
          type: FINANCE_TYPE_MAP[section],
          label: row.label,
          amount: row.amount,
          currency: currency
        });
      }
    });
  });

  // Check if there's anything to insert
  if (financesToInsert.length === 0 || !financesToInsert) {
    return buildError<FinanceInsertRow[]>("No valid finance entries to insert");
  }

  // Batch insert all rows
  const { data, error } = await supabase
    .from("finances")
    .insert(financesToInsert)
    .select();

  if (error || !data) {
    return buildError<FinanceInsertRow[]>(`Failed to insert finances: ${error.message}`);
  }

  return buildSuccess<FinanceInsertRow[]>(
    `Successfully inserted ${data.length} finance entries`,
    data
  );
}
