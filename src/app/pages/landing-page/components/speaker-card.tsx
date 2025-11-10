import React from "react";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface SpeakerCardProps {
  speaker: { id: string; avatar: string; fname: string; lname: string };
  isActive?: boolean;
  onSelect?: () => void;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, isActive, onSelect }) => {
  return (
    <div data-card-wrap>
      <div
        data-card
        data-active={isActive ? "true" : "false"}
        onClick={onSelect}
      >
        <div data-avatar>
          {speaker.avatar ? (
            <img
              src={getMediaUrl(speaker.avatar)}
              alt={`${speaker.fname} ${speaker.lname}`}
              width={240}
              height={340}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <img
              src={"/speakers/1.png"}
              alt={`${speaker.fname} ${speaker.lname}`}
              width={240}
              height={340}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          <div data-avatar-overlay></div>
        </div>
      </div>
      <div data-label>
        <div data-name>{speaker.fname} {speaker.lname}</div>
      </div>
    </div>
  );
};

export default SpeakerCard;
