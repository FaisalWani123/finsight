import { createClient } from "@/lib/supabase/client"; // adjust path as needed
import { FinanceFormData, FinanceInsertRow, Finances } from "../types/Finances";
import { BackendResponse } from "../types/General";
import { buildError, buildSuccess } from "../build/general";



// Map each section to its corresponding type value
const FINANCE_TYPE_MAP = {
  inflows: 1,
  outflows: 2,
  assets: 3,
  liabilities: 4,
} as const;



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

export async function fetchUserFinances(userId: string): Promise<BackendResponse<Finances[]>> {
  const supabase = await createClient();
  console.log("userId:", userId)
  const { data, error } = await supabase
    .from("finances")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (!data || error) {
    return buildError("could not fetch finances");
  }

  return buildSuccess("Fetched Finances", data)
}

export async function deleteFinanceEntryById(id: string): Promise<BackendResponse<Boolean>> {
  const supabase = await createClient(); 
  const {error} = await supabase
    .from("finances")
    .delete()
    .eq("id", id)

  if (error) {
    return buildError("Could not delete entry")
  }
  return buildSuccess("Successfully deleted", true)
}