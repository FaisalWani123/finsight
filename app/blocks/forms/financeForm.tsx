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
import { FinanceFormData } from "@/app/backend/types/Finances";


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

  const flows = {
    inflows: useFieldArray({ control, name: "inflows" }),
    outflows: useFieldArray({ control, name: "outflows" }),
    assets: useFieldArray({ control, name: "assets" }),
    liabilities: useFieldArray({ control, name: "liabilities" }),
  };

  const sections: (keyof FinanceFormData)[] = ["inflows", "outflows", "assets", "liabilities"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
      {sections.map((section) => {
        const { fields, append, remove } = flows[section];

        return (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{sectionConfig[section].title}</CardTitle>
              <CardDescription>{sectionConfig[section].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <FieldGroup key={field.id} className="flex gap-3 items-end">
                  {/* Label Input */}
                  <Field className="flex-1">
                    <FieldLabel htmlFor={`${section}-${index}-label`}>Label</FieldLabel>
                    <Input
                      id={`${section}-${index}-label`}
                      {...register(`${section}.${index}.label` as const, { required: true })}
                      placeholder="Enter label"
                    />
                  </Field>

                  {/* Amount Input */}
                  <Field className="flex-1">
                    <FieldLabel htmlFor={`${section}-${index}-amount`}>Amount</FieldLabel>
                    <Input
                      id={`${section}-${index}-amount`}
                      type="text"
                      {...register(`${section}.${index}.amount` as const, {
                        required: true,
                        valueAsNumber: true,
                      })}
                      placeholder="0.00"
                      onFocus={(e) => {
                        const val = e.target.value.replace(/[^0-9.-]+/g, "");
                        e.target.value = val;
                      }}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (!isNaN(val)) {
                          e.target.value = new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(val);
                        }
                      }}
                    />
                  </Field>

                  {/* Remove Button */}
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

              {/* Add Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ label: "", amount: 0 })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {sectionConfig[section].title}
              </Button>
            </CardContent>
          </Card>
        );
      })}

      {/* Submit Button */}
      <div className="flex justify-center mt-6">
        <Button type="submit" className="w-full/2">
          Submit
        </Button>
      </div>
    </form>
  );
};

