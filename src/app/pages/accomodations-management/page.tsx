import React, { useMemo, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Spinner, Dropdown } from "react-bootstrap";
import toast from "react-hot-toast";
import moment from "moment";
import { TableColumn } from "react-data-table-component";
import {
  getAllAccommodations,
  deleteAccommodation,
} from "../../apis/accommodations";
import { getAllHotels } from "../../apis/hotels";
import { TableComponent } from "../../components";
import { Accommodation } from "../../types/accommodation";
import { Hotel } from "../../types/hotel";
import { CreateAccommodationModal } from "./components/CreateAccommodationModal";
import { UpdateAccommodationModal } from "./components/UpdateAccommodationModal";
import getMediaUrl from "../../helpers/getMediaUrl";
import AsyncSelect from "react-select/async";
import Select, { components, StylesConfig } from "react-select";
import { getAllUsersApi } from "../../apis";
import { GuestAccommodationsModal } from "./components/GuestAccommodationsModal";
import { CompanionAccommodationsModal } from "./components/CompanionAccommodationsModal";
import { ShowCompanionAccommodationModal } from "./components/ShowCompanionAccommodationModal";
import { KTIcon } from "../../../_metronic/helpers";

type UserOption = {
  value: string;
  label: string;
  email?: string;
  avatar?: string | null;
};

const AccommodationsManagementPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [filterHotelId, setFilterHotelId] = useState("");
  const [filterGuestId, setFilterGuestId] = useState("");
  const [filterCompanionId, setFilterCompanionId] = useState("");

  const [guestOptions, setGuestOptions] = useState<UserOption[]>([]);
  const [guestQuery, setGuestQuery] = useState("");
  const [guestHasMore, setGuestHasMore] = useState(true);
  const [guestLoading, setGuestLoading] = useState(false);
  const guestReqIdRef = useRef(0);

  const [companionOptions, setCompanionOptions] = useState<UserOption[]>([]);
  const [companionQuery, setCompanionQuery] = useState("");
  const [companionHasMore, setCompanionHasMore] = useState(true);
  const [companionLoading, setCompanionLoading] = useState(false);
  const companionReqIdRef = useRef(0);

  const [guestModalUserId, setGuestModalUserId] = useState<string | null>(null);
  const [companionModalUserId, setCompanionModalUserId] = useState<
    string | null
  >(null);
  const [showCompanionDetail, setShowCompanionDetail] = useState<{
    userId: string;
    accommodationId: string;
  } | null>(null);

  const { data: hotelsData } = useQuery({
    queryKey: ["accommodations-hotels"],
    queryFn: () => getAllHotels(),
  });

  const hotels: Hotel[] = Array.isArray(hotelsData) ? hotelsData : [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAccommodation(id),
    mutationKey: ["accommodations-delete"],
    onSuccess() {
      toast.success("Accommodation deleted successfully");
      queryClient.invalidateQueries(["accommodations"]);
    },
  });

  const isEmailLike = (q: string) => {
    const s = q.trim();
    return s.includes("@") && s.includes(".");
  };

  const toUserOption = (u: any): UserOption => ({
    label:
      `${u?.fname || ""} ${u?.lname || ""}`.trim() || u?.email || String(u?.id),
    value: String(u?.id),
    avatar: u?.avatar ?? null,
  });

  const fetchUsers = async (
    q: string,
    offset: number
  ): Promise<UserOption[]> => {
    const emailMode = isEmailLike(q);
    const params = emailMode
      ? { nameFilter: "", emailFilter: q, offset }
      : { nameFilter: q, emailFilter: "", offset };
    const data = await getAllUsersApi(params);
    const list = data || [];
    const filtered = emailMode
      ? list.filter(
          (u: any) =>
            String(u.email || "")
              .trim()
              .toLowerCase() === q.trim().toLowerCase()
        )
      : list;
    return filtered.map(toUserOption);
  };

  const handleGuestInputChange = (val: string) => {
    const q = val.trim();
    setGuestQuery(q);
    setGuestLoading(true);
    const reqId = ++guestReqIdRef.current;
    fetchUsers(q, 0).then((initial) => {
      if (reqId !== guestReqIdRef.current) return;
      setGuestOptions(initial);
      setGuestHasMore(!isEmailLike(q) && initial.length > 0);
      setGuestLoading(false);
    });
    return val;
  };

  const handleGuestScrollToBottom = async () => {
    if (!guestHasMore || guestLoading) return;
    setGuestLoading(true);
    const more = await fetchUsers(guestQuery, guestOptions.length);
    setGuestOptions((prev) => [...prev, ...more]);
    setGuestHasMore(more.length > 0);
    setGuestLoading(false);
  };

  const handleCompanionInputChange = (val: string) => {
    const q = val.trim();
    setCompanionQuery(q);
    setCompanionLoading(true);
    const reqId = ++companionReqIdRef.current;
    fetchUsers(q, 0).then((initial) => {
      if (reqId !== companionReqIdRef.current) return;
      setCompanionOptions(initial);
      setCompanionHasMore(!isEmailLike(q) && initial.length > 0);
      setCompanionLoading(false);
    });
    return val;
  };

  const handleCompanionScrollToBottom = async () => {
    if (!companionHasMore || companionLoading) return;
    setCompanionLoading(true);
    const more = await fetchUsers(companionQuery, companionOptions.length);
    setCompanionOptions((prev) => [...prev, ...more]);
    setCompanionHasMore(more.length > 0);
    setCompanionLoading(false);
  };

  const selectStyles: StylesConfig<UserOption, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      height: 40,
      boxShadow: state.isFocused ? base.boxShadow : "none",
    }),
    valueContainer: (base) => ({ ...base, paddingTop: 0, paddingBottom: 0 }),
    singleValue: (base) => ({
      ...base,
      marginTop: 0,
      marginBottom: 0,
      display: "flex",
      alignItems: "center",
    }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  const UserOptionRenderer = (props: any) => (
    <components.Option {...props}>
      <div className="d-flex align-items-center gap-2">
        {props.data.avatar ? (
          <img
            src={getMediaUrl(props.data.avatar)}
            alt=""
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#eef2f7",
            }}
          />
        )}
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  const UserSingleValueRenderer = (props: any) => (
    <components.SingleValue {...props}>
      <div className="d-flex align-items-center gap-2">
        {props.data.avatar ? (
          <img
            src={getMediaUrl(props.data.avatar)}
            alt=""
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#eef2f7",
            }}
          />
        )}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );

  const defaultHotelOptions = useMemo(
    () =>
      hotels.map((h) => ({
        label: h.name,
        value: h.id,
      })),
    [hotels]
  );

  const loadHotelOptions = async (inputValue: string) => {
    try {
      const list = await getAllHotels(inputValue.trim() || undefined);
      return (list || []).map((h) => ({ label: h.name, value: h.id }));
    } catch {
      return [];
    }
  };

  const { data: accommodationsData, isLoading: accommodationsLoading } =
    useQuery({
      queryKey: [
        "accommodations",
        {
          hotel_id: filterHotelId || undefined,
          guest_id: filterGuestId || undefined,
          companion_id: filterCompanionId || undefined,
        },
      ],
      queryFn: () =>
        getAllAccommodations({
          hotel_id: filterHotelId || undefined,
          guest_id: filterGuestId || undefined,
          companion_id: filterCompanionId || undefined,
        }),
    });

  const accommodations: Accommodation[] = Array.isArray(accommodationsData)
    ? accommodationsData
    : [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<Accommodation | null>(
    null
  );

  const columns: TableColumn<Accommodation>[] = useMemo(
    () => [
      {
        name: "Hotel",
        selector: (row) => row.hotel?.name || row.hotel_id,
        sortable: true,
        cell: (row) => (
          <div className="d-flex align-items-center gap-2">
            <img
              src={getMediaUrl(row.hotel?.logo)}
              alt={row.hotel?.name}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                objectFit: "cover",
              }}
            />
            <span>{row.hotel?.name}</span>
          </div>
        ),
      },
      {
        name: "Guest",
        selector: (row) =>
          `${row.guest?.fname} ${row.guest?.lname}`.trim() || row.guest_id,
        sortable: true,
        cell: (row) => {
          const label =
            `${row.guest?.fname} ${row.guest?.lname}`.trim() ||
            row.guest?.email ||
            row.guest_id;
          return (
            <div className="d-flex align-items-center gap-2">
              <img
                src={getMediaUrl(row.guest?.avatar)}
                alt={label}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span>{label}</span>
            </div>
          );
        },
      },
      {
        name: "Companion",
        selector: (row) =>
          `${row.companion?.fname} ${row.companion?.lname}`.trim() ||
          row.companion_id ||
          "",
        sortable: true,
        cell: (row) => {
          const label =
            `${row.companion?.fname} ${row.companion?.lname}`.trim() ||
            row.companion?.email ||
            row.companion_id;
          return (
            <div className="d-flex align-items-center gap-2">
              <img
                src={getMediaUrl(row.companion?.avatar)}
                alt={label}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span>{label}</span>
            </div>
          );
        },
      },
      {
        name: "Check In",
        selector: (row) => row.check_in,
        cell: (row) => moment(row.check_in).format("YYYY-MM-DD"),
        sortable: true,
      },
      {
        name: "Check Out",
        selector: (row) => row.check_out,
        cell: (row) => moment(row.check_out).format("YYYY-MM-DD"),
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <Dropdown placement="top-start">
            <Dropdown.Toggle
              variant="transparent"
              color="#fff"
              id={`accommodation-actions-${row.id}`}
              className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
            >
              <i className="ki-duotone ki-dots-square fs-1">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
              </i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => setShowUpdateModal(row)}
                className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-primary fw-bold m-0 px-5 py-3"
              >
                <KTIcon iconName="pencil" className="fs-1 m-0 text-primary" />
                <span className="text-muted ms-2">Edit</span>
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => setGuestModalUserId(String(row.guest_id))}
                className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info fw-bold m-0 px-5 py-3"
              >
                <KTIcon iconName="home-2" className="fs-1 m-0 text-info" />
                <span className="text-muted ms-2">Guest Accommodations</span>
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() =>
                  row.companion_id &&
                  setCompanionModalUserId(String(row.companion_id))
                }
                disabled={!row.companion_id}
                className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-primary fw-bold m-0 px-5 py-3"
              >
                <KTIcon iconName="home" className="fs-1 m-0 text-primary" />
                <span className="text-muted ms-2">Companion Accommodations</span>
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() =>
                  row.companion_id &&
                  setShowCompanionDetail({
                    userId: String(row.companion_id),
                    accommodationId: String(row.id),
                  })
                }
                disabled={!row.companion_id}
                className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-success fw-bold m-0 px-5 py-3"
              >
                <KTIcon iconName="profile-user" className="fs-1 m-0 text-success" />
                <span className="text-muted ms-2">Companion Details</span>
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => deleteMutation.mutate(row.id)}
                disabled={deleteMutation.isLoading}
                className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-danger fw-bold m-0 px-5 py-3"
              >
                {deleteMutation.isLoading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <KTIcon iconName="trash" className="fs-1 m-0 text-danger" />
                )}
                <span className="text-muted ms-2">
                  {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ),
        width: "280px",
      },
    ],
    [deleteMutation.isLoading]
  );

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-6">
        <h2 className="mb-0">Accommodations Management</h2>
      </div>

      <div className="card mb-5">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-4">
              <label className="form-label">Hotel</label>
              <AsyncSelect
                cacheOptions
                defaultOptions={defaultHotelOptions}
                loadOptions={loadHotelOptions}
                value={
                  filterHotelId
                    ? defaultHotelOptions.find(
                        (opt) => opt.value === filterHotelId
                      ) || null
                    : null
                }
                onChange={(opt: any) => setFilterHotelId(opt?.value || "")}
                isClearable
                placeholder="Filter by hotel name"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Guest</label>
              <Select
                options={guestOptions}
                components={{
                  Option: UserOptionRenderer,
                  SingleValue: UserSingleValueRenderer,
                }}
                styles={selectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                value={
                  filterGuestId
                    ? guestOptions.find((o) => o.value === filterGuestId) ||
                      null
                    : null
                }
                onInputChange={(val) => handleGuestInputChange(val)}
                onMenuOpen={() => {
                  if (guestOptions.length === 0) {
                    setGuestLoading(true);
                    const reqId = ++guestReqIdRef.current;
                    fetchUsers("", 0).then((initial) => {
                      if (reqId !== guestReqIdRef.current) return;
                      setGuestOptions(initial);
                      setGuestHasMore(initial.length > 0);
                      setGuestLoading(false);
                    });
                  }
                }}
                onMenuScrollToBottom={handleGuestScrollToBottom}
                isLoading={guestLoading}
                onChange={(opt: any) => setFilterGuestId(opt?.value || "")}
                isClearable
                placeholder="Filter by guest"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Companion</label>
              <Select
                options={companionOptions}
                components={{
                  Option: UserOptionRenderer,
                  SingleValue: UserSingleValueRenderer,
                }}
                styles={selectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                menuPlacement="auto"
                value={
                  filterCompanionId
                    ? companionOptions.find(
                        (o) => o.value === filterCompanionId
                      ) || null
                    : null
                }
                onInputChange={(val) => handleCompanionInputChange(val)}
                onMenuOpen={() => {
                  if (companionOptions.length === 0) {
                    setCompanionLoading(true);
                    const reqId = ++companionReqIdRef.current;
                    fetchUsers("", 0).then((initial) => {
                      if (reqId !== companionReqIdRef.current) return;
                      setCompanionOptions(initial);
                      setCompanionHasMore(initial.length > 0);
                      setCompanionLoading(false);
                    });
                  }
                }}
                onMenuScrollToBottom={handleCompanionScrollToBottom}
                isLoading={companionLoading}
                onChange={(opt: any) => setFilterCompanionId(opt?.value || "")}
                isClearable
                placeholder="Filter by companion"
              />
            </div>
          </div>
        </div>
      </div>

      <TableComponent
        data={accommodations}
        columns={columns}
        placeholder="Accommodations"
        onAddClick={() => setShowCreateModal(true)}
        isLoading={accommodationsLoading}
        showCreate
        showExport
        pagination
        searchKeys={[
          "hotel.name",
          "guest.fname",
          "guest.lname",
          "companion.fname",
          "companion.lname",
          "check_in",
          "check_out",
        ]}
      />

      {showCreateModal && (
        <CreateAccommodationModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries(["accommodations"]);
          }}
          hotels={hotels}
        />
      )}

      {showUpdateModal && (
        <UpdateAccommodationModal
          accommodation={showUpdateModal}
          show={!!showUpdateModal}
          onHide={() => setShowUpdateModal(null)}
          onSuccess={() => {
            setShowUpdateModal(null);
            queryClient.invalidateQueries(["accommodations"]);
          }}
          hotels={hotels}
        />
      )}

      {guestModalUserId && (
        <GuestAccommodationsModal
          isOpen={true}
          onClose={() => setGuestModalUserId(null)}
          userId={guestModalUserId}
        />
      )}

      {companionModalUserId && (
        <CompanionAccommodationsModal
          isOpen={true}
          onClose={() => setCompanionModalUserId(null)}
          userId={companionModalUserId}
          onOpenAccommodation={(accommodationId) =>
            setShowCompanionDetail({
              userId: companionModalUserId,
              accommodationId,
            })
          }
        />
      )}

      {showCompanionDetail && (
        <ShowCompanionAccommodationModal
          isOpen={true}
          onClose={() => setShowCompanionDetail(null)}
          userId={showCompanionDetail.userId}
          accommodationId={showCompanionDetail.accommodationId}
        />
      )}
    </div>
  );
};

export default AccommodationsManagementPage;
