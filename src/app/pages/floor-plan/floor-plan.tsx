import React from "react";

const FloorPlan = () => {
  //  const handleClick = (event: React.MouseEvent<SVGElement>) => {
  //    const standId = event.currentTarget.id;
  //    console.log("Target : ", standId);
  //    const stand = stands.find((s) => s.id === standId);
  //    if (stand) {
  //      onStandClick(stand);
  //    }
  //  };

  //  const getStandStyle = (id: string) => {
  //    const stand = stands.find((s) => s.id === id);
  //    if (stand) {
  //      return {
  //        fill: stand.isReserved ? "#7d00ff" : "none",
  //        stroke: "#7d00ff",
  //        className: `stand ${!stand.isReserved ? "non-reserved-stand" : ""}`,
  //      };
  //    }
  //    return {};
  //  };

  return (
    <svg
      id="Calque_1"
      data-name="Calque 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488.67 731.87"
    >
      <rect x="15" y="15" width="458.67" height="701.87" id="stand" />
    </svg>
  );
};

export default FloorPlan;
