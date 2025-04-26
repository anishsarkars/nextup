
import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Control, useController } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

export interface MultiSelectorProps {
  options: Option[];
  placeholder?: string;
  control: Control<any>;
  name: string;
  emptyIndicator?: React.ReactNode;
}

export function MultiSelector({
  options,
  placeholder = "Select options",
  control,
  name,
  emptyIndicator,
}: MultiSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const { field } = useController({
    control,
    name,
    defaultValue: [],
  });

  const selected = field.value || [];
  
  const handleSelect = React.useCallback(
    (option: Option) => {
      setInputValue("");
      if (selected.some((item: string) => item === option.value)) {
        field.onChange(selected.filter((item: string) => item !== option.value));
      } else {
        field.onChange([...selected, option.value]);
      }
    },
    [selected, field]
  );

  const handleRemove = React.useCallback(
    (option: string) => {
      field.onChange(selected.filter((item: string) => item !== option));
    },
    [selected, field]
  );

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputRef_, setInputRef] = React.useState<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setInputRef(inputRef.current);
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef_.value;
      if (input === "" && e.key === "Backspace") {
        field.onChange(selected.slice(0, -1));
      }
      // Stop propagation to prevent Cmdk from handling the event and potentially closing the popover
      if (e.key === "Backspace") e.stopPropagation();
    },
    [inputRef_, selected, field]
  );

  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => {
      const matchesInput = option.label
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      const isSelected = selected.includes(option.value);
      return matchesInput && !isSelected;
    });
  }, [options, inputValue, selected]);

  const selectedOptions = React.useMemo(() => {
    return selected.map((selectedValue: string) => {
      return options.find((option) => option.value === selectedValue);
    }).filter(Boolean);
  }, [options, selected]);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring">
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge key={option!.value} variant="secondary">
              {option!.label}
              <button
                type="button"
                className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-0"
                onClick={() => handleRemove(option!.value)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {option!.label}</span>
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] h-8"
          />
        </div>
      </div>
      <div className="relative">
        {open && filteredOptions.length > 0 && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option)}
                  className="cursor-pointer"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        )}
        {open && filteredOptions.length === 0 && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <div className="py-6 text-center text-sm">
              {emptyIndicator || "No options found."}
            </div>
          </div>
        )}
      </div>
    </Command>
  );
}
