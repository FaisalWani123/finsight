import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currencyMapper } from "@/lib/currencyMapper";
import { useState } from "react";

interface CurrencyDropdownProps {
  initialCurrencyId: number;
  onCurrencyChange: (newCurrencyId: number) => void;
}

export function CurrencyDropdown({ initialCurrencyId, onCurrencyChange }: CurrencyDropdownProps) {
  const [currencyId, setCurrencyId] = useState<number>(initialCurrencyId);

  return (
    <Select
      value={currencyId.toString()}
      onValueChange={(val) => {
        const id = Number(val);
        setCurrencyId(id);
        onCurrencyChange(id); // call your function when changed
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">{currencyMapper(1)}</SelectItem>
        <SelectItem value="2">{currencyMapper(2)}</SelectItem>
        <SelectItem value="3">{currencyMapper(3)}</SelectItem>
      </SelectContent>
    </Select>
  );
}
