import { createClient } from "@/lib/supabase/server";
import { BackendResponse } from "../types/General";
import { ClassStatisticRepsonse, Finances } from "../types/Finances";
import { buildError, buildSuccess } from "../build/general";
import { currencyMapper } from "@/lib/currencyMapper";
import { convertCurrency } from "@/lib/currencyConverter";


export function collateTotal(data: Finances[], targetCurrency: number): number {
    const total = data.reduce((acc, record) => {
        const amount = Number(record.amount);
        const fromCurrency = currencyMapper(Number(record.currency));
        const converted = convertCurrency(amount, fromCurrency, currencyMapper(targetCurrency));
        return acc + converted;
    }, 0);
    return total;
}

export async function getTotalInflowFromServer(userId: string, targetCurrency: number): Promise<BackendResponse<ClassStatisticRepsonse>> {
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

export async function getTotalOutflowFromServer(userId: string, targetCurrency: number): Promise<BackendResponse<ClassStatisticRepsonse>> {
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

export async function getTotalAssetsFromServer(userId: string, targetCurrency: number): Promise<BackendResponse<ClassStatisticRepsonse>> {
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

export async function getLiabilitiesFromServer(userId: string, targetCurrency: number): Promise<BackendResponse<ClassStatisticRepsonse>> {
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