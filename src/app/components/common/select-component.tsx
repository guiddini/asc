import React from "react";
import { Col, Row } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import Select from "react-select";
import { useTheme } from "../../hooks";
import { errorMessage, isError } from "../../helpers/errorMessage";

interface SelectComponentProps {
  name: string;
  control: Control<any>;
  errors: any;
  label: string;
  data: any[];
  noOptionMessage?: string;
  placeholder?: string;
  className?: string;
  defaultValue?:
    | { label: string | any; value: string | any }
    | { label: string | any; value: string | any }[];

  colXS?: number;
  colMD?: number;
  isLoading?: boolean;
  saveOnlyValue?: boolean;
  required?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
  maxLimit?: number;
  onValueChange?: (value: any) => void;
}

export const SelectComponent: React.FC<SelectComponentProps> = (props) => {
  const { isDarkTheme } = useTheme();

  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={
        props.saveOnlyValue
          ? props.isMulti
            ? Array.isArray(props.defaultValue)
              ? (props.defaultValue as any[])?.map((o: any) => o?.value)
              : []
            : (props.defaultValue as any)?.value ?? null
          : props.defaultValue || null
      }
      disabled={props.disabled}
      render={({ field: { onBlur, onChange, ref, value } }) => {
        let selected: any = null;
        if (props.isMulti) {
          if (Array.isArray(value)) {
            const isPrimitiveArray = value.length > 0 && typeof value[0] !== "object";
            selected = isPrimitiveArray
              ? props.data.filter((opt) => (value as any[]).includes(opt.value))
              : value;
          } else {
            selected = [];
          }
        } else {
          if (value == null) {
            selected = props.defaultValue ?? null;
          } else if (typeof value === "object" && (value as any)?.value !== undefined) {
            selected = value;
          } else {
            selected = props.data.find((opt) => opt.value === value) ?? props.defaultValue ?? null;
          }
        }
        return (
          <Col
            xs={props.colXS || "6"}
            md={props.colMD || "6"}
            className={props.className}
          >
            <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
              <span className={`fw-bold ${props.required && "required "}`}>
                {props.label}
              </span>
            </label>
            <Select
              isDisabled={props.disabled}
              isLoading={props.isLoading || false}
              options={props.data}
              value={selected}
              isClearable
              isMulti={props.isMulti}
              closeMenuOnSelect={!props.isMulti}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: isError(props.errors, props.name)
                    ? "#ea868f"
                    : "hsl(0,0%,90.65%)",
                  backgroundColor: isDarkTheme ? "#26272F" : "#fff",
                }),

                option: (provided) => ({
                  ...provided,
                  backgroundColor: isDarkTheme ? "#26272F" : "#fff",
                  color: !isDarkTheme ? "#26272F" : "#fff",
                }),

                singleValue: (baseStyles, state) => ({
                  ...baseStyles,
                  color: isDarkTheme ? "#fff" : "#26272F",
                  background: "transparent",
                }),

                input: (baseStyles, state) => ({
                  ...baseStyles,
                  color: isDarkTheme ? "#fff" : "#26272F",
                  background: "transparent",
                }),

                noOptionsMessage: (baseStyles, state) => ({
                  ...baseStyles,
                  color: isDarkTheme ? "#fff" : "#26272F",
                  backgroundColor: isDarkTheme ? "#26272F" : "#fff",
                }),

                container: (baseStyles) => ({
                  ...baseStyles,
                }),
              }}
              isOptionDisabled={(option) => {
                if (props.isMulti) {
                  if (value !== null) {
                    return value?.length >= props.maxLimit;
                  }
                }
              }}
              onChange={(e: any) => {
                if (props?.saveOnlyValue) {
                  if (props.isMulti) {
                    const arr = e?.map((item: any) => item?.value);
                    onChange(arr);
                    props.onValueChange?.(arr);
                  } else {
                    onChange(e?.value);
                    props.onValueChange?.(e?.value);
                  }
                } else {
                  if (props.isMulti) {
                    onChange(e);
                    props.onValueChange?.(e);
                  } else {
                    onChange(e);
                    props.onValueChange?.(e);
                  }
                }
              }}
              onBlur={onBlur}
              ref={ref}
              noOptionsMessage={() => {
                return <p className="pt-3">No options match your search</p>;
              }}
              defaultValue={props.defaultValue}
              classNames={{}}
              placeholder="Select..."
            />
            {errorMessage(props.errors, props.name)}
          </Col>
        );
      }}
    />
  );
};
