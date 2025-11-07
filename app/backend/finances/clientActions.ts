import { createClient } from "@/lib/supabase/client"; // adjust path as needed
import { FinanceFormData, FinanceInsertRow, Finances } from "../types/Finances";
import { BackendResponse } from "../types/General";
import { buildError, buildSuccess } from "../build/general";
import { convertCurrency } from "@/lib/currencyConverter";
import { currencyMapper } from "@/lib/currencyMapper";
import { ClassStatisticRepsonse } from "../types/Finances";


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

export async function deleteFinanceEntryById(id: string): Promise<BackendResponse<boolean>> {
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

export async function updateFinanceEntryById(id: string, label: string, amount: number): Promise<BackendResponse<Finances>> {
  const supabase = await createClient(); 
  const {data, error} = await supabase
    .from("finances")
    .update({label: label, amount: amount})
    .eq("id", id)
    .single<Finances>();

  if (error) {
    return buildError("Could not update")
  }
  return buildSuccess("Updated Successfully", data)
}

export function collateTotal(data: Finances[], targetCurrency: number): number {
    const total = data.reduce((acc, record) => {
        const amount = Number(record.amount);
        const fromCurrency = currencyMapper(Number(record.currency));
        const converted = convertCurrency(amount, fromCurrency, currencyMapper(targetCurrency));
        return acc + converted;
    }, 0);
    return total;
}

export async function getTotalInflowFromClient(userId: string, targetCurrency: number): Promise<BackendResponse<ClassStatisticRepsonse>> {
    const supabase = await createClient(); 
    const {data, error} = await supabase
        .from("finances")
        .select("*")
        .eq("userId", userId)
        .eq("type", 1)

    if (error) throw error;
    const records: Finances[] = data;
    if (!records || records.length === 0) {
      return buildError("could not fetch total inflows");
    }

    const total = collateTotal(records, targetCurrency)
    return buildSuccess("", {records, total})
}

export async function getTotalOutflowFromClient(userId: string, targetCurrency: number): Promise<BackendResponse<ClassStatisticRepsonse>> {
    const supabase = await createClient(); 
    const {data, error} = await supabase
        .from("finances")
        .select("*")
        .eq("userId", userId)
        .eq("type", 2)

    if (error) throw error;
    const records: Finances[] = data;

    if (!records || records.length === 0) {
      return buildError("could not fetch total outflows");
    }

    const total = collateTotal(records, targetCurrency)
    return buildSuccess("", {records, total})

}

export async function getTotalAssetsFromClient(userId: string, targetCurrency: number): Promise<BackendResponse<ClassStatisticRepsonse>> {
    const supabase = await createClient(); 
    const {data, error} = await supabase
        .from("finances")
        .select("*")
        .eq("userId", userId)
        .eq("type", 3)
        
    if (error) throw error;
    const records: Finances[] = data;
    if (!records || records.length === 0) {
      return buildError("could not fetch total assets");
    }
    const total = collateTotal(records, targetCurrency)
    return buildSuccess("", {records, total})

}

export async function getLiabilitiesFromClient(userId: string, targetCurrency: number): Promise<BackendResponse<ClassStatisticRepsonse>> {
    const supabase = await createClient(); 
    const {data, error} = await supabase
        .from("finances")
        .select("*")
        .eq("userId", userId)
        .eq("type", 4)

    if (error) throw error;
    const records: Finances[] = data;

    if (!records || records.length === 0) {
      return buildError("could not fetch total liabilities");
    }

    const total = collateTotal(records, targetCurrency)
    return buildSuccess("", {records, total})
}