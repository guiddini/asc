import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
// removed generic filter dropdown; using custom menu instead
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import type { UserResponse } from "../../../types/reducers";
import type { Message, MessagesPage } from "../../../types/conversation";
import { getPusher } from "../../../helpers/pusherClient";
import {
  getConversation,
  getMessages,
  sendMessage as sendMessageApi,
  markMessageAsRead,
  deleteConversation,
} from "../../../apis/conversation";

type Props = {
  conversationId?: string;
};

const Messenger: FC<Props> = ({ conversationId }) => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { data: conversation, isLoading: loadingConv } = useQuery(
    ["conversation", conversationId],
    () => getConversation(String(conversationId)),
    { enabled: !!conversationId }
  );

  const { data: messagesPage, isLoading: loadingMsgs } = useQuery(
    ["messages", conversationId],
    () => getMessages(String(conversationId), { per_page: 100 }),
    {
      enabled: !!conversationId,
      onSuccess: async (page) => {
        const unread = (page.data || []).filter(
          (m: Message) => !m.reads?.some((r) => r.user_id === user?.id)
        );
        await Promise.allSettled(
          unread.map((m) => markMessageAsRead(String(m.id)))
        );
      },
    }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesPage?.data?.length]);

  // Subscribe to realtime conversation events via Pusher private channel
  useEffect(() => {
    if (!conversationId) return;
    const pusher = getPusher();
    const channelName = `private-conversation.${conversationId}`;
    const channel = pusher.subscribe(channelName);

    const handleIncoming = (payload: any) => {
      const raw = payload?.message ?? payload;
      const newMsg: Message = {
        ...raw,
        conversation_id: String(raw?.conversation_id),
      };

      console.log("New message received:", newMsg);

      queryClient.setQueryData(
        ["messages", conversationId],
        (old: MessagesPage | undefined) => {
          if (!old || !Array.isArray(old.data)) {
            return { data: [newMsg] } as MessagesPage;
          }
          return {
            ...old,
            // Prepend so newest is first when data is latest->old
            data: [...(old.data || []), newMsg],
          } as MessagesPage;
        }
      );

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const events = [
      // Match backend event name from your logs
      "App\\Events\\NewMessageSent",
      // Common variants just in case
      "NewMessageSent",
      "App\\Events\\MessageSent",
      "MessageSent",
      "message.sent",
      "App\\Events\\MessageCreated",
      "MessageCreated",
      "message.created",
    ];
    events.forEach((evt) => channel.bind(evt, handleIncoming));

    return () => {
      events.forEach((evt) => channel.unbind(evt, handleIncoming));
      try {
        pusher.unsubscribe(channelName);
      } catch (_) {}
    };
  }, [conversationId, queryClient]);

  const sendMutation = useMutation(
    (payload: { content: string }) =>
      sendMessageApi(String(conversationId), payload),
    {
      onSuccess: () => {
        setMessage("");
        queryClient.invalidateQueries(["messages", conversationId]);
      },
    }
  );

  const deleteConversationMutation = useMutation(
    () => deleteConversation(String(conversationId)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["conversations"]);
      },
    }
  );

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!message.trim() || !conversationId) return;
      sendMutation.mutate({ content: message.trim() });
    }
  };

  const participantsNames = useMemo(() => {
    const parts = conversation?.conversation?.participants || [];
    return parts
      .map((p) => `${p.fname ?? ""} ${p.lname ?? ""}`.trim())
      .filter(Boolean)
      .join(", ");
  }, [conversation]);

  const title =
    conversation?.conversation?.title || participantsNames || "Conversation";
  const messages = messagesPage?.data || [];

  return (
    <div className="flex-lg-row-fluid ms-lg-7 ms-xl-10 d-flex flex-column">
      <div
        className="card flex-grow-1 d-flex flex-column"
        id="kt_chat_messenger "
        style={{ maxHeight: "70vh" }}
      >
        <div className="card-header" id="kt_chat_messenger_header">
          <div className="card-title">
            <div className="symbol-group symbol-hover"></div>
            <div className="d-flex justify-content-center flex-column me-3">
              <a
                href="#"
                className="fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1"
                onClick={(e) => e.preventDefault()}
              >
                {title}
              </a>
              <div className="mb-0 lh-1">
                <span className="badge badge-success badge-circle w-10px h-10px me-1"></span>
                <span className="fs-7 fw-bold text-gray-500">Active</span>
              </div>
            </div>
          </div>
          <div className="card-toolbar">
            <div className="me-n3">
              <button
                className="btn btn-sm btn-icon btn-active-light-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
                disabled={!conversationId}
                onClick={(e) => e.preventDefault()}
                aria-label="Conversation options"
                title="Options"
              >
                <i className="bi bi-three-dots fs-2"></i>
              </button>
              <div
                className="menu menu-sub menu-sub-dropdown w-200px"
                data-kt-menu="true"
              >
                <div className="px-5 py-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-light-danger w-100"
                    onClick={() => deleteConversationMutation.mutate()}
                    disabled={
                      !conversationId || deleteConversationMutation.isLoading
                    }
                  >
                    {deleteConversationMutation.isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    Delete Conversation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!conversationId ? (
          <div
            className="card-body d-flex align-items-center justify-content-center text-muted"
            style={{ minHeight: 300 }}
          >
            Select a conversation to view messages.
          </div>
        ) : loadingConv || loadingMsgs ? (
          <div
            className="card-body d-flex align-items-center justify-content-center"
            style={{ minHeight: 300 }}
          >
            <span className="spinner-border"></span>
          </div>
        ) : (
          <>
            <div
              className="card-body flex-grow-1"
              id="kt_chat_messenger_body"
              style={{ overflowY: "auto", minHeight: 0 }}
            >
              <div className="me-n5 pe-5">
                {messages.length === 0 && (
                  <div className="text-center text-muted py-10">
                    No messages yet.
                  </div>
                )}

                {messages.map((m, index) => {
                  const mine = String(m.user_id) === String(user?.id);
                  const contentClass = mine
                    ? "justify-content-end"
                    : "justify-content-start";
                  const alignItemsClass = mine
                    ? "align-items-end"
                    : "align-items-start";
                  const otherAvatar = toAbsoluteUrl("/media/avatars/blank.png");
                  return (
                    <div
                      key={`message${index}`}
                      className={`d-flex ${contentClass} mb-10`}
                    >
                      <div className={`d-flex flex-column ${alignItemsClass}`}>
                        <div className="d-flex align-items-center mb-2">
                          {!mine ? (
                            <>
                              <div className="symbol symbol-35px symbol-circle">
                                <img alt="Pic" src={otherAvatar} />
                              </div>
                              <div className="ms-3">
                                <a
                                  href="#"
                                  className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  {participantsNames || "User"}
                                </a>
                                <span className="text-muted fs-7 mb-1">
                                  {m.created_at?.slice(0, 16)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="me-3">
                                <span className="text-muted fs-7 mb-1">
                                  {m.created_at?.slice(0, 16)}
                                </span>
                                <a
                                  href="#"
                                  className="fs-5 fw-bolder text-gray-900 text-hover-primary ms-1"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  You
                                </a>
                              </div>
                              <div className="symbol symbol-35px symbol-circle">
                                <img
                                  alt="Pic"
                                  src={toAbsoluteUrl(
                                    "/media/avatars/blank.png"
                                  )}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className={`p-5 rounded ${
                            mine ? "bg-primary text-white" : "bg-light-success"
                          } fw-bold mw-lg-400px ${
                            mine ? "text-end" : "text-start"
                          }`}
                          data-kt-element="message-text"
                        >
                          {m.type === "file" && m.metadata?.url ? (
                            <a
                              href={String(m.metadata.url)}
                              target="_blank"
                              rel="noreferrer"
                              className={mine ? "text-white" : "text-primary"}
                            >
                              Download file
                            </a>
                          ) : (
                            <>{m.content}</>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="card-footer pt-4" id="kt_chat_messenger_footer">
              <textarea
                className="form-control form-control-flush mb-3"
                rows={1}
                data-kt-element="input"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onEnterPress}
              ></textarea>
              <div className="d-flex flex-stack">
                <div className="d-flex align-items-center me-2">
                  <button
                    className="btn btn-sm btn-icon btn-active-light-primary me-1"
                    type="button"
                    data-bs-toggle="tooltip"
                    title="Coming soon"
                  >
                    <i className="bi bi-paperclip fs-3"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-icon btn-active-light-primary me-1"
                    type="button"
                    data-bs-toggle="tooltip"
                    title="Coming soon"
                  >
                    <i className="bi bi-upload fs-3"></i>
                  </button>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-kt-element="send"
                    onClick={() =>
                      message.trim() &&
                      sendMutation.mutate({ content: message.trim() })
                    }
                    disabled={sendMutation.isLoading}
                  >
                    {sendMutation.isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messenger;
