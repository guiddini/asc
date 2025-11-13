import { useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { getCountriesApi } from "../../apis";
import { SelectComponent } from "..";
import { Control } from "react-hook-form";

export const CountriesSelect = ({
  control,
  errors,
  colXS,
  colMD,
  defaultValue,
  label,
  onValueChange,
  debounceMs,
}: {
  control: Control<any>;
  errors: any;
  colXS?: number;
  colMD?: number;
  showLabel?: boolean;
  defaultValue?: {
    label: string;
    value: string | number;
  };
  label?: string;
  onValueChange?: (value: string | number | null) => void;
  debounceMs?: number;
}) => {
  const { data } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountriesApi,
  });

  const COUNTRIES = useMemo(
    () =>
      data?.data?.map(
        (
          willaya: {
            id: string;
            name_fr: string;
            name_en: string;
          },
          index: number
        ) => {
          return {
            label: willaya.name_en,
            value: willaya.id,
          };
        }
      ),
    [data]
  );

  const timerRef = useRef<number | null>(null);
  const handleDebouncedChange = (option: { label: string; value: string | number } | null) => {
    const value = option?.value ?? null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      onValueChange?.(value);
    }, debounceMs ?? 300);
  };

  return (
    <SelectComponent
      data={COUNTRIES}
      control={control}
      name="country"
      errors={errors}
      label={"Country"}
      noOptionMessage=""
      colXS={colXS}
      colMD={colMD}
      defaultValue={defaultValue}
      onValueChange={handleDebouncedChange}
    />
  );
};
