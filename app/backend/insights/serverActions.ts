import { createClient } from "@/lib/supabase/server";
import { BackendResponse } from "../types/General";
import { InsightResponse } from "../types/Insight";
import { buildError, buildSuccess } from "../build/general";
import { Finances } from "../types/Finances";
import { getTotalInflowFromServer, getTotalOutflowFromServer } from "../finances/serverActions";



export async function getIncomeStreamInsightFromServer(
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

export async function getAssetInsightFromServer(
  userId: string,
): Promise<BackendResponse<InsightResponse>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("finances")
    .select("*")
    .eq("userId", userId)
    .eq("type", 3); // Typically, 3 = assets

  if (error || !data) {
    return buildError("could not get insights on assets");
  }

  const assets = data as Finances[];

  // Total asset value
  const assetTotal = assets.reduce((sum, f) => sum + Number(f.amount), 0);

  // Asset diversity - more categories safer
  const assetCategories = new Set(assets.map((a) => a.label)).size;

  // Diminishing returns after 4+ categories
  const diversityScore = 1 / (1 + Math.exp(-(2 - assetCategories))); 

  let message = "";
  let type = 0;

  if (assetTotal === 0) {
    message = "No assets detected. Begin by accumulating savings or investments.";
    type = 2;
  } else if (assetCategories <= 1) {
    message = "All your assets are concentrated in a single category (e.g., only cash or only stocks).";
    type = 1;
  } else if (assetCategories < 3) {
    message = "Consider diversifying your asset base for better financial resilience.";
    type = 1;
  } else {
    message = "Your asset portfolio shows healthy diversification.";
    type = 0;
  }

  if (assetTotal > 0 && assetCategories > 5) {
    message += " (Many asset categories detected. Make sure complicated holdings remain manageable.)";
  }

  const warningLevel = Math.round(diversityScore * 100);

  return buildSuccess("", {
    message,
    type,
    warningLevel,
  });
}

export async function getLiabilityInsightFromServer(
  userId: string,
): Promise<BackendResponse<InsightResponse>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("finances")
    .select("*")
    .eq("userId", userId)
    .eq("type", 4); // Typically, 4 = liabilities

  if (error || !data) {
    return buildError("could not get insights on liabilities");
  }

  const liabilities = data as Finances[];

  const liabilityTotal = liabilities.reduce((sum, f) => sum + Number(f.amount), 0);

  // Liability diversity - fewer bigger liabilities = riskier
  const liabilitySources = new Set(liabilities.map((l) => l.label)).size;
  const hasLargeSingleLiability = liabilitySources === 1 && liabilityTotal > 0;

  let message = "";
  let type = 0;
  if (liabilityTotal === 0) {
    message = "You have no recorded liabilities—great job controlling your debts!";
    type = 0;
  } else if (hasLargeSingleLiability) {
    message = "All your liabilities are concentrated in one area. This poses a repayment risk if conditions change.";
    type = 2;
  } else {
    message = "Your liabilities are diversified, but monitor overall debt to ensure manageability.";
    type = liabilityTotal > 20000 ? 1 : 0; // Tweak depending on your context
  }

  const warningLevel = hasLargeSingleLiability ? 90 : Math.round((liabilities.length > 5 ? 30 : 60));

  return buildSuccess("", {
    message,
    type,
    warningLevel,
  });
}


export async function getOutflowInsightFromServer(
  userId: string,
): Promise<BackendResponse<InsightResponse>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("finances")
    .select("*")
    .eq("userId", userId)
    .eq("type", 2); // Typically, 2 = outflows/expenses

  if (error || !data) {
    return buildError("could not get insights on outflows");
  }

  const outflows = data as Finances[];

  // Outflow categories (bills, groceries, etc.)
  const outflowCategories = new Set(outflows.map((o) => o.label)).size;
  const outflowTotal = outflows.reduce((sum, f) => sum + Number(f.amount), 0);

  let message = "";
  let type = 0;

  if (outflowTotal === 0) {
    message = "No expenses detected. Be sure you are logging all regular outflows.";
    type = 1;
  } else if (outflowCategories <= 2) {
    message = "Your spending is concentrated in a few categories. Ensure key expenses are not being missed.";
    type = 1;
  } else if (outflowCategories > 6) {
    message = "Highly diversified outflows—review categories for unnecessary or duplicate expenses.";
    type = 1;
  } else {
    message = "Your expense structure appears balanced.";
    type = 0;
  }

  const warningLevel = outflows.length < 3 ? 60 : outflows.length > 10 ? 20 : 35;

  return buildSuccess("", {
    message,
    type,
    warningLevel,
  });
}
