import React, { useState } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import NavigationMenu from "./navigation-menu";
import MobileMenu from "./mobile-menu";
import SearchComponent from "./search-component";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";
import UserTypeComponent from "./type-user-component";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const [showTypeComponent, setShowTypeComponent] = useState(false);
  const handleType = () => setShowTypeComponent(true);
  const handleCloseType = () => setShowTypeComponent(false);
  const handleToggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const handleCloseMobileMenu = () => setShowMobileMenu(false);

  const handleShowSearch = () => setShowSearch(true);
  const handleCloseSearch = () => setShowSearch(false);

  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );

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

              {currentUser ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    navigate("/dashboard");
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
                    className="px-3"
                    onClick={() => navigate("/auth/login")}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="px-3"
                    onClick={handleType}
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Button>
                </>
              )}
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
      <UserTypeComponent show={showTypeComponent} onHide={handleCloseType} />

      {/* Search Modal */}
      <SearchComponent show={showSearch} onHide={handleCloseSearch} />
    </header>
  );
};

export default Header;
