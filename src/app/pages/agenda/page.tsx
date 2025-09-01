import React, { useState, useMemo } from "react";
import { Card, Col, Container, Row, Spinner, Alert } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useQuery } from "react-query";
import { getMyBookedSlot } from "../../apis/slot";
import type { Slot } from "../../types/slot";
import { getThreeDayRange } from "../meetings/utils/scheduleUtils";
import SlotDetailModal from "./components/slot-details-modal";

const AgendaPage: React.FC = () => {
  const {
    data: slots = [],
    isLoading,
    error,
  } = useQuery<Slot[]>(["my-agenda"], getMyBookedSlot);

  const threeDayRange = getThreeDayRange();

  const [selectedSlot, setSelectedSlot] = useState<Slot | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const initialDate = threeDayRange[0].date;

  // Convert slots to FullCalendar events
  const events = useMemo(
    () =>
      slots.map((slot) => ({
        id: slot.id,
        title: slot.topic,
        start: slot.start_time,
        end: slot.end_time,
        backgroundColor:
          slot.slotable_type === "App\\Models\\Conference"
            ? "var(--bs-info)"
            : slot.slotable_type === "App\\Models\\Workshop"
            ? "var(--bs-success)"
            : "var(--bs-primary)",
        borderColor:
          slot.slotable_type === "App\\Models\\Conference"
            ? "var(--bs-info)"
            : slot.slotable_type === "App\\Models\\Workshop"
            ? "var(--bs-success)"
            : "var(--bs-primary)",
      })),
    [slots]
  );

  // Event click handler to show slot details
  const handleEventClick = (clickInfo: any) => {
    const slot = slots.find((s) => s.id === clickInfo.event.id);
    if (slot) {
      setSelectedSlot(slot);
      setShowModal(true);
    }
  };

  return (
    <Container fluid className="p-3">
      <Row className="justify-content-center">
        <Col xs={12} lg={12}>
          <Card>
            <Card.Body>
              {isLoading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" />
                </div>
              ) : error ? (
                <Alert variant="danger" className="text-center">
                  Failed to load agenda.
                </Alert>
              ) : (
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGrid"
                  initialDate={initialDate}
                  events={events}
                  headerToolbar={false}
                  allDaySlot={false}
                  height={500}
                  slotMinTime="07:00:00"
                  slotMaxTime="21:00:00"
                  validRange={{
                    start: threeDayRange[0].date,
                    end: (() => {
                      const d = new Date(threeDayRange[2].date);
                      d.setDate(d.getDate() + 1);
                      return d.toISOString().split("T")[0];
                    })(),
                  }}
                  views={{
                    timeGrid: {
                      type: "timeGrid",
                      duration: { days: 3 },
                      dayCount: 3,
                    },
                  }}
                  eventClick={handleEventClick}
                  contentHeight={450}
                  slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedSlot && (
        <SlotDetailModal
          show={showModal}
          onHide={() => setShowModal(false)}
          slot={selectedSlot}
        />
      )}
    </Container>
  );
};

export default AgendaPage;
