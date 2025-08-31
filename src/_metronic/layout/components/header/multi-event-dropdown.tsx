import { ChevronsUpDown, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MultiEventDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="multi-event-dropdown" ref={dropdownRef}>
      <button
        id="multi-event-dropdown-button"
        className={isOpen ? "active" : ""}
        onClick={toggleSelect}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div id="multi-event-dropdown-content">
          <img
            src={"/media/eventili/logos/logo.svg"}
            alt=""
            id="multi-event-dropdown-icon"
            width={24}
            height={24}
          />
          <span id="multi-event-dropdown-label">Algeria Fintech</span>
        </div>
        <ChevronsUpDown id="multi-event-dropdown-chevron" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="multi-event-dropdown-list"
            role="listbox"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div id="multi-event-dropdown-current">
              <img
                src={"/media/eventili/logos/logo.svg"}
                alt=""
                width={24}
                height={24}
              />
              <span>Algeria Fintech</span>
            </div>
            <div id="multi-event-dropdown-more">
              <div id="multi-event-dropdown-more-content">
                <Plus size={24} />
                <span>More Events</span>
              </div>
              <span id="multi-event-dropdown-coming-soon">
                <span>Coming Soon</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiEventDropdown;
