// EditLinks.tsx
"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

type Lead = { user_id: string; name: string };
type Department = { id: string; name: string };
type PointOption = { label: string; value: number };

type FormValues = {
  department: string;
  lead: string;
  title: string;
  description: string;
  links: { url: string }[];
  selectedPoints: string;
  customPoints: number;
  multiplier: number;
  isELopen: boolean;
  choseCustom: boolean;
  clubId: string;
  clubName: string;
  departments: Department[];
  leadsList: Lead[];
  selectedLeads: Lead[];
  availablePoints: PointOption[];
};

type EditLinksProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const EditLinks: React.FC<EditLinksProps> = ({ isOpen, onClose }) => {
  const { control, register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray<FormValues, "links">({
    control,
    name: "links",
  });

  if (!isOpen) return null;

  const handleAdd = () => append({ url: "" });
  const handleRemove = (index: number) => {
    if (fields.length <= 1) return; // keep at least one link input
    remove(index);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-500">Edit Links</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <input
                type="text"
                {...register(`links.${index}.url` as const)}
                placeholder={`Link ${index + 1}`}
                className="w-full p-2 pr-8 border rounded"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={`Remove link ${index + 1}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          ADD ANOTHER LINK
        </button>

        <div className="flex justify-center items-center mt-5">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#4285F4] text-white px-6 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
