import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useScrollNavigation = () => {
  const navigate = useNavigate();

  const navigateAndScroll = useCallback(
    (path: string) => {
      const [route, hash] = path.split("#");

      navigate(route);

      // Wait for the navigation to complete and then scroll
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    },
    [navigate]
  );

  return navigateAndScroll;
};
