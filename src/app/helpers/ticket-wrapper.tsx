import { useQuery } from "react-query";
import { reAssignMostExpensiveTicketApi } from "../apis";
import { useSelector } from "react-redux";
import { UserResponse } from "../types/reducers";
import PageLoading from "../components/page-loading";

interface TicketWrapperProps {
  children: React.ReactNode;
}

export const TicketWrapper: React.FC<TicketWrapperProps> = ({ children }) => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const { isLoading } = useQuery({
    queryFn: reAssignMostExpensiveTicketApi,
    queryKey: ["reAssignMostExpensiveTicketApi"],
    enabled: !!user,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <PageLoading />;
  }

  return <>{children}</>;
};
