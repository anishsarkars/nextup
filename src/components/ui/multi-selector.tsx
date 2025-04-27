
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Badge } from "./badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { X } from "lucide-react";

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectorProps {
  control: Control<any>;
  name: string;
  options: OptionType[];
  placeholder?: string;
}

export function MultiSelector({ control, name, options, placeholder = "Select options..." }: MultiSelectorProps) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field }) => (
        <div className="border border-input rounded-md">
          <div className="flex flex-wrap gap-1 p-1.5">
            {field.value?.map((item: string) => (
              <Badge key={item} variant="secondary" className="flex items-center gap-1">
                {options.find(option => option.value === item)?.label || item}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => field.onChange(field.value.filter((i: string) => i !== item))}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </button>
              </Badge>
            ))}
            <Command className="bg-transparent w-full">
              <CommandInput placeholder={placeholder} className="border-0 focus:ring-0 h-8 p-0" />
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (field.value?.includes(option.value)) {
                        field.onChange(field.value.filter((val: string) => val !== option.value));
                      } else {
                        field.onChange([...(field.value || []), option.value]);
                      }
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </div>
        </div>
      )}
    />
  );
}
