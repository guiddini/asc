import React, { useState, useRef, useEffect } from "react";
import { Nav, Dropdown } from "react-bootstrap";
import { navigationItems } from "../data/navigation-items";
import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  href?: string;
  dropdown?: NavItem[];
}

interface HoverDropdownProps {
  title: string;
  items: NavItem[];
  isSubmenu?: boolean;
}

const HoverDropdown: React.FC<HoverDropdownProps> = ({
  title,
  items,
  isSubmenu = false,
}) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShow(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Dropdown
      show={show}
      className={`nav-dropdown-hover ${show ? "show" : ""} ${
        isSubmenu ? "dropend" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Dropdown.Toggle
        as={Link}
        className={`nav-link nav-dropdown-toggle ${
          isSubmenu ? "dropdown-item-custom" : ""
        }`}
        to="#"
        onClick={(e) => e.preventDefault()}
      >
        {title}
        <i
          className={`bi ${
            isSubmenu ? "bi-chevron-right" : "bi-chevron-down"
          } ms-1 small`}
        ></i>
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-hover">
        {items.map((item, index) =>
          item.dropdown ? (
            <HoverDropdown
              key={index}
              title={item.label}
              items={item.dropdown}
              isSubmenu={true}
            />
          ) : (
            <Dropdown.Item
              key={index}
              as={Link}
              to={item.href || "#"}
              className="dropdown-item-custom"
            >
              {item.label}
            </Dropdown.Item>
          )
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const NavigationMenu: React.FC = () => {
  return (
    <Nav className="navigation-menu mx-auto">
      {navigationItems.map((item, index) =>
        item.dropdown ? (
          <HoverDropdown key={index} title={item.label} items={item.dropdown} />
        ) : (
          <Link key={index} to={item.href || "#"} className="nav-link-custom">
            {item.label}
          </Link>
        )
      )}
    </Nav>
  );
};

export default NavigationMenu;
