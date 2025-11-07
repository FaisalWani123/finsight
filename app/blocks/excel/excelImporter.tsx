"use client";

import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { insertFinancesFromFormFromClient } from "@/app/backend/finances/clientActions";
import { FinanceInsertRow, FinanceFormData } from "@/app/backend/types/Finances";

const TYPE_MAP: Record<string, number> = {
  "inflow": 1,
  "outflow": 2,
  "asset": 3,
  "liability": 4,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4
};

interface ExcelImporterProps {
  userId: string;
  currency: number;
  onImport?: (success: boolean, message: string) => void;
}

export default function ExcelImporter({ userId, currency, onImport }: ExcelImporterProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      if (typeof bstr !== "string" && !(bstr instanceof ArrayBuffer)) return;

      const workbook = XLSX.read(bstr, { type: "binary" });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const json: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 }); // row array format

      // Find headers and data rows
      const [headersRaw, ...rows] = json;
      const headers: string[] = (headersRaw as string[]).map(h => h.trim().toLowerCase());

      // Required columns: label, amount, type
      const labelIdx = headers.findIndex(h => h === "label");
      const amountIdx = headers.findIndex(h => h === "amount");
      const typeIdx = headers.findIndex(h => h === "type");
      if (labelIdx === -1 || amountIdx === -1 || typeIdx === -1) {
        onImport?.(false, "Excel sheet must have columns: label, amount, type");
        return;
      }

      // Build rows for backend insertion
      const finances: FinanceInsertRow[] = rows
        .filter(row => row && row[labelIdx] && row[amountIdx] && row[typeIdx])
        .map(row => {
          const label = String(row[labelIdx]).trim();
          const amount = Number(row[amountIdx]);
          const typeRaw = String(row[typeIdx]).toLowerCase().trim();
          let type = TYPE_MAP[typeRaw];
          if (!type) {
            // Attempt normalization for plural/case
            type = TYPE_MAP[typeRaw.replace(/s$/, "")];
          }
          return { userId, label, amount, type, currency };
        })
        .filter(r => !!r.type && r.label && !isNaN(r.amount));

      if (finances.length === 0) {
        onImport?.(false, "No valid rows found in the Excel sheet.");
        return;
      }

      // Group rows by type for your insertFinancesFromFormFromClient function
      const formData: FinanceFormData = { inflows: [], outflows: [], assets: [], liabilities: [] };
      finances.forEach(row => {
        if (row.type === 1) formData.inflows.push(row);
        if (row.type === 2) formData.outflows.push(row);
        if (row.type === 3) formData.assets.push(row);
        if (row.type === 4) formData.liabilities.push(row);
      });

      // Send to backend
      const response = await insertFinancesFromFormFromClient(userId, formData, currency);
      onImport?.(response.success, response.message);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="my-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">Import Finances from Excel</label>
      <input
        type="file"
        accept=".xls,.xlsx"
        ref={fileInput}
        onChange={handleFileChange}
        className="border border-gray-300 p-2 rounded"
      />
    </div>
  );
}
