import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { createMeeting } from "../../../../apis/meetings";
import { getBookedUserSlot } from "../../../../apis/slot";
import type { UserResponse } from "../../../../types/reducers";
import type { User } from "../../../../types/user";
import {
  getThreeDayRange,
  isSlotAvailable,
  timeSlots,
  type TimeSlot,
} from "../../../meetings/utils/scheduleUtils";

interface BookedSlot {
  id: string;
  user_id: string;
  topic: string;
  start_time: string;
  end_time: string;
  slotable_type: string;
  slotable_id: string;
  created_at: string;
  updated_at: string;
}

export const useMeetingBooking = (targetUser: User) => {
  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );
  const queryClient = useQueryClient();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const threeDayRange = getThreeDayRange();

  // Fetch booked slots for the target user
  const { data: receiverBookedSlots = [] } = useQuery<BookedSlot[]>(
    ["bookedSlots", targetUser.id],
    () => getBookedUserSlot(targetUser.id),
    {
      enabled: !!targetUser.id,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch booked slots for current user
  const { data: currentUserBookedSlots = [] } = useQuery<BookedSlot[]>(
    ["bookedSlots", currentUser?.id],
    () => getBookedUserSlot(currentUser?.id || ""),
    {
      enabled: !!currentUser?.id,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Combine both users' booked slots
  const allBookedSlots = [...receiverBookedSlots, ...currentUserBookedSlots];

  const createMeetingMutation = useMutation(createMeeting, {
    onSuccess: () => {
      queryClient.invalidateQueries("meetings");
      queryClient.invalidateQueries(["bookedSlots", targetUser.id]);
      queryClient.invalidateQueries(["bookedSlots", currentUser?.id]);
      toast.success(`Meeting request sent to ${targetUser.fname}!`);
      handleCloseModal();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create meeting request";
      toast.error(errorMessage);
    },
  });

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTopic("");
    setSelectedDate("");
    setSelectedTimeSlot(null);
    setSelectedLocation("");
  };

  const handleConfirmMeeting = () => {
    if (!topic || !selectedDate || !selectedTimeSlot || !selectedLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startDateTime = `${selectedDate} ${selectedTimeSlot.start}:00`;
    const endDateTime = `${selectedDate} ${selectedTimeSlot.end}:00`;

    if (!isSlotAvailable(startDateTime, endDateTime, allBookedSlots)) {
      toast.error(
        "This time slot is not available for one or both participants. Please select another time."
      );
      return;
    }

    const meetingData = {
      receiver_id: targetUser.id,
      topic: topic,
      start_time: `${selectedDate}T${selectedTimeSlot.start}:00`,
      end_time: `${selectedDate}T${selectedTimeSlot.end}:00`,
      location: selectedLocation,
    };

    createMeetingMutation.mutate(meetingData);
  };

  // Helper functions
  const isTimeSlotBooked = (date: string, slot: TimeSlot): boolean => {
    if (!date || !allBookedSlots.length) return false;
    const slotStartTime = `${date} ${slot.start}:00`;
    const slotEndTime = `${date} ${slot.end}:00`;
    return !isSlotAvailable(slotStartTime, slotEndTime, allBookedSlots);
  };

  const getAvailableSlotsCount = (date: string): number => {
    return timeSlots.filter((slot) => !isTimeSlotBooked(date, slot)).length;
  };

  return {
    // Modal state
    isModalOpen,
    topic,
    selectedDate,
    selectedTimeSlot,
    selectedLocation,

    // Data
    threeDayRange,
    allBookedSlots,

    // Mutations
    createMeetingMutation,

    // Handlers
    handleOpenModal,
    handleCloseModal,
    handleConfirmMeeting,

    // Setters
    setTopic,
    setSelectedDate,
    setSelectedTimeSlot,
    setSelectedLocation,

    // Helper functions
    isTimeSlotBooked,
    getAvailableSlotsCount,
  };
};
