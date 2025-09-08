import { useMemo } from "react";
import { useQuery } from "react-query";
import { getCommunesApi } from "../../apis";
import { SelectComponent } from "..";
import { Willaya } from "../../types/resources";
import { Control } from "react-hook-form";

export const CommuneSelect = ({
  control,
  errors,
  colXS,
  colMD,
  willaya_id,
  defaultValue,
  defaultValueID,
}: {
  control: Control;
  errors: any;
  colXS?: number;
  colMD?: number;
  willaya_id: number | string | null;
  defaultValue?: {
    label: string;
    value: string | number;
  };
  defaultValueID?: string | number;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["communes", willaya_id],
    queryFn: async () => {
      return getCommunesApi(willaya_id);
    },
  });

  const COMMUNES = useMemo(
    () =>
      data?.data?.map((willaya: Willaya, index: number) => {
        return {
          label: willaya.name,
          value: willaya.id,
        };
      }),
    [data]
  );

  const defaultCommune = COMMUNES?.find(
    (commune) => Number(commune?.value) === Number(defaultValueID)
  );

  return (
    <SelectComponent
      data={COMMUNES}
      control={control}
      name="commune"
      errors={errors}
      label="City"
      noOptionMessage=""
      colXS={colXS}
      colMD={colMD}
      isLoading={isLoading}
      disabled={willaya_id === null || isLoading}
      defaultValue={defaultValueID ? defaultCommune : defaultValue}
      key={defaultCommune?.label}
    />
  );
};
