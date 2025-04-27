
import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = {
  value: string;
  label: string;
};

interface MultiSelectorProps {
  options: Option[];
  values: Option[];
  onChange: (values: Option[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelector({
  options,
  values = [],
  onChange,
  placeholder = "Select...",
  className,
  disabled = false,
}: MultiSelectorProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (option: Option) => {
    onChange(values.filter((value) => value.value !== option.value));
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && values.length > 0) {
            const newValues = [...values];
            newValues.pop();
            onChange(newValues);
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onChange, values]
  );

  const selectables = options.filter(
    (option) => !values.some((value) => value.value === option.value)
  );

  return (
    <div className="relative">
      <Command
        onKeyDown={handleKeyDown}
        className={`overflow-visible bg-transparent ${className}`}
      >
        <div
          className="flex flex-wrap gap-1 rounded-md border px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          onClick={() => {
            inputRef.current?.focus();
          }}
        >
          {values.map((value) => (
            <Badge key={value.value} variant="secondary">
              {value.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnselect(value);
                }}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={values.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
        </div>
        <div className="relative">
          {open && selectables.length > 0 && (
            <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      onChange([...values, option]);
                      setInputValue("");
                    }}
                    className={"cursor-pointer"}
                    disabled={disabled}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
}
