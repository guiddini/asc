import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface EditableWrapperProps {
  children: React.ReactNode;
  isCompanyEditor: boolean;
  id: string;
}

const EditableWrapper: React.FC<EditableWrapperProps> = ({
  children,
  isCompanyEditor,
  id,
}) => {
  const navigate = useNavigate();

  if (!isCompanyEditor) {
    return <>{children}</>;
  }

  return (
    <>
      <Button
        className="position-sticky d-flex"
        style={{ left: "1840px", top: "1%", zIndex: 10 }}
        onClick={() => {
          navigate(`/company/${id}/update`);
        }}
      >
        <i className="ki-duotone ki-edit p-0"></i>
        Edit
      </Button>

      {children}
    </>
  );
};

export default EditableWrapper;
