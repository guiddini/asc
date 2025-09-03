// utils/agendaUtils.ts
import React from "react";

export interface Day {
  date: string; // ISO string YYYY-MM-DD
  display: string; // e.g. "dimanche 31 août"
  fullDate: Date;
}

export const getThreeDayRange = (): Day[] => {
  const today = new Date();
  const days: Day[] = [];

  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0],
      display: date.toLocaleDateString("fr-FR", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      fullDate: date,
    });
  }

  return days;
};

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
  "Salle de conférence A",
  "Salle de conférence B",
  "Salle de réunion 1",
  "Salle de réunion 2",
  "Salle du conseil",
  "Salon exécutif",
  "Espace de coworking",
  "Bureau privé",
  "Réunion virtuelle",
  "Café - Rez-de-chaussée",
  "Zone de réception",
  "Laboratoire d'innovation",
];

// Format Meeting Date + Time nicely
export const formatMeetingDateTime = (date: string, time: string) => {
  if (!date || !time) return "";
  const dt = new Date(`${date}T${time}`);
  return dt.toLocaleString("fr-FR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Check if slot is available compared to booked slots
export const isSlotAvailable = (
  slotStart: string,
  slotEnd: string,
  bookedSlots: Array<{ start_time: string; end_time: string }>
): boolean => {
  const slotStartMs = new Date(slotStart).getTime();
  const slotEndMs = new Date(slotEnd).getTime();

  return !bookedSlots.some(({ start_time, end_time }) => {
    const bookedStartMs = new Date(start_time).getTime();
    const bookedEndMs = new Date(end_time).getTime();
    return (
      (slotStartMs >= bookedStartMs && slotStartMs < bookedEndMs) ||
      (slotEndMs > bookedStartMs && slotEndMs <= bookedEndMs) ||
      (slotStartMs <= bookedStartMs && slotEndMs >= bookedEndMs)
    );
  });
};
