import { FC, ReactNode } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { KTIcon, WithChildren, checkIsActive } from "../../../helpers";
import { useLayout } from "../../core";

type Props = {
  to?: string;
  title: string;
  icon?: string;
  fontIcon?: string;
  className?: string;
  hasBullet?: boolean;
  bsTitle?: string;
  outside?: boolean;
  customIcon?: ReactNode;
  onClick?: any;
  badge?: number | string;
};

const MenuItem: FC<Props & WithChildren> = ({
  to,
  className,
  outside,
  title,
  fontIcon,
  onClick,
  hasBullet,
  icon,
  children,
  customIcon,
  badge,
}) => {
  const { pathname } = useLocation();
  const isActive = checkIsActive(pathname, to);
  const { config } = useLayout();
  const { aside } = config;

  const renderContent = () => (
    <>
      {hasBullet && (
        <span className="menu-bullet">
          <span className="bullet bullet-dot"></span>
        </span>
      )}
      {icon && aside.menuIcon === "svg" && (
        <span className="menu-icon">
          <KTIcon iconName={icon} className="fs-2" />
        </span>
      )}
      {customIcon && <span className="menu-icon me-0">{customIcon}</span>}
      {fontIcon && aside.menuIcon === "font" ? (
        <>
          <span className="menu-icon me-0">
            <i className={clsx("bi", fontIcon)}></i>
          </span>
          <span className="menu-title no-wrap">{title}</span>
        </>
      ) : (
        <span className="menu-title no-wrap">{title}</span>
      )}
      {badge !== undefined && (
        <span className="badge bg-primary position-absolute bottom-0 end-0">{badge}</span>
      )}
    </>
  );

  return (
    <div className={clsx("menu-item", isActive && "here show", className)}>
      {outside ? (
        <a
          href={to}
          target="_blank"
          className={clsx("menu-link menu-center position-relative", { activee: isActive })}
        >
          {renderContent()}
        </a>
      ) : onClick ? (
        <span
          className="menu-link menu-center cursor-pointer position-relative"
          onClick={onClick}
        >
          {renderContent()}
        </span>
      ) : (
        <Link className="menu-link menu-center position-relative" to={to}>
          {renderContent()}
        </Link>
      )}
      {children}
    </div>
  );
};

const AsideMenuItem: FC<Props & WithChildren> = (props) => {
  return <MenuItem {...props}>{props.children}</MenuItem>;
};

export { AsideMenuItem };
