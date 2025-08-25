import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import FloorPlan from "./floor-plan";
import { Stand } from "./stands";

const InteractiveFloorPlan: React.FC = () => {
  const [selectedStand, setSelectedStand] = useState<Stand | null>(null);

  //   const handleStandClick = (stand: Stand) => {
  //     setSelectedStand(stand);
  //   };

  const handleCloseModal = () => {
    setSelectedStand(null);
  };

  return (
    <div>
      <h1>Interactive Floor Plan</h1>
      <FloorPlan />

      <Modal show={!!selectedStand} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStand?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>ID:</strong> {selectedStand?.id}
          </p>
          <p>
            <strong>Description:</strong> {selectedStand?.description}
          </p>
          <p>
            <strong>Size:</strong> {selectedStand?.size}
          </p>
          <p>
            <strong>Reserved:</strong>{" "}
            {selectedStand?.isReserved ? "Yes" : "No"}
          </p>
          {selectedStand?.isReserved && (
            <p>
              <strong>Reserved By:</strong> {selectedStand.reservedBy}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InteractiveFloorPlan;
