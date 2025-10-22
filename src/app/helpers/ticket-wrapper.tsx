interface TicketWrapperProps {
  children: React.ReactNode;
}

export const TicketWrapper: React.FC<TicketWrapperProps> = ({ children }) => {
  return <>{children}</>;
};
