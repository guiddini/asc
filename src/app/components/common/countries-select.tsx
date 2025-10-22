import { useMemo } from "react";
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
}: {
  control: Control;
  errors: any;
  colXS?: number;
  colMD?: number;
  showLabel?: boolean;
  defaultValue?: {
    label: string;
    value: string | number;
  };
  label?: string;
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
    />
  );
};
