import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { useMemo, useState } from "react";
import { AddAdsModal } from "./add-ads-modal";
import { Dropdown } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
const MySwal = withReactContent(Swal);
import { useMutation, useQuery } from "react-query";
import {
  acceptAdsApi,
  deleteAdsApi,
  getAllAdsApi,
  refuseAdsDemandApi,
} from "../../../apis";
import moment from "moment";
import { TableComponent } from "../../../components";
import { Can } from "../../../utils/ability-context";
import UpdateAds from "./update-ads";

export type ADProps = {
  name: string;
  image_path: string | File;
  company_id: string;
  link: string;
  start_date: string;
  end_date: string;
  id: string;
  created_at: string;
  clicks: null | number;
  updated_at: string;
  status_reason: null | string;
  status: string;
};

const guestsBreadcrumbs: Array<PageLink> = [
  {
    title: "Ads Management",
    path: "/config/ads",
    isSeparator: false,
    isActive: false,
  },
];

export const AdsPage = () => {
  const columns = [
    {
      name: "Nom",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Statut",
      selector: (row) => {
        if (row.status === "Pending") {
          return (
            <span className="badge badge-light-warning fw-bolder">
              {row.status}
            </span>
          );
        } else if (row.status === "Published") {
          return (
            <span className="badge badge-light-success fw-bolder">
              {row.status}
            </span>
          );
        } else if (row.status === "Refused") {
          return (
            <span className="badge badge-light-danger fw-bolder">
              {row.status}
            </span>
          );
        }
      },
      sortable: true,
    },

    {
      name: "Clicks",
      selector: (row) => Number(row.clicks),
      sortable: true,
    },
    {
      name: "Commence à",
      selector: (row) => moment(row.start_date).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Finis à",
      selector: (row) => moment(row.end_date).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => {
        const is_published = row.status === "Published";
        const is_refused = row.status === "Refused";
        return (
          <Dropdown placement="top-start">
            <Dropdown.Toggle
              variant="transparent"
              color="#fff"
              id="post-dropdown"
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
              <div className="p-2">
                {!is_published && (
                  <Can I="accept" a="adsadmin">
                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        handleAcceptSponsor(row.id);
                      }}
                      className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
                    >
                      <KTIcon
                        iconName="check-square"
                        className={`fs-1 cursor-pointer m-0 text-primary`}
                      />
                      <span className="text-muted mt-1 ms-2">Publier</span>
                    </Dropdown.Item>
                    {/*  */}
                  </Can>
                )}

                <Dropdown.Item
                  onClick={() => {
                    setUpdateAd(row);
                  }}
                  className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
                >
                  <KTIcon
                    iconName="pencil"
                    className={`fs-1 cursor-pointer m-0 text-primary`}
                  />
                  <span className="text-muted mt-1 ms-2">Editer</span>
                </Dropdown.Item>
                {/*  */}
                {/* <Can I="accept" a="adsadmin">
                  </Can> */}
                {/* {!is_published && (
                )} */}

                <Can I="delete" a="adsadmin">
                  {/* delete ad */}
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteSponsor(row?.id);
                    }}
                    className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-danger btn-active-light-danger fw-bold collapsible m-0 px-5 py-3"
                  >
                    <KTIcon
                      iconName="trash-square"
                      className={`fs-1 cursor-pointer m-0 text-danger`}
                    />
                    <span className="text-muted mt-1 ms-2">Supprimer</span>
                  </Dropdown.Item>

                  {/*  */}
                </Can>

                {!is_refused && (
                  <Can I="refuse" a="adsadmin">
                    {/* refus ad */}

                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        handleRefuseSponsor(row?.id);
                      }}
                      className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-warning btn-active-light-warning fw-bold collapsible m-0 px-5 py-3"
                    >
                      <KTIcon
                        iconName="cross-square"
                        className={`fs-1 cursor-pointer m-0 text-warning `}
                      />
                      <span className="text-muted mt-1 ms-2">Refuser</span>
                    </Dropdown.Item>

                    {/* */}
                  </Can>
                )}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handleDeleteSponsor = async (id) => {
    MySwal.fire({
      title: "Are you sure you want to delete?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonText: "Delete",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        deleteMutate(id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            refetch();
            toast.success("ads has been removed successfully !");
          },
          onError(error, variables, context) {
            toast.error("Error while deleting ads");
          },
        });
      }
    });
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: async (id: number | string) => {
      return await deleteAdsApi(id);
    },
    mutationKey: ["delete-ads"],
  });

  const handleRefuseSponsor = async (id) => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir refuser ?",
      icon: "warning",
      input: "text",
      text: "Veuillez ajouter le motif du refus",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "le motif du refus",
      },
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      showLoaderOnConfirm: true,
      preConfirm: async (motif) => {
        if (motif?.length > 0) {
          refusMutate(
            {
              id: id,
              status_reason: motif,
            },
            {
              onSuccess(data, variables, context) {
                MySwal.hideLoading();
                refetch();
                toast.success("ads has been refused successfully !");
              },
              onError(error, variables, context) {
                toast.error("Error while refusing ads");
              },
            }
          );
        } else {
          Swal.showValidationMessage("Veuillez ajouter le motif du refus");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const { mutate: refusMutate, isLoading: isRefusing } = useMutation({
    mutationFn: async ({
      id,
      status_reason,
    }: {
      id: number | string;
      status_reason: string;
    }) => {
      return await refuseAdsDemandApi(id, status_reason);
    },
    mutationKey: ["refus-ads"],
  });

  const handleAcceptSponsor = async (id) => {
    MySwal.fire({
      title: "Are you sure you want to accept ?",
      icon: "success",
      heightAuto: false,
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonText: "Accept",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        acceptMutate(id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            refetch();
            toast.success("ads has been removed successfully !");
          },
          onError(error, variables, context) {
            toast.error("Error while deleting ads");
          },
        });
      }
    });
  };

  const { mutate: acceptMutate, isLoading: isAccepting } = useMutation({
    mutationFn: async (id: number | string) => {
      return await acceptAdsApi(id);
    },
    mutationKey: ["accept-ads"],
  });

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-all-ads"],
    queryFn: getAllAdsApi,
  });

  const ADS: ADProps[] = useMemo(() => data?.data, [data]);

  const [updateAd, setUpdateAd] = useState<ADProps | null>(null);

  return (
    <>
      <PageTitle breadcrumbs={guestsBreadcrumbs} />
      <Can I="list" a="adsadmin">
        <TableComponent
          columns={columns as any}
          data={ADS}
          placeholder="ad"
          onAddClick={() => {
            setCreateModalOpen(true);
          }}
          showCreate={true}
          showExport={false}
          isLoading={isLoading}
          canA="adsadmin"
          canI="create"
        />
      </Can>

      <Can I="create" a="adsadmin">
        <AddAdsModal
          isOpen={createModalOpen}
          refetch={refetch}
          setIsOpen={setCreateModalOpen}
        />
      </Can>

      {updateAd !== null && (
        <UpdateAds
          ads={updateAd}
          isOpen={updateAd === null ? false : true}
          setIsOpen={setUpdateAd}
        />
      )}
    </>
  );
};
