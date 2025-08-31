// src/utils/scheduleUtils.ts

export interface Day {
  date: string; // ISO string YYYY-MM-DD
  display: string; // e.g. "Sunday, August 31"
  fullDate: Date;
}

export const getThreeDayRange = (): Day[] => {
  const today = new Date();
  const days: Day[] = [];

  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0], // YYYY-MM-DD format
      display: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      fullDate: date,
    });
  }

  return days;
};

// Time slots with 30-minute intervals, each representing start-end time
export interface TimeSlot {
  start: string;
  end: string;
  display: string;
}

export const timeSlots: TimeSlot[] = [
  { start: "08:00", end: "08:30", display: "08:00-08:30" },
  { start: "08:30", end: "09:00", display: "08:30-09:00" },
  { start: "09:00", end: "09:30", display: "09:00-09:30" },
  { start: "09:30", end: "10:00", display: "09:30-10:00" },
  { start: "10:00", end: "10:30", display: "10:00-10:30" },
  { start: "10:30", end: "11:00", display: "10:30-11:00" },
  { start: "11:00", end: "11:30", display: "11:00-11:30" },
  { start: "11:30", end: "12:00", display: "11:30-12:00" },
  { start: "12:00", end: "12:30", display: "12:00-12:30" },
  { start: "12:30", end: "13:00", display: "12:30-13:00" },
  { start: "13:00", end: "13:30", display: "13:00-13:30" },
  { start: "13:30", end: "14:00", display: "13:30-14:00" },
  { start: "14:00", end: "14:30", display: "14:00-14:30" },
  { start: "14:30", end: "15:00", display: "14:30-15:00" },
  { start: "15:00", end: "15:30", display: "15:00-15:30" },
  { start: "15:30", end: "16:00", display: "15:30-16:00" },
  { start: "16:00", end: "16:30", display: "16:00-16:30" },
  { start: "16:30", end: "17:00", display: "16:30-17:00" },
  { start: "17:00", end: "17:30", display: "17:00-17:30" },
  { start: "17:30", end: "18:00", display: "17:30-18:00" },
  { start: "18:00", end: "18:30", display: "18:00-18:30" },
  { start: "18:30", end: "19:00", display: "18:30-19:00" },
  { start: "19:00", end: "19:30", display: "19:00-19:30" },
  { start: "19:30", end: "20:00", display: "19:30-20:00" },
  { start: "20:00", end: "20:30", display: "20:00-20:30" },
  { start: "20:30", end: "21:00", display: "20:30-21:00" },
  { start: "21:00", end: "21:30", display: "21:00-21:30" },
  { start: "21:30", end: "22:00", display: "21:30-22:00" },
  { start: "22:00", end: "22:30", display: "22:00-22:30" },
  { start: "22:30", end: "23:00", display: "22:30-23:00" },
  { start: "23:00", end: "23:30", display: "23:00-23:30" },
  { start: "23:30", end: "00:00", display: "23:30-00:00" },
];

export const locations: string[] = [
  "Conference Room A",
  "Conference Room B",
  "Meeting Room 1",
  "Meeting Room 2",
  "Boardroom",
  "Executive Lounge",
  "Co-working Space",
  "Private Office",
  "Virtual Meeting",
  "Coffee Shop - Ground Floor",
  "Reception Area",
  "Innovation Lab",
];

export const formatMeetingDateTime = (date: string, time: string): string => {
  if (!date || !time) return "";
  const meetingDate = new Date(`${date}T${time}`);
  return meetingDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Utility function to check if a time slot is available
export const isSlotAvailable = (
  slotStart: string,
  slotEnd: string,
  bookedSlots: Array<{ start_time: string; end_time: string }>
): boolean => {
  const slotStartTime = new Date(slotStart).getTime();
  const slotEndTime = new Date(slotEnd).getTime();

  return !bookedSlots.some(({ start_time, end_time }) => {
    const bookedStart = new Date(start_time).getTime();
    const bookedEnd = new Date(end_time).getTime();

    // Check for any overlap
    return (
      (slotStartTime >= bookedStart && slotStartTime < bookedEnd) ||
      (slotEndTime > bookedStart && slotEndTime <= bookedEnd) ||
      (slotStartTime <= bookedStart && slotEndTime >= bookedEnd)
    );
  });
};
