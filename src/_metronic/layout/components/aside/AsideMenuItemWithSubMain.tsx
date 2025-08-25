import { FC, ReactNode } from "react";
import clsx from "clsx";
import { useLocation } from "react-router";
import { checkIsActive, WithChildren } from "../../../helpers";
import { useLayout } from "../../core";

type Props = {
  to: string;
  title: string;
  icon?: string;
  fontIcon?: string;
  hasBullet?: boolean;
  bsTitle?: string;
  customIcon?: ReactNode;
};

const AsideMenuItemWithSubMain: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  fontIcon,
  bsTitle,
  customIcon,
}) => {
  const { pathname } = useLocation();
  const isActive = checkIsActive(pathname, to);
  const { config } = useLayout();
  const { aside } = config;
  return (
    <div
      className={clsx("menu-item py-3", { "here show": isActive })}
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="right-start"
    >
      <span className="menu-link menu-center">
        {fontIcon && aside.menuIcon === "font" && (
          <>
            <span className="menu-icon me-0">
              <i className={clsx("bi", fontIcon, "fs-2")}></i>
            </span>
            <span className="menu-title no-wrap">{title}</span>
          </>
        )}

        {customIcon && (
          <>
            <span className="menu-icon me-0">{customIcon}</span>
            <span className="menu-title no-wrap">{title}</span>
          </>
        )}
      </span>
      <div
        className={clsx(
          "menu-sub menu-sub-dropdown w-225px w-lg-275px px-1 py-4",
          {
            "menu-active-bg": isActive,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { AsideMenuItemWithSubMain };
