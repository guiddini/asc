export enum SlotableType {
  Meeting = "App\\Models\\Meeting",
  Conference = "App\\Models\\Conference",
  Workshop = "App\\Models\\Workshop",
  ProgramEvent = "App\\Models\\ProgramEvent",
}

export type Slot = {
  id: string;
  user_id: string;
  topic: string;
  start_time: string;
  end_time: string;
  slotable_type: SlotableType;
  slotable_id: string;
  created_at: string;
  updated_at: string;
};

export type PublicSlotType = "conference" | "workshop" | "general_event";

type Speaker = {
  id: string;
  name: string;
  position?: string | null;
  avatar?: string | null;
};

export type PublicSlot = {
  id: string;
  type: PublicSlotType;
  title?: string | null;
  location?: string | null;
  start_time: string;
  end_time: string;
  speakers?: Speaker[];
  attendees?: Speaker[];
  side_event_slug?: string | null;
};

export type SlotCheckRequest = {
  receiver_id: string;
  start_time: string;
  end_time: string;
};

export type SlotCheckResponse = {
  available: boolean;
};
