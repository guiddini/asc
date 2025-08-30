import React, { useState, useRef, useEffect } from "react";
import { Nav, Dropdown } from "react-bootstrap";
import { navigationItems } from "../data/navigation-items";

interface HoverDropdownProps {
  title: string;
  items: { label: string; href: string }[];
}

const HoverDropdown: React.FC<HoverDropdownProps> = ({ title, items }) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShow(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShow(false);
    }, 150); // Slightly longer delay for smoother UX
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Dropdown
      show={show}
      className={`nav-dropdown-hover ${show ? "show" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <Dropdown.Toggle
        as="a"
        className="nav-link nav-dropdown-toggle"
        href="#"
        onClick={(e) => e.preventDefault()}
      >
        {title}
        <i className="bi bi-chevron-down ms-1 small"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-hover">
        {items.map((item, index) => (
          <Dropdown.Item
            key={index}
            href={item.href}
            className="dropdown-item-custom"
          >
            {item.label}
          </Dropdown.Item>
        ))}
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
          <Nav.Link key={index} href={item.href} className="nav-link-custom">
            {item.label}
          </Nav.Link>
        )
      )}
    </Nav>
  );
};

export default NavigationMenu;
