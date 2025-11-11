import { useState } from "react";
import { Button, Card, Col, Nav, Row, Tab, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import {
  showSideEventById,
  getProgramEventsBySideEvent,
  getConferencesBySideEvent,
  getWorkshopsBySideEvent,
  getSideEventAttendees,
} from "../../apis/side-event";
import { useNavigate, useParams } from "react-router-dom";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import {
  SideEvent,
  ProgramEvent,
  Conference,
  Workshop,
  SideEventAttendee,
} from "../../types/side-event";
import getMediaUrl from "../../helpers/getMediaUrl";
import { TableComponent } from "../../components";

const SideEventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: sideEvent, isLoading } = useQuery<SideEvent>(
    ["side-event", id],
    () => showSideEventById(id),
    { enabled: !!id }
  );

  // Program Events Query
  const { data: programEvents, isLoading: programEventsLoading } = useQuery<
    ProgramEvent[]
  >(["program-events", id], () => getProgramEventsBySideEvent(id as string), {
    enabled: !!id && activeTab === "program",
  });

  // Conferences Query
  const { data: conferences, isLoading: conferencesLoading } = useQuery<
    Conference[]
  >(["conferences", id], () => getConferencesBySideEvent(id as string), {
    enabled: !!id && activeTab === "conferences",
  });

  // Workshops Query
  const { data: workshops, isLoading: workshopsLoading } = useQuery<Workshop[]>(
    ["workshops", id],
    () => getWorkshopsBySideEvent(id as string),
    { enabled: !!id && activeTab === "workshops" }
  );

  // Attendees Query
  const { data: attendees, isLoading: attendeesLoading } = useQuery<
    SideEventAttendee[]
  >(["attendees", id], () => getSideEventAttendees(id as string), {
    enabled: !!id && activeTab === "attendees",
  });

  if (isLoading) return <div>Loading...</div>;
  if (!sideEvent) return <div>Side event not found</div>;

  return (
    <KTCard>
      <div className="card-header border-0 pt-6">
        <div className="card-title">
          <h3 className="fw-bolder">Side Event Details</h3>
        </div>
        <div className="card-toolbar">
          <Button
            variant="light"
            className="me-3"
            onClick={() => navigate("/side-events-management")}
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/side-events-management/update/${id}`)}
          >
            Edit
          </Button>
        </div>
      </div>
      <KTCardBody>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(k) => k && setActiveTab(k)}
        >
          <Nav variant="tabs" className="mb-5">
            <Nav.Item>
              <Nav.Link eventKey="overview">Overview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="program">Program Events</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="conferences">Conferences</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="workshops">Workshops</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="attendees">Attendees</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="overview">
              {sideEvent.cover && (
                <div className="mb-5">
                  <img
                    src={getMediaUrl(sideEvent.cover)}
                    alt="Cover"
                    className="img-fluid w-100 rounded"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                </div>
              )}
              <Row className="mb-5">
                <Col md={3}>
                  {sideEvent.logo && (
                    <Card className="mb-4">
                      <Card.Body className="text-center">
                        <img
                          src={getMediaUrl(sideEvent.logo)}
                          alt="Logo"
                          className="img-fluid rounded"
                          style={{ maxHeight: "150px" }}
                        />
                      </Card.Body>
                    </Card>
                  )}
                </Col>
                <Col md={9}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Basic Information</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <strong>Name:</strong> {sideEvent.name}
                          </div>
                          <div className="mb-3">
                            <strong>Location:</strong>{" "}
                            {sideEvent.location || "N/A"}
                          </div>
                          <div className="mb-3">
                            <strong>Date:</strong> {sideEvent.date || "N/A"}
                          </div>
                          <div className="mb-3">
                            <strong>Status:</strong>{" "}
                            <span
                              className={`badge ${
                                sideEvent.status === "published"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {sideEvent.status}
                            </span>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <strong>Website:</strong>{" "}
                            {sideEvent.website ? (
                              <a
                                href={sideEvent.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {sideEvent.website}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </div>
                          <div className="mb-3">
                            <strong>Email:</strong>{" "}
                            {sideEvent.email ? (
                              <a href={`mailto:${sideEvent.email}`}>
                                {sideEvent.email}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </div>
                          <div className="mb-3">
                            <strong>Categories:</strong>{" "}
                            {sideEvent.categories &&
                            sideEvent.categories.length > 0
                              ? sideEvent.categories.map((category, index) => (
                                  <span
                                    key={index}
                                    className="badge bg-light text-dark me-1"
                                  >
                                    {category}
                                  </span>
                                ))
                              : "N/A"}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Card className="mb-5">
                <Card.Header>
                  <Card.Title>Description</Card.Title>
                </Card.Header>
                <Card.Body>
                  {sideEvent.description || "No description available."}
                </Card.Body>
              </Card>

              {/* Gallery at bottom of Overview */}
              {sideEvent.gallery && sideEvent.gallery.length > 0 && (
                <Card>
                  <Card.Header>
                    <Card.Title>Gallery</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-wrap gap-3">
                      {sideEvent.gallery.map((image, index) => (
                        <div key={index}>
                          <img
                            src={getMediaUrl(image)}
                            alt={`Gallery ${index}`}
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                            className="rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="program">
              {programEventsLoading ? (
                <div className="text-center py-5">
                  Loading program events...
                </div>
              ) : programEvents && programEvents.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programEvents.map((event) => (
                      <tr key={event.id}>
                        <td>{event.title}</td>
                        <td>{event.description || "N/A"}</td>
                        <td>{event.location || "N/A"}</td>
                        <td>{new Date(event.start_time).toLocaleString()}</td>
                        <td>{new Date(event.end_time).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5 text-muted">
                  No program events available for this side event.
                </div>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="conferences">
              {conferencesLoading ? (
                <div className="text-center py-5">Loading conferences...</div>
              ) : conferences && conferences.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conferences.map((conf) => (
                      <tr key={conf.id}>
                        <td>{conf.title}</td>
                        <td>{conf.description || "N/A"}</td>
                        <td>{conf.location || "N/A"}</td>
                        <td>{new Date(conf.start_time).toLocaleString()}</td>
                        <td>{new Date(conf.end_time).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5 text-muted">
                  No conferences available for this side event.
                </div>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="workshops">
              {workshopsLoading ? (
                <div className="text-center py-5">Loading workshops...</div>
              ) : workshops && workshops.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshops.map((ws) => (
                      <tr key={ws.id}>
                        <td>{ws.title}</td>
                        <td>{ws.description || "N/A"}</td>
                        <td>{ws.location || "N/A"}</td>
                        <td>{new Date(ws.start_time).toLocaleString()}</td>
                        <td>{new Date(ws.end_time).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5 text-muted">
                  No workshops available for this side event.
                </div>
              )}
            </Tab.Pane>

            {/* Attendees Tab */}
            <Tab.Pane eventKey="attendees">
              {attendeesLoading ? (
                <div className="text-center py-5">Loading attendees...</div>
              ) : attendees && attendees.length > 0 ? (
                <TableComponent
                  columns={
                    [
                      {
                        name: "Avatar",
                        selector: (row: SideEventAttendee) =>
                          row.avatar ? (
                            <div
                              className="me-3 my-2"
                              style={{ width: 40, height: 40 }}
                            >
                              <img
                                alt={`${row.fname} ${row.lname}`}
                                src={getMediaUrl(row.avatar)}
                                style={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "cover",
                                  background: "#fff",
                                  padding: 2,
                                  borderRadius: "50%",
                                  border: "1px solid #e5e7eb",
                                }}
                              />
                            </div>
                          ) : (
                            "-"
                          ),
                        sortable: false,
                        width: "100px",
                      },
                      {
                        name: "Name",
                        selector: (row: SideEventAttendee) =>
                          `${row.fname} ${row.lname}`,
                        sortable: true,
                      },
                      {
                        name: "Email",
                        selector: (row: SideEventAttendee) => (
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        ),
                        sortable: true,
                      },
                      {
                        name: "Phone",
                        selector: (row: SideEventAttendee) => row.phone || "-",
                        sortable: true,
                      },
                    ] as any
                  }
                  data={attendees || []}
                  placeholder="attendees"
                  showSearch
                  searchKeys={["fname", "lname", "email", "phone"]}
                  showExport
                  showCreate={false}
                  isLoading={attendeesLoading}
                />
              ) : (
                <div className="text-center py-5 text-muted">
                  No attendees for this side event yet.
                </div>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </KTCardBody>
    </KTCard>
  );
};

export default SideEventDetails;
