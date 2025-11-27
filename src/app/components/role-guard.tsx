import React from "react";
import { useSelector } from "react-redux";
import { UserResponse } from "../types/reducers";
import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface RoleGuardProps {
  allowedRoles: string[];
  exclusiveRoles?: string[];
  children: React.ReactNode;
  showError?: boolean;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  exclusiveRoles,
  children,
  showError = false,
}) => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const userRoles = user?.roles?.map((r: any) => r.name) || [];

  const hasAccess = userRoles.some((role: string) =>
    allowedRoles.includes(role)
  );

  const passesExclusive =
    exclusiveRoles && exclusiveRoles.length > 0
      ? userRoles.every((role: string) => exclusiveRoles.includes(role))
      : true;

  if (!hasAccess || !passesExclusive) {
    if (!showError) return null;

    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card
          className="text-center shadow-lg p-4 border-0"
          style={{ maxWidth: "500px" }}
        >
          <Card.Body>
            <h2 className="text-danger mb-3">🚫 Access Denied</h2>
            <p className="text-muted mb-4">
              You don’t have permission to view this page.
            </p>
            <Link to="/home" className="btn btn-danger">
              Go Home
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
