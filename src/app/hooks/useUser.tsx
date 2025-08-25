import { useMutation, useQuery } from "react-query";
import {
  completeProfileApi,
  getAllActivitiesApi,
  getAllOccupationsApi,
  getAllUniversitiesApi,
} from "../apis";
import { useMemo } from "react";
import { activity, university } from "../types/user";

export const useUser = () => {
  const {
    data: activities,
    isLoading: loadingActivities,
    isFetched: isActivitiesFetched,
    refetch: refetchActivities,
  } = useQuery({
    queryKey: ["get-activities"],
    queryFn: async () => await getAllActivitiesApi(),
  });

  const {
    data: occupations,
    isLoading: loadingOccupations,
    refetch: refetchOccupations,
  } = useQuery({
    queryKey: ["get-occupations"],
    queryFn: async () => await getAllOccupationsApi(),
  });

  const { data: universities, isLoading: loadingUniversities } = useQuery({
    queryKey: ["get-universities"],
    queryFn: async () => await getAllUniversitiesApi(),
  });

  const { mutate: completeProfile, isLoading: loadingCompleteProfile } =
    useMutation({
      mutationKey: ["complete-profile"],
      mutationFn: async (data: any) => await completeProfileApi(data),
    });

  const MEMORIZED_ACTIVITIES = useMemo(() => {
    return activities?.data?.map((item: activity) => {
      return {
        label: item.label_fr,
        value: item.id,
      };
    });
  }, [activities]);

  const MEMORIZED_OCCUPATIONS = useMemo(() => {
    const occupationsArray =
      occupations?.data?.map((item: activity) => {
        return {
          label: item.label_fr,
          value: item.id,
        };
      }) || [];

    occupationsArray.unshift({
      label: "Autre",
      value: 0,
    });

    return occupationsArray;
  }, [occupations]);

  const MEMORIZED_UNIVERSITIES = useMemo(() => {
    const universitiesArray =
      universities?.data?.map((item: university) => ({
        label: `${item.name} (${item.location})`,
        value: item.id,
      })) || [];

    // Add the "Autre" object to the array
    universitiesArray.unshift({
      label: "Autre",
      value: 0,
    });

    return universitiesArray;
  }, [universities]);

  return {
    // activities
    activities,
    loadingActivities,
    isActivitiesFetched,
    MEMORIZED_ACTIVITIES,
    refetchActivities,

    // occupations
    occupations,
    loadingOccupations,
    MEMORIZED_OCCUPATIONS,
    refetchOccupations,

    // universities
    universities,
    loadingUniversities,
    MEMORIZED_UNIVERSITIES,

    // complete profile
    completeProfile,
    loadingCompleteProfile,
  };
};
