import { PageTitle } from "../../../../../_metronic/layout/core";
import { Staff } from "../../../../types/user";
import { Col, Row, Spinner } from "react-bootstrap";
import StaffCard from "../components/staff-card";

const ViewAllStaff = ({
  staffs,
  isLoading,
}: {
  staffs: Staff[];
  isLoading: boolean;
}) => {
  return (
    <>
      <PageTitle>Staff</PageTitle>

      {isLoading ? (
        <div
          style={{
            height: "70vh",
          }}
          className="w-100 d-flex justify-content-center align-items-center bg-white"
        >
          <Spinner animation="border" color="#000" />
        </div>
      ) : staffs?.length > 0 ? (
        <Row xs={12} md={12} lg={12}>
          {staffs?.map((staff, index) => (
            <Col xs={12} md={6} lg={4} key={index}>
              <StaffCard staff={staff} />
            </Col>
          ))}
        </Row>
      ) : (
        <div
          style={{
            height: "70vh",
          }}
          className="w-100 d-flex justify-content-center align-items-center bg-white border rounded-2 fs-3"
        >
          Aucun staff n'a encore été ajouté
        </div>
      )}
    </>
  );
};

export default ViewAllStaff;
