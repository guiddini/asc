import { useState } from "react";
import { useSelector } from "react-redux";
import { UserResponse } from "../types/reducers";

export const useCompleteProfile = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const [show, setShow] = useState("");

  const isTicketInfoCompleted = () => {
    if (user?.user_has_ticket_id !== null) {
      return true;
    } else {
      return false;
    }
  };

  const isCompanyInfoCompleted = () => {
    if (user?.company) {
      return true;
    } else {
      return false;
    }
  };

  const isUserInfoCompleted = () => {
    if (user?.info.is_registered === "1" || user?.info.is_registered === 1) {
      return true;
    } else {
      return false;
    }
  };

  // ida kan exposant na7ilo user type

  const canUserLogin = () => {
    if (user?.can_create_company === 1) {
      if (
        isCompanyInfoCompleted() &&
        isTicketInfoCompleted() &&
        isUserInfoCompleted()
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (isTicketInfoCompleted() && isUserInfoCompleted()) {
        return true;
      } else {
        return false;
      }
    }
  };

  const displayContent = () => {
    if (user?.can_create_company === 1) {
      if (
        !isUserInfoCompleted() &&
        !isTicketInfoCompleted() &&
        !isCompanyInfoCompleted()
      ) {
        setShow("user-info");
      }
      if (
        isUserInfoCompleted() &&
        !isTicketInfoCompleted() &&
        !isCompanyInfoCompleted()
      ) {
        setShow("ticket-info");
      }
      if (
        isUserInfoCompleted() &&
        isTicketInfoCompleted() &&
        !isCompanyInfoCompleted()
      ) {
        setShow("exhibitor-info");
      }
    } else {
      if (!isUserInfoCompleted() && !isTicketInfoCompleted()) {
        setShow("user-info");
      }
      if (isUserInfoCompleted() && !isTicketInfoCompleted()) {
        setShow("ticket-info");
      }
    }
  };

  return {
    isUserInfoCompleted,
    isTicketInfoCompleted,
    isCompanyInfoCompleted,
    canUserLogin,
    displayContent,
    show,
    setShow,
  };
};
