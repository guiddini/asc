import { FC } from "react";
import clsx from "clsx";
import { useLayout } from "../core";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Footer: FC = () => {
  const { classes } = useLayout();
  return (
    <div className={"footer py-4 d-flex flex-lg-column"} id="kt_footer">
      {/*begin::Container*/}
      <div
        className={clsx(
          classes.footerContainer,
          "d-flex flex-column flex-md-row align-items-center justify-content-between"
        )}
      >
        {/*begin::Copyright*/}
        <div className="text-gray-900 order-2 order-md-1">
          <span className="text-muted fw-bold me-1">
            {new Date().getFullYear()}&copy;
          </span>
          <a
            href="https://aventure.dz/home"
            target="_blank"
            className="text-gray-800 text-hover-primary"
          >
            Copyright © 2025 Algeria Venture All rights reserved.
          </a>
        </div>

        {/*end::Copyright*/}

        {/*begin::Menu*/}
        <ul className="menu menu-gray-600 menu-hover-primary fw-bold order-1">
          <li className="menu-item">
            {/* <a
              href="https://algeriafintech.com/"
              target="_blank"
              className="menu-link px-2"
            >
              À propos
            </a> */}
          </li>
        </ul>
        {/*end::Menu*/}
      </div>
      {/*end::Container*/}
    </div>
  );
};

export { Footer };
