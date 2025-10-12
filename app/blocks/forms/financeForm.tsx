"use client"

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X } from "lucide-react";

type FinanceRow = {
  label: string;
  amount: number;
};

export type FinanceFormData = {
  inflows: FinanceRow[];
  outflows: FinanceRow[];
  assets: FinanceRow[];
  liabilities: FinanceRow[];
};

interface FinanceFormProps {
  onSubmit: (data: FinanceFormData) => void;
}

const sectionConfig = {
  inflows: { title: "Inflows", description: "Sources of income and revenue" },
  outflows: { title: "Outflows", description: "Expenses and costs" },
  assets: { title: "Assets", description: "Resources and holdings" },
  liabilities: { title: "Liabilities", description: "Debts and obligations" },
};

export const FinanceForm: React.FC<FinanceFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit, register } = useForm<FinanceFormData>({
    defaultValues: {
      inflows: [{ label: "", amount: 0 }],
      outflows: [{ label: "", amount: 0 }],
      assets: [{ label: "", amount: 0 }],
      liabilities: [{ label: "", amount: 0 }],
    },
  });

  const sections: (keyof FinanceFormData)[] = ["inflows", "outflows", "assets", "liabilities"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
      {sections.map((section) => {
        const { fields, append, remove } = useFieldArray({
          control,
          name: section,
        });

        return (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{sectionConfig[section].title}</CardTitle>
              <CardDescription>{sectionConfig[section].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <FieldGroup key={field.id} className="flex gap-3 items-end">
                  <Field className="flex-1">
                    <FieldLabel htmlFor={`${section}-${index}-label`}>
                      Label
                    </FieldLabel>
                    <Input
                      id={`${section}-${index}-label`}
                      {...register(`${section}.${index}.label` as const, { required: true })}
                      placeholder="Enter label"
                    />
                  </Field>
                  <Field className="flex-1">
                    <FieldLabel htmlFor={`${section}-${index}-amount`}>
                      Amount
                    </FieldLabel>
                    <Input
                      id={`${section}-${index}-amount`}
                      type="number"
                      step="0.01"
                      {...register(`${section}.${index}.amount` as const, {
                        required: true,
                        valueAsNumber: true,
                      })}
                      placeholder="0.00"
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </FieldGroup>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ label: "", amount: 0 })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {section}
              </Button>
            </CardContent>
          </Card>
        );
      })}

        <div className="flex justify-center mt-6">
            <Button type="submit" className="w-full/2">
                 Submit
            </Button>
        </div>
      
    </form>
  );
};
