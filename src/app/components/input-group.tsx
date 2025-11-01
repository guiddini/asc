import React, { forwardRef } from "react";
import { Form, InputGroup as BootstrapInputGroup } from "react-bootstrap";
import clsx from "clsx";

interface InputGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "value"> {
  suffix?: string;
  prefix?: string;
  isInvalid?: boolean;
  size?: "sm" | "lg";
  value?: string | number | string[];
}

export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  ({ suffix, prefix, isInvalid, className, size, ...props }, ref) => {
    return (
      <BootstrapInputGroup className={clsx(className)} size={size}>
        {prefix && (
          <BootstrapInputGroup.Text>{prefix}</BootstrapInputGroup.Text>
        )}
        <Form.Control ref={ref} isInvalid={isInvalid} {...props} />
        {suffix && (
          <BootstrapInputGroup.Text>{suffix}</BootstrapInputGroup.Text>
        )}
      </BootstrapInputGroup>
    );
  }
);

InputGroup.displayName = "InputGroup";
