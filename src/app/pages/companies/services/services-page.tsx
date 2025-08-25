import { useQuery } from "react-query";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyProductServiceApi } from "../../../apis";
import { useMemo } from "react";
import { TableComponent } from "../../../components";
import moment from "moment";
import getMediaUrl from "../../../helpers/getMediaUrl";
import ServicesActions from "./components/services-actions";
import { useCompanyRedirect } from "../../../hooks/useCompanyRedirect";

export type ServiceProductCardType = {
  name: string;
  type: string;
  description: string;
  email: null | string;
  phone_1: string;
  phone_2: null | string;
  external_link: null | string;
  featured_image: string;
  promotion_flag: string;
  company_id: string;
  id: number;
  category: {
    name_en: string;
    name_fr: string;
    name_ar: string;
  };
  yt_link: null | string;
};

export const servicesBreadcrumbs: Array<PageLink> = [
  {
    title: "Gestion des services et des produits",
    path: "/services",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

const ServicesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCompanyEditor } = useCompanyRedirect({
    companyId: id,
  });

  const { data } = useQuery({
    queryKey: ["get-all-company-products-services", id],
    queryFn: () => getCompanyProductServiceApi(id),
  });

  const PRODUCTS_SERVICES = useMemo(() => data?.data, [data]);

  const columns = [
    {
      name: "",
      selector: (row) => (
        <div className="symbol symbol-circle symbol-40px overflow-hidden me-3 my-2">
          <div className="symbol-label">
            <img
              alt={row?.name + row?.type}
              src={getMediaUrl(row?.featured_image)}
              className="w-100"
            />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Produit",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Statut",
      selector: (row) => (
        <span className="badge badge-light-success fw-bolder">
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Créé à",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => <ServicesActions {...row} />,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      omit: !isCompanyEditor,
    },
  ];

  return (
    <>
      <PageTitle breadcrumbs={servicesBreadcrumbs}>Services</PageTitle>
      <TableComponent
        columns={columns as any}
        data={PRODUCTS_SERVICES}
        placeholder="produit"
        onAddClick={() => {
          navigate("create");
        }}
        canI="create"
        canA="guests"
      />
    </>
  );
};

export { ServicesPage };
