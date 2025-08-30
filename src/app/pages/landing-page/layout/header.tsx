import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import NavigationMenu from "./navigation-menu";
import MobileMenu from "./mobile-menu";
import SearchComponent from "./search-component";
import { Link } from "react-router-dom";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleToggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const handleCloseMobileMenu = () => setShowMobileMenu(false);

  const handleShowSearch = () => setShowSearch(true);
  const handleCloseSearch = () => setShowSearch(false);

  return (
    <header className={`site-header ${className}`}>
      <Navbar
        expand="lg"
        className="navbar-custom py-3"
        fixed="top"
        bg="white"
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <Container>
          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="brand-logo d-flex align-items-center"
          >
            <div className="logo-container d-flex align-items-center">
              <div className="logo-icon me-3">
                <img
                  src="/media/eventili/logos/logo.svg"
                  alt="Event Logo"
                  className="logo-image"
                  height="40"
                />
              </div>
            </div>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center flex-grow-1 justify-content-between">
            <NavigationMenu />

            {/* Action Buttons */}
            <div className="header-actions d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={handleShowSearch}
              >
                <i className="bi bi-search me-1"></i>
                Search
              </Button>

              <Button variant="primary" size="sm" className="px-3">
                <i className="bi bi-ticket-perforated me-1"></i>
                Book tickets
              </Button>

              <Button variant="secondary" size="sm" className="px-3">
                <i className="bi bi-briefcase me-1"></i>
                Partner with us
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="outline-secondary"
            className="d-lg-none"
            onClick={handleToggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list"></i>
          </Button>
        </Container>
      </Navbar>

      {/* Mobile Menu */}
      <MobileMenu show={showMobileMenu} onHide={handleCloseMobileMenu} />

      {/* Search Modal */}
      <SearchComponent show={showSearch} onHide={handleCloseSearch} />
    </header>
  );
};

export default Header;
