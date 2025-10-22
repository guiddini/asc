import { useMemo } from "react";
import { useQuery } from "react-query";
import { getWillayasApi } from "../../apis";
import { SelectComponent } from "..";
import { useTheme } from "../../hooks";
import { Willaya } from "../../types/resources";
import { Control } from "react-hook-form";

export const WillayasSelect = ({
  control,
  errors,
  colXS,
  colMD,
  defaultValue,
  defaultValueID,
}: {
  control: Control;
  errors: any;
  colXS?: number;
  colMD?: number;
  defaultValue?: {
    label: string;
    value: string | number;
  };
  defaultValueID?: string | number;
}) => {
  const { isRtl } = useTheme();
  const { data } = useQuery({
    queryKey: ["willayas"],
    queryFn: getWillayasApi,
  });

  const WILLAYAS = useMemo(
    () =>
      data?.data?.map((willaya: Willaya, index: number) => {
        if (isRtl) {
          return {
            label: willaya.arabic_name,
            value: willaya.id,
          };
        } else if (!isRtl) {
          return {
            label: willaya.name,
            value: willaya.id,
          };
        }
      }),
    [data]
  );

  const defaultWillaya = WILLAYAS?.find(
    (willaya) => Number(willaya?.value) === Number(defaultValueID)
  );

  return (
    <SelectComponent
      data={WILLAYAS}
      control={control}
      name="wilaya"
      errors={errors}
      label="Wilaya"
      noOptionMessage=""
      colXS={colXS}
      colMD={colMD}
      defaultValue={defaultValueID ? defaultWillaya : defaultValue}
      key={defaultWillaya?.label}
    />
  );
};
