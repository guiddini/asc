import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { AttendeesTable } from "./attendees-table";
import { SpeakersTable } from "./speakers-table";
import { Workshop } from "../../../types/workshop";

interface WorkshopDetailTabsProps {
  workshop: Workshop;
}

const WorkshopDetailTabs: React.FC<WorkshopDetailTabsProps> = ({
  workshop,
}) => {
  const [activeKey, setActiveKey] = useState("speakers");

  return (
    <Tab.Container
      activeKey={activeKey}
      onSelect={(k) => setActiveKey(k ?? "speakers")}
    >
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link eventKey="speakers">Speakers</Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link eventKey="attendees">Attendees</Nav.Link>
        </Nav.Item>
      </Nav>
      <Tab.Content>
        <Tab.Pane eventKey="speakers">
          <SpeakersTable
            workshopId={workshop.id}
            speakers={workshop.speakers}
          />
        </Tab.Pane>

        <Tab.Pane eventKey="attendees">
          <AttendeesTable attendees={workshop.attendees} />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

export default WorkshopDetailTabs;
