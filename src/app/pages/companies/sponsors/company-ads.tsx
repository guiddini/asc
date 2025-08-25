import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { useMemo, useState } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";
const MySwal = withReactContent(Swal);
import { useMutation, useQuery } from "react-query";
import { deleteAdsApi, getCompanyAdsApi } from "../../../apis";
import { TableComponent } from "../../../components";
import { CompanyAddAdsModal } from "./company-add-ads-modal";
import moment from "moment";
import { Dropdown } from "react-bootstrap";
import CompanyUpdateAds from "./company-update-ads";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";
import { canEditCompany, canViewCompany } from "../../../features/userSlice";
import { useNavigate } from "react-router-dom";

export type CompanyADProps = {
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

export const CompanyAdsPage = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();
  const company_id = user?.company?.id;
  const isCompanyEditor = useSelector((state) =>
    canEditCompany(state, company_id)
  );
  const isCompanyStaff = useSelector((state) =>
    canViewCompany(state, company_id)
  );

  if (!isCompanyStaff) navigate("/home");

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
                {/* view product */}
                <Dropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdateAd(row);
                  }}
                  className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
                >
                  <KTIcon
                    iconName="check-square"
                    className={`fs-1 cursor-pointer m-0 text-primary`}
                  />
                  <span className="text-muted mt-1 ms-2">Editer</span>
                </Dropdown.Item>
                {/*  */}

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
              </div>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      omit: !isCompanyEditor,
    },
  ];

  const handleDeleteSponsor = async (id) => {
    MySwal.fire({
      title: "Etes-vous sûr que vous voulez supprimer?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        deleteMutate(id, {
          onSuccess() {
            MySwal.hideLoading();
            refetch();
            toast.success("l'annonce a été supprimée avec succès !");
          },
          onError() {
            toast.error("Erreur lors de la suppression de l'annonce");
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

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [updateAd, setUpdateAd] = useState<CompanyADProps | null>(null);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-all-ads"],
    queryFn: async () => await getCompanyAdsApi(company_id),
  });

  const ADS: CompanyADProps[] = useMemo(() => data?.data, [data]);

  return (
    <>
      <PageTitle breadcrumbs={guestsBreadcrumbs} />
      <TableComponent
        columns={columns as any}
        data={ADS}
        placeholder="annonce"
        onAddClick={() => {
          if (isCompanyEditor) setCreateModalOpen(true);
        }}
        showCreate={isCompanyEditor}
        showExport={false}
        isLoading={isLoading}
        canI={null}
      />

      {isCompanyEditor && (
        <>
          <CompanyAddAdsModal
            isOpen={createModalOpen}
            refetch={refetch}
            setIsOpen={setCreateModalOpen}
          />
          {updateAd && (
            <CompanyUpdateAds
              ads={updateAd}
              isOpen={updateAd !== null}
              setIsOpen={setUpdateAd}
            />
          )}
        </>
      )}
    </>
  );
};
