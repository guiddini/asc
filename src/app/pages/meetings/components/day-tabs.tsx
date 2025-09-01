import React from "react";
import { Nav, Badge } from "react-bootstrap";

interface DayTabsProps {
  viewType: "meetings" | "requests";
  setViewType: (type: "meetings" | "requests") => void;
  getTotalCounts: { meetings: number; requests: number };
  groupedData: Array<{
    date: string;
    dateDisplay: string;
    dayName: string;
    meetings: any[];
    requests: any[];
  }>;
  activeDay: string;
  setActiveDay: (date: string) => void;
  getDayCount: (dayData: any) => number;
}

const DayTabs: React.FC<DayTabsProps> = ({
  viewType,
  setViewType,
  getTotalCounts,
  groupedData,
  activeDay,
  setActiveDay,
  getDayCount,
}) => {
  return (
    <>
      <Nav.Item className="d-flex align-items-center justify-content-center">
        <Nav.Link
          active={viewType === "meetings"}
          onClick={() => setViewType("meetings")}
          className="px-4"
        >
          <i className="bi bi-calendar-check me-2" />
          My Meetings
          {getTotalCounts.meetings > 0 && (
            <Badge bg="warning" className="ms-2">
              {getTotalCounts.meetings}
            </Badge>
          )}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="d-flex align-items-center justify-content-center">
        <Nav.Link
          active={viewType === "requests"}
          onClick={() => setViewType("requests")}
          className="px-4"
        >
          <i className="bi bi-inbox me-2" />
          Meeting Requests
          {getTotalCounts.requests > 0 && (
            <Badge bg="warning" className="ms-2">
              {getTotalCounts.requests}
            </Badge>
          )}
        </Nav.Link>
      </Nav.Item>

      <Nav
        variant="pills"
        className="justify-content-center mb-4 w-100 mt-3 flex-wrap"
      >
        {groupedData.map((dayData) => (
          <Nav.Item key={dayData.date}>
            <Nav.Link
              active={activeDay === dayData.date}
              onClick={() => setActiveDay(dayData.date)}
              className="px-4"
            >
              <div className="text-center">
                <div className="fw-bold">{dayData.dayName}</div>
                <small className="text-black">
                  {dayData.dateDisplay.split(",")[1]?.trim()}
                </small>
                {getDayCount(dayData) > 0 && (
                  <Badge
                    bg="primary"
                    className="ms-2"
                    style={{ fontSize: "0.7em" }}
                  >
                    {getDayCount(dayData)}
                  </Badge>
                )}
              </div>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </>
  );
};

export default DayTabs;
