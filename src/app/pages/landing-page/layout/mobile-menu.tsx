import React from "react";
import { Offcanvas, Nav, Accordion, Button } from "react-bootstrap";
import { mobileNavItems } from "../data/navigation-items";

interface MobileMenuProps {
  show: boolean;
  onHide: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ show, onHide }) => {
  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      className="mobile-menu"
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="mobile-menu-title">Menu</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0">
        <div className="mobile-nav-container">
          {/* Action Buttons - Mobile */}
          <div className="mobile-actions p-3 border-bottom">
            <div className="d-grid gap-2">
              <Button variant="primary" size="sm">
                <i className="bi bi-ticket-perforated me-2"></i>
                Book tickets
              </Button>
              <Button variant="secondary" size="sm">
                <i className="bi bi-briefcase me-2"></i>
                Partner with us
              </Button>
              <Button variant="outline-secondary" size="sm">
                <i className="bi bi-search me-2"></i>
                Search
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="mobile-nav-list">
            {mobileNavItems.map((item, index) =>
              item.items ? (
                <Accordion flush className="mobile-accordion" key={index}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="mobile-accordion-header">
                      <span className="mobile-nav-label">{item.label}</span>
                    </Accordion.Header>
                    <Accordion.Body className="p-0">
                      <div className="mobile-submenu">
                        {item.items.map((subItem, subIndex) => (
                          <Nav.Link
                            key={subIndex}
                            href={subItem.href}
                            className="mobile-nav-sublink"
                            onClick={onHide}
                          >
                            {subItem.label}
                          </Nav.Link>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ) : (
                <div key={index} className="mobile-nav-single">
                  <Nav.Link
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={onHide}
                  >
                    <span className="mobile-nav-label">{item.label}</span>
                  </Nav.Link>
                </div>
              )
            )}
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default MobileMenu;
