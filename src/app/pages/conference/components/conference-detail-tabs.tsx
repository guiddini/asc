// conference-detail-tabs.tsx
import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { Conference } from "../../../types/conference";
import { AttendeesTable } from "./attendees-table";
import { SpeakersTable } from "./speakers-table";

interface ConferenceDetailTabsProps {
  conference: Conference;
}

const ConferenceDetailTabs: React.FC<ConferenceDetailTabsProps> = ({
  conference,
}) => {
  const [activeKey, setActiveKey] = useState("speakers");

  return (
    <Tab.Container
      activeKey={activeKey}
      onSelect={(k) => setActiveKey(k ?? "speakers")}
    >
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link eventKey="speakers">Intervenants</Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link eventKey="attendees">Participants</Nav.Link>
        </Nav.Item>
      </Nav>
      <Tab.Content>
        <Tab.Pane eventKey="speakers">
          <SpeakersTable
            conferenceId={conference.id}
            speakers={conference.speakers}
          />
        </Tab.Pane>

        <Tab.Pane eventKey="attendees">
          <AttendeesTable attendees={conference.attendees} />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

export default ConferenceDetailTabs;
