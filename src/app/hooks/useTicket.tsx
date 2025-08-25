import React, { useMemo, useState } from "react";
import { getAllTicketTypeApi, getAllUnassignedTickets } from "../apis";
import { useQuery } from "react-query";
import { Ticket } from "../types/user";
import { useSelector } from "react-redux";
import { UserResponse } from "../types/reducers";

export type GroupedTicket = {
  name: string;
  ids: number[];
  quantity: number;
  type: string;
  typeId: string;
  source: string;
  role: string;
};

export const useTicket = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const [unassignedTicketCount, setUnassignedTicketCount] = useState<number>(0);
  const [groupedTickets, setGroupedTickets] = useState<GroupedTicket[] | []>(
    []
  );
  const [groupedGiftedTickets, setGroupedGiftedTickets] = useState<
    GroupedTicket[] | []
  >([]);
  const [unassignedOwnedTickets, setUnassignedOwnedTickets] = useState<
    any | []
  >([]);
  const [userTickets, setUserTickets] = useState<any | []>([]);

  const {
    data,
    isFetched,
    isLoading: loadingTickets,
    refetch,
  } = useQuery({
    queryKey: ["get-all-unassigned-tickets"],
    queryFn: () => getAllUnassignedTickets(user?.id),
  });

  const {
    data: ticketTypeData,
    isLoading: gettingTicketTypes,
    refetch: refetchTicketTypes,
  } = useQuery({
    queryKey: ["get-all-ticket-types"],
    queryFn: () => getAllTicketTypeApi(),
  });

  const TICKETS = useMemo(() => data?.data, [data, isFetched]);
  const TICKET_TYPES = useMemo(() => ticketTypeData?.data, [ticketTypeData]);

  const checkUnassignedTickets = () => {
    return setUnassignedTicketCount(data?.data?.length);
  };

  const groupTickets = (
    tickets: Ticket[],
    setGroupedTickets: React.Dispatch<React.SetStateAction<GroupedTicket[]>>,
    source: string
  ) => {
    const updatedGroupedTickets = tickets?.reduce((acc, item) => {
      const typeId = item?.type?.id;
      const typeSlug = item?.type?.slug;
      const roleSlug = item?.role_slug;

      const existingTypeIndex = acc?.findIndex(
        (group) => group?.type === typeSlug && group?.role === roleSlug
      );

      if (existingTypeIndex !== -1) {
        acc[existingTypeIndex]?.ids?.push(item.id);
        acc[existingTypeIndex].quantity += 1;
      } else {
        acc.push({
          type: typeSlug,
          role: roleSlug,
          ids: [item.id],
          quantity: 1,
          typeId: typeId,
          name: item?.type?.name,
          source: source,
        });
      }

      return acc;
    }, []);

    setGroupedTickets(updatedGroupedTickets);
  };

  // user has ticket id : 1 basic participant

  const assignTicket = (
    selectedType: string,
    source: string,
    selectedRole: string
  ) => {
    if (source === "owned") {
      return new Promise((resolve) => {
        setGroupedTickets((prevGroupedTickets) => {
          const updatedGroupedTickets = prevGroupedTickets.map(
            (group: GroupedTicket) => {
              const selectedGroup = prevGroupedTickets.find(
                (group: GroupedTicket) =>
                  group.type === selectedType &&
                  group.source === source &&
                  group.role === selectedRole
              );
              if (selectedGroup) {
                const userHasTicketID = selectedGroup.ids.shift();
                if (userHasTicketID !== undefined) {
                  resolve(userHasTicketID);
                }
              }
              return group;
            }
          );
          return updatedGroupedTickets;
        });
      });
    } else {
      return new Promise((resolve) => {
        setGroupedGiftedTickets((prevGroupedTickets) => {
          const updatedGroupedTickets = prevGroupedTickets.map(
            (group: GroupedTicket) => {
              const selectedGroup = prevGroupedTickets.find(
                (group: GroupedTicket) =>
                  group.type === selectedType &&
                  group.source === source &&
                  group.role === selectedRole
              );
              if (selectedGroup) {
                const userHasTicketID = selectedGroup.ids.shift();
                if (userHasTicketID !== undefined) {
                  resolve(userHasTicketID);
                }
              }
              return group;
            }
          );
          return updatedGroupedTickets;
        });
      });
    }
  };

  const decreaseTicketQuantity = (type: string, source: string) => {
    if (source === "owned") {
      setGroupedTickets((prevGroupedTickets) => {
        const updatedGroupedTickets = prevGroupedTickets.map(
          (group: GroupedTicket) => {
            if (group.type === type && group.source === source) {
              group.quantity -= 1;
            }
            return group;
          }
        );
        return updatedGroupedTickets;
      });
    } else {
      if (source === "gifted") {
        setGroupedGiftedTickets((prevGroupedTickets) => {
          const updatedGroupedTickets = prevGroupedTickets.map(
            (group: GroupedTicket) => {
              if (group.type === type && group.source === source) {
                group.quantity -= 1;
              }
              return group;
            }
          );
          return updatedGroupedTickets;
        });
      }
    }
  };

  const groupTicketsByType = (
    tickets: Ticket[],
    setGroupedTickets: React.Dispatch<React.SetStateAction<GroupedTicket[]>>,
    source: string
  ) => {
    if (isFetched) {
      const updatedGroupedTickets = tickets.reduce((acc, item) => {
        const typeSlug = item.type.slug;

        const existingTypeIndex = acc.findIndex(
          (group) => group.type === typeSlug
        );

        if (existingTypeIndex !== -1) {
          acc[existingTypeIndex].ids.push(item.id);
          acc[existingTypeIndex].quantity += 1;
        } else {
          acc.push({
            type: typeSlug,
            ids: [item.id],
            quantity: 1,
            typeId: item.type.id,
            name: item.type?.name,
            source: source,
          });
        }

        return acc;
      }, []);

      setGroupedTickets(updatedGroupedTickets);
    }
  };

  // to display all available tickets and when theres no available tickets show quantity 0
  const groupOwnedTicketsByType = () => {
    const ownedTickets =
      TICKETS?.map((ticket) => ({ ...ticket, role: ticket.role_slug })) || [];
    const ticketTypes = TICKET_TYPES || [
      {
        name: "Free",
        slug: "free",
      },
      {
        name: "Basic",
        slug: "basic",
      },
      {
        name: "Entreprise Starter",
        slug: "entreprise-starter",
      },
      {
        name: "Entreprise Essenciel",
        slug: "entreprise-essenciel",
      },
      {
        name: "Entreprise All Inclusive",
        slug: "entreprise-all-inclusive",
      },
    ];

    const updatedGroupedTickets = ticketTypes.map((type) => {
      const typeSlug = type.slug;

      const ownedTypeTickets = ownedTickets.filter(
        (ticket) => ticket.type.slug === typeSlug
      );

      return {
        type: typeSlug,
        ids: ownedTypeTickets.map((ticket) => ticket.id),
        quantity: ownedTypeTickets.length,
        typeId: type.id,
        name: type.name,
        source: "owned",
      };
    });

    const freeTicketIndex = updatedGroupedTickets.findIndex(
      (ticket) => ticket.type === "free"
    );
    if (freeTicketIndex !== -1) {
      const freeTicket = updatedGroupedTickets.splice(freeTicketIndex, 1);
      updatedGroupedTickets.unshift(freeTicket[0]);
    }

    setUserTickets(updatedGroupedTickets);
  };

  const groupOwnedTickets = () => {
    groupTickets(
      TICKETS?.map((ticket) => ({ ...ticket, role: ticket.role_slug })),
      setGroupedTickets,
      "owned"
    );
  };

  const groupGiftedTickets = () => {
    if (isFetched) {
      groupTickets(
        user?.giftedTickets?.map((ticket) => ({
          ...ticket,
          role: ticket.role_slug,
        })) || [],
        setGroupedGiftedTickets,
        "gifted"
      );
    }
  };

  return {
    unassignedTicketCount,
    checkUnassignedTickets,
    groupedTickets,
    assignTicket,
    setGroupedTickets,
    loadingTickets,
    decreaseTicketQuantity,
    TICKETS,
    refetch,
    ticketTypeData,
    gettingTicketTypes,
    refetchTicketTypes,
    TICKET_TYPES,
    groupedGiftedTickets,
    unassignedOwnedTickets,
    groupOwnedTickets,
    groupGiftedTickets,
    setUnassignedOwnedTickets,
    groupTicketsByType,
    groupOwnedTicketsByType,
    userTickets,
    data,
    groupTickets,
  };
};
