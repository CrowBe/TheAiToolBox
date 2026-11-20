"use client";

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@ui-sdk/react/combobox";
import { optionsFor } from "@/engine/options";
import { vocabularyLabel } from "@/engine/access";
import type { BoxConfig, FilterOption, FilterState, LabelField, LockedFilter } from "@/engine/types";
import { CheckIcon, ChevronIcon, CloseIcon } from "./icons";
import { listValues } from "./virtual";

export function FilterPanel({
  box,
  items,
  state,
  locked,
  onChange,
}: {
  box: BoxConfig;
  items: readonly object[];
  state: FilterState;
  locked?: LockedFilter;
  onChange: (field: string, values: string[]) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold">Filters</h2>
      {box.labels.map((label) =>
        label.field === locked?.field ? null : (
          <LabelCombobox
            key={label.field}
            box={box}
            items={items}
            label={label}
            state={state}
            locked={locked}
            onChange={onChange}
          />
        ),
      )}
    </div>
  );
}

function LabelCombobox({
  box,
  items,
  label,
  state,
  locked,
  onChange,
}: {
  box: BoxConfig;
  items: readonly object[];
  label: LabelField;
  state: FilterState;
  locked?: LockedFilter;
  onChange: (field: string, values: string[]) => void;
}) {
  const options = optionsFor(items, box, state, label, locked);
  if (options.length === 0) return null;
  const selected = state.selected[label.field] ?? [];
  const labelFor = (value: string) =>
    options.find((option) => option.value === value)?.label ??
    vocabularyLabel(box, label.vocabulary, value);

  return (
    <Combobox
      multiple
      keepQuery
      items={options.map((option) => ({ value: option.value, label: option.label }))}
      value={selected}
      itemToLabel={labelFor}
      onValueChange={(next) => onChange(label.field, next)}
    >
      <ComboboxLabel className="mb-2 block text-sm font-semibold">{label.label}</ComboboxLabel>
      <div className="flex items-start gap-1">
        <ComboboxChips>
          <ComboboxValue>
            {(chipState) =>
              (Array.isArray(chipState.value) ? chipState.value : []).flatMap((value) =>
                typeof value === "string" ? [value] : [],
              ).map((value, index) => {
                const text = chipState.labels[index] ?? labelFor(value);
                return (
                  <ComboboxChip key={value} value={value}>
                    {text}
                    <ComboboxChipRemove aria-label={`Remove ${text}`}>
                      <CloseIcon />
                    </ComboboxChipRemove>
                  </ComboboxChip>
                );
              })
            }
          </ComboboxValue>
          <ComboboxInput placeholder={`Add ${label.label.toLowerCase()}`} />
        </ComboboxChips>
        <ComboboxTrigger aria-label={`Show ${label.label}`}>
          <ChevronIcon />
        </ComboboxTrigger>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No {label.label.toLowerCase()} found.</ComboboxEmpty>
        <ComboboxList>
          {(state) => <OptionList options={options} items={state.items} />}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function OptionList({
  options,
  items,
}: {
  options: readonly FilterOption[];
  items: readonly unknown[];
}) {
  const counts = new Map(options.map((option) => [option.value, option.count]));
  return listValues(items).map((item, index) => (
    <ComboboxItem key={item.value} value={item.value} label={item.label} index={index}>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      <span className="text-xs text-muted">{(counts.get(item.value) ?? 0).toLocaleString("en")}</span>
      <ComboboxItemIndicator>
        <CheckIcon />
      </ComboboxItemIndicator>
    </ComboboxItem>
  ));
}
