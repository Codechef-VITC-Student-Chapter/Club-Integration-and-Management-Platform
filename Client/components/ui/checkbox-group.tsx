"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxItemProps {
  id: string;
  label: string;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

interface CheckboxGroupProps {
  items?: CheckboxItemProps[];
}

function CheckboxGroup({ items }: CheckboxGroupProps) {
  const defaultItems: CheckboxItemProps[] = [
    { id: "item1", label: "Item 1" },
    { id: "item2", label: "Item 2" },
  ];

  const checkboxItems = items || defaultItems;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {checkboxItems.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={item.id}
            defaultChecked={item.defaultChecked}
            onCheckedChange={item.onCheckedChange}
            className="h-4 w-4 border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-ring"
          />
          <Label
            htmlFor={item.id}
            className="text-foreground cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
}

export default CheckboxGroup;
