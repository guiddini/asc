import clsx from "clsx";
import React from "react";

interface NoticeProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  cta?: React.ReactNode;
  containerClassName?: string;
  textContainerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const Notice: React.FC<NoticeProps> = ({
  title,
  cta,
  description,
  icon,
  containerClassName,
  descriptionClassName,
  titleClassName,
  textContainerClassName,
}) => {
  return (
    <div
      className={clsx(
        containerClassName,
        "notice d-flex rounded border-light border border-dashed p-6"
      )}
    >
      {icon && icon}
      <div
        className={clsx(
          "d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap"
        )}
      >
        <div
          className={clsx("mb-3 mb-md-0 fw-semibold", textContainerClassName)}
        >
          {title && (
            <h4 className={clsx("fw-bold text-light", titleClassName)}>
              {title}
            </h4>
          )}
          {description && (
            <div className={clsx("fs-6 pe-7 text-light", descriptionClassName)}>
              {description}
            </div>
          )}
        </div>
        {cta}
      </div>
    </div>
  );
};
