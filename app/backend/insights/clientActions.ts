import { createClient } from "@/lib/supabase/client";
import { BackendResponse } from "../types/General";
import { InsightResponse } from "../types/Insight";
import { buildError, buildSuccess } from "../build/general";
import { Finances } from "../types/Finances";
import { getTotalInflowFromServer, getTotalOutflowFromServer } from "../finances/serverActions";

export async function getIncomeStreamInsightFromClient(
  userId: string,
  currency: number
): Promise<BackendResponse<InsightResponse>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("finances")
    .select("*")
    .eq("userId", userId)
    .eq("type", 1);

  if (error || !data) {
    return buildError("could not get insights on inflows");
  }

  const typedData: Finances[] = data;

  let insightResponse: InsightResponse = {
    message: "no response",
    type: 0,
    warningLevel: 0,
  };

  // --- FETCH TOTALS (used for liquidity calculation) ---
  const inflowResponse = await getTotalInflowFromServer(userId, currency);
  const outflowResponse = await getTotalOutflowFromServer(userId, currency);

  if (!inflowResponse.success || !outflowResponse.success || !inflowResponse.data || !outflowResponse.data) {
    return buildError("could not get total inflows/outflows");
  }

  const totalInflow = inflowResponse.data.total;
  const totalOutflow = outflowResponse.data.total;
  const ratio = totalOutflow / totalInflow; // expense-to-income ratio
  const liquidityScore = Math.min(Math.max((ratio - 0.3) / 0.7, 0), 1); 
  // ratio ≤ 0.3 → perfect liquidity (score 0)
  // ratio ≥ 1.0 → terrible liquidity (score 1)

  // --- INCOME DIVERSITY SCORING ---
  const incomeSources = typedData.length;

  // More sources = safer. Diminishing returns after 4 sources.
  // Use a logistic curve to keep it smooth.
  const diversityScore = 1 / (1 + Math.exp(-(2 - incomeSources))); 
  // 1 source → ≈0.88 (risky), 3 sources → ≈0.12 (safe)

  // --- COMBINE SCORES ---
  // Weighted combination: liquidity is more important than diversity.
  const combinedScore = 0.6 * liquidityScore + 0.4 * diversityScore;

  // Convert to warning level (0–100)
  const warningLevel = Math.round(combinedScore * 100);

  // --- INSIGHT MESSAGE LOGIC ---
  let message = "";
  let type = 0; // 0 = neutral, 1 = warning, 2 = severe

  if (warningLevel < 30) {
    message = "Your income and spending structure look healthy.";
    type = 0;
  } else if (warningLevel < 60) {
    message = "You have some financial concentration or liquidity risk. Consider adding an extra income stream or reducing recurring expenses.";
    type = 1;
  } else {
    message = "Your finances are highly concentrated and illiquid. Diversifying income or cutting expenses is strongly advised.";
    type = 2;
  }

  // --- ADD CONTEXTUAL NOTES ---
  if (incomeSources === 1) {
    message += " (Only one stream of income detected.)";
  } else if (incomeSources > 5) {
    message += " (You have many small income streams — ensure they’re manageable and consistent.)";
  }

  // --- BUILD RESPONSE ---
  insightResponse = {
    message,
    type,
    warningLevel,
  };

  return buildSuccess("", insightResponse);
}