import React, { useMemo, useState, useRef, useEffect } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import moment from "moment";
import { useMutation } from "react-query";
import AsyncSelect from "react-select/async";
import Select, { components, StylesConfig } from "react-select";

import { updateAccommodation } from "../../../apis/accommodations";
import { getAllHotels } from "../../../apis/hotels";
import { getAllUsersApi } from "../../../apis/user";
import { Accommodation } from "../../../types/accommodation";
import { Hotel } from "../../../types/hotel";
import getMediaUrl from "../../../helpers/getMediaUrl";

type UpdateAccommodationRequest = {
  hotel_id?: string;
  guest_id?: string;
  companion_id?: string | null;
  check_in?: string;
  check_out?: string;
};

type UserOption = {
  value: string;
  label: string;
  email?: string;
  avatar?: string | null;
};

const selectStyles: StylesConfig<UserOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    height: 40,
    boxShadow: state.isFocused ? base.boxShadow : "none",
  }),
  valueContainer: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  singleValue: (base) => ({
    ...base,
    marginTop: 0,
    marginBottom: 0,
    display: "flex",
    alignItems: "center",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
};

export const UpdateAccommodationModal: React.FC<{
  accommodation: Accommodation;
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  hotels: Hotel[];
}> = ({ accommodation, show, onHide, onSuccess, hotels }) => {
  const [payload, setPayload] = useState<UpdateAccommodationRequest>({
    hotel_id: accommodation.hotel_id,
    guest_id: accommodation.guest_id,
    companion_id: accommodation.companion_id || undefined,
    check_in: accommodation.check_in,
    check_out: accommodation.check_out,
  });

  const { mutateAsync, isLoading } = useMutation(
    (req: UpdateAccommodationRequest) =>
      updateAccommodation(accommodation.id, req),
    {
      onSuccess: () => {
        toast.success("Accommodation updated successfully");
        onSuccess();
      },
    }
  );

  const defaultHotelOptions = useMemo(
    () =>
      (hotels || []).map((h) => ({
        label: h.name,
        value: h.id,
      })),
    [hotels]
  );

  const loadHotelOptions = async (inputValue: string) => {
    try {
      const list = await getAllHotels(inputValue?.trim() || undefined);
      return (list || []).map((h) => ({ label: h.name, value: h.id }));
    } catch {
      return [];
    }
  };

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

  const isEmailLike = (q: string) => {
    const s = (q || "").trim();
    return s.includes("@") && s.includes(".");
  };

  const toUserOption = (u: any): UserOption => ({
    label:
      `${u?.fname || ""} ${u?.lname || ""}`.trim() || u?.email || String(u?.id),
    value: String(u?.id),
    avatar: u?.avatar ?? null,
  });

  useEffect(() => {
    if (
      accommodation?.guest &&
      !guestOptions.some((o) => o.value === String(accommodation.guest.id))
    ) {
      setGuestOptions((prev) => [toUserOption(accommodation.guest), ...prev]);
    }
    if (
      accommodation?.companion &&
      !companionOptions.some(
        (o) => o.value === String(accommodation.companion.id)
      )
    ) {
      setCompanionOptions((prev) => [
        toUserOption(accommodation.companion),
        ...prev,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accommodation]);

  const shouldPrefetchOnOpen = (options: UserOption[], selectedId?: string) => {
    const sid = selectedId ? String(selectedId) : undefined;
    return (
      options.length === 0 ||
      (sid && options.length === 1 && options[0].value === sid)
    );
  };

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
              .toLowerCase() === (q || "").trim().toLowerCase()
        )
      : list;

    return filtered.map(toUserOption);
  };

  const UserOptionRenderer = (props: any) => (
    <components.Option {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

  const handleGuestInputChange = (val: string) => {
    const q = (val || "").trim();
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
    const q = (val || "").trim();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync(payload);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Accommodation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="gy-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Hotel</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions={defaultHotelOptions}
                  loadOptions={loadHotelOptions}
                  value={
                    payload.hotel_id
                      ? defaultHotelOptions.find(
                          (opt) => opt.value === payload.hotel_id
                        ) || null
                      : null
                  }
                  onChange={(opt: any) =>
                    setPayload((p) => ({ ...p, hotel_id: opt?.value || "" }))
                  }
                  placeholder="Search hotels by name"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Guest</Form.Label>
                <Select
                  options={guestOptions}
                  components={{
                    Option: UserOptionRenderer,
                    SingleValue: UserSingleValueRenderer,
                  }}
                  styles={selectStyles}
                  onInputChange={(val) => handleGuestInputChange(val)}
                  onMenuOpen={() => {
                    if (
                      shouldPrefetchOnOpen(
                        guestOptions,
                        accommodation.guest?.id
                      )
                    ) {
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
                  value={
                    payload.guest_id
                      ? guestOptions.find(
                          (o) => o.value === String(payload.guest_id)
                        ) ||
                        (accommodation.guest &&
                        String(accommodation.guest.id) ===
                          String(payload.guest_id)
                          ? toUserOption(accommodation.guest)
                          : {
                              value: String(payload.guest_id),
                              label: String(payload.guest_id),
                            })
                      : null
                  }
                  onChange={(opt: any) =>
                    setPayload((p) => ({ ...p, guest_id: opt?.value || "" }))
                  }
                  placeholder="Search users by name"
                  noOptionsMessage={() =>
                    guestQuery ? "No results" : "Type a name to search"
                  }
                />
                <Form.Text className="text-muted">
                  Search by name. To search by email, type the full email
                  address.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Companion (optional)</Form.Label>
                <Select
                  options={companionOptions}
                  components={{
                    Option: UserOptionRenderer,
                    SingleValue: UserSingleValueRenderer,
                  }}
                  styles={selectStyles}
                  onInputChange={(val) => handleCompanionInputChange(val)}
                  onMenuOpen={() => {
                    if (
                      shouldPrefetchOnOpen(
                        companionOptions,
                        accommodation.companion?.id
                      )
                    ) {
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
                  value={
                    payload.companion_id
                      ? companionOptions.find(
                          (o) => o.value === String(payload.companion_id)
                        ) ||
                        (accommodation.companion &&
                        String(accommodation.companion.id) ===
                          String(payload.companion_id)
                          ? toUserOption(accommodation.companion)
                          : {
                              value: String(payload.companion_id),
                              label: String(payload.companion_id),
                            })
                      : null
                  }
                  onChange={(opt: any) =>
                    setPayload((p) => ({
                      ...p,
                      companion_id: opt?.value || undefined,
                    }))
                  }
                  isClearable
                  placeholder="Search users by name"
                  noOptionsMessage={() =>
                    companionQuery ? "No results" : "Type a name to search"
                  }
                />
                <Form.Text className="text-muted">
                  Search by name. To search by email, type the full email
                  address.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Check In</Form.Label>
                <Form.Control
                  type="date"
                  value={moment(payload.check_in || "").format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setPayload((p) => ({ ...p, check_in: e.target.value }))
                  }
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Check Out</Form.Label>
                <Form.Control
                  type="date"
                  value={moment(payload.check_out || "").format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setPayload((p) => ({ ...p, check_out: e.target.value }))
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-5 d-flex justify-content-end gap-3">
            <Button variant="light" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" animation="border" /> : "Update"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
