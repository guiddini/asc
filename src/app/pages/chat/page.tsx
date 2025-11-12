import { useEffect, useMemo, useState } from "react";
import { Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import {
  createConversation,
  
} from "../../apis/conversation";
import Contacts from "./components/Contacts";
import Messenger from "./components/Messenger";

function useQueryParam() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ChatPage: React.FC = () => {
  const params = useQueryParam();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | undefined>(params.get("conversation") || undefined);
  const queryClient = useQueryClient();

  // Create conversation if `to` is provided
  const to = params.get("to");
  const createMutation = useMutation((participant_id: string) => createConversation({ participant_id }), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(["conversations"]);
      const id = res.conversation.id;
      const qp = new URLSearchParams(params);
      qp.delete("to");
      qp.set("conversation", id);
      navigate({ search: `?${qp.toString()}` }, { replace: true });
      setSelected(id);
    },
  });

  useEffect(() => {
    if (to && !selected && !createMutation.isLoading) {
      createMutation.mutate(to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  const handleSelect = (id: string) => {
    const qp = new URLSearchParams(params);
    qp.set("conversation", id);
    navigate({ search: `?${qp.toString()}` });
    setSelected(id);
  };

  return (
    <div className="d-flex flex-column flex-lg-row py-3">
      <Contacts selectedId={selected} onSelect={handleSelect} />
      <Messenger conversationId={selected} />
    </div>
  );
};

export default ChatPage;