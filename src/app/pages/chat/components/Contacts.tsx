import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { KTIcon } from "../../../../_metronic/helpers";
import { getUserConversations } from "../../../apis/conversation";
import type {
  Conversation,
  ConversationsPage,
} from "../../../types/conversation";
import getMediaUrl from "../../../helpers/getMediaUrl";

// Simple debounced value hook
const useDebouncedValue = <T,>(value: T, delay = 400) => {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

type Props = {
  selectedId?: string;
  onSelect: (id: string) => void;
};

const initialsOf = (fullName?: string) => {
  if (!fullName) return "U";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (
    parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)
  ).toUpperCase();
};

const displayNameFor = (conv: Conversation) => {
  if (conv.title) return conv.title;
  const names = (conv.participants || [])
    .map((p) => `${p.fname ?? ""} ${p.lname ?? ""}`.trim())
    .filter(Boolean);
  return names.join(", ") || "Untitled";
};

const updatedText = (conv: Conversation) => conv.updated_at?.slice(0, 10) ?? "";

export const Contacts: FC<Props> = ({ selectedId, onSelect }) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  const { data, isLoading, isError } = useQuery<ConversationsPage>(
    ["conversations", debouncedSearch],
    () => getUserConversations({ per_page: 50, search: debouncedSearch }),
    { keepPreviousData: true }
  );

  return (
    <div className="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0">
      <div className="card card-flush">
        <div className="card-header pt-7" id="kt_chat_contacts_header">
          <form className="w-100 position-relative" autoComplete="off">
            <KTIcon
              iconName="magnifier"
              className="fs-2 text-lg-1 text-gray-500 position-absolute top-50 ms-5 translate-middle-y"
            />

            <input
              type="text"
              className="form-control form-control-solid px-15"
              name="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="card-body pt-5" id="kt_chat_contacts_body">
          <div
            className="scroll-y me-n5 pe-5 h-200px h-lg-auto"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header"
            data-kt-scroll-wrappers="#kt_content, #kt_chat_contacts_body"
            data-kt-scroll-offset="0px"
          >
            {isLoading && (
              <div className="d-flex align-items-center justify-content-center py-10">
                <span className="spinner-border"></span>
              </div>
            )}
            {(isError || !data) && !isLoading && (
              <div className="text-center text-muted py-10">
                Failed to load conversations.
              </div>
            )}
            {data?.data?.length === 0 && !isLoading && (
              <div className="text-center text-muted py-10">
                No conversations yet.
              </div>
            )}

            {(data?.data || []).map((conv) => {
              const title = displayNameFor(conv);
              const first = (conv.participants || [])[0];
              const name = `${first?.fname ?? ""} ${first?.lname ?? ""}`.trim();
              const initials = initialsOf(name || title);

              const isSelected = selectedId === conv.id;
              return (
                <div
                  key={conv.id}
                  className={`d-flex flex-stack py-4 cursor-pointer ${
                    isSelected ? "bg-light-primary rounded" : ""
                  }`}
                  onClick={() => onSelect(conv.id)}
                >
                  <div className="d-flex align-items-center">
                    <div className="symbol symbol-45px symbol-circle overflow-hidden flex-shrink-0">
                      <img
                        alt={name || title}
                        src={getMediaUrl(first?.avatar)}
                        width={45}
                        height={45}
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <div className="ms-5">
                      <a
                        href="#"
                        className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2"
                        onClick={(e) => e.preventDefault()}
                      >
                        {title}
                      </a>
                      <div className="fw-bold text-gray-500">
                        {first?.email ?? ""}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column align-items-end ms-2">
                    <span className="text-muted fs-7 mb-1">
                      {updatedText(conv)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
