import SharedLink from "./components/shared-link";
import { useQuery } from "react-query";
import { getSharedTicketListApi } from "../../../apis/ticket-sharing";

interface SharedTicket {
  id: string;
  total_tickets_count: number;
  remaining_tickets_count: number;
  title: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const SharedLinksPage = () => {
  const { data, isLoading, error } = useQuery({
    queryFn: getSharedTicketListApi,
    queryKey: ["shared-tickets"],
  });

  const list: SharedTicket[] = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading shared tickets</div>;
  }

  return (
    <div>
      {list &&
        list.map((ticket) => (
          <SharedLink
            key={ticket.id}
            id={ticket.id}
            title={ticket.title}
            remaining={ticket.remaining_tickets_count}
            total={ticket.total_tickets_count}
            isActive={ticket.status === "Active"}
            createdAt={ticket.created_at}
          />
        ))}
    </div>
  );
};

export default SharedLinksPage;
