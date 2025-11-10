import React from "react";
import SpeakerCard from "./speaker-card";

interface SpeakerListProps {
  speakers: {
    id: string;
    avatar: string;
    fname: string;
    lname: string;
  }[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const SpeakerList: React.FC<SpeakerListProps> = ({ speakers, activeIndex, onSelect }) => (
  <>
    {speakers.map((speaker, idx) => (
      <SpeakerCard
        key={speaker.id}
        speaker={speaker}
        isActive={idx === activeIndex}
        onSelect={() => onSelect(idx)}
      />
    ))}
  </>
);

export default SpeakerList;
