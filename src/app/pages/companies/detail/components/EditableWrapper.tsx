import React from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

interface EditableWrapperProps {
  children: React.ReactNode;
  isCompanyEditor: boolean;
  editable: boolean;
  setEditable: (editable: boolean) => void;
  handleSubmit: any;
  handleUpdate: any;
  isUpdating: boolean;
  resetFields: () => void;
  id: string;
}

const EditableWrapper: React.FC<EditableWrapperProps> = ({
  children,
  isCompanyEditor,
  editable,
  setEditable,
  handleSubmit,
  handleUpdate,
  isUpdating,
  resetFields,
  id,
}) => {
  const navigate = useNavigate();

  if (!isCompanyEditor) {
    return <>{children}</>;
  }

  return (
    <>
      {editable ? (
        <div
          className="position-sticky gap-2 d-flex flex-row align-items-center justify-content-end"
          style={{ left: "1850px", top: "1%", zIndex: 300 }}
        >
          <button
            onClick={() => {
              setEditable(false);
              resetFields();
            }}
            className="btn btn-sm btn-custom-purple-light text-white"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit(handleUpdate)}
            className="btn btn-sm btn-custom-blue-dark text-white"
          >
            {isUpdating ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Sauvegarder"
            )}
          </button>
        </div>
      ) : (
        <Dropdown
          className="position-sticky d-flex"
          style={{ left: "1840px", top: "1%", zIndex: 10 }}
        >
          <Dropdown.Toggle
            className="btn btn-sm btn-primary ms-auto"
            variant="outline-primary"
          >
            <i className="ki-duotone ki-edit p-0"></i> Modifier
          </Dropdown.Toggle>
          <Dropdown.Menu className="p-3">
            <Dropdown.Item
              onClick={() => {
                setEditable(true);
              }}
            >
              Modifier en direct
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                navigate(`/company/${id}/update`);
              }}
            >
              Modifier
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      {children}
    </>
  );
};

export default EditableWrapper;
