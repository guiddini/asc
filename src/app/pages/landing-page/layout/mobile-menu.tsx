import React, { useState } from "react";
import { Offcanvas, Nav, Accordion, Button } from "react-bootstrap";
import { mobileNavItems } from "../data/navigation-items";
import SearchComponent from "./search-component";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

interface MobileMenuProps {
  show: boolean;
  onHide: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ show, onHide }) => {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleShowSearch = () => setShowSearch(true);
  const handleCloseSearch = () => setShowSearch(false);

  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );

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
          <div className="mobile-actions p-3 border-bottom">
            <div className="d-grid gap-2">
              {currentUser ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    navigate("/dashboard");
                    onHide();
                  }}
                >
                  <i className="bi bi-house-door me-2"></i>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      navigate("/auth/login");
                      onHide();
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigate("/auth/signup");
                      onHide();
                    }}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Register
                  </Button>
                </>
              )}
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleShowSearch}
              >
                <i className="bi bi-search me-2"></i>
                Search
              </Button>
            </div>
          </div>

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
                            onClick={() => {
                              navigate(subItem.href);
                              onHide();
                            }}
                            className="mobile-nav-sublink"
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
                    onClick={() => {
                      navigate(item.href);
                      onHide();
                    }}
                    className="mobile-nav-link"
                  >
                    <span className="mobile-nav-label">{item.label}</span>
                  </Nav.Link>
                </div>
              )
            )}
          </div>
        </div>
      </Offcanvas.Body>

      <SearchComponent show={showSearch} onHide={handleCloseSearch} />
    </Offcanvas>
  );
};

export default MobileMenu;
