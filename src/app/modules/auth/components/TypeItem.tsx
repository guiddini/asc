import React from "react";
import { Control, Controller } from "react-hook-form";
import "./TypeItem.css";

interface TypeItemProps {
  control: Control<any>;
  name: string;
  icon: string;
  title: string;
  desc: string;
}

export const TypeItem: React.FC<TypeItemProps> = ({
  control,
  name,
  icon,
  title,
  desc,
}) => {
  return (
    <Controller
      name="type"
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className="type-item" onClick={() => onChange(name)}>
          <input
            type="radio"
            className="type-item-input"
            name="account_type"
            value={name}
            checked={value === name}
            id={`type_${name}`}
            onChange={() => {}}
          />
          <label className="type-item-label" htmlFor={`type_${name}`}>
            <i className={`type-item-icon ki-duotone ki-${icon}`}></i>
            <span className="type-item-content">
              <span className="type-item-title">{title}</span>
              <span className="type-item-desc">{desc}</span>
            </span>
          </label>
        </div>
      )}
    />
  );
};
