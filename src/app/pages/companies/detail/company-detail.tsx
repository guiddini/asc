import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { PageTitle } from "../../../../_metronic/layout/core";
import { getCompanyApi, updateCompanyApi } from "../../../apis";
import { canEditCompany } from "../../../features/userSlice";
import { CompanyDetailProps } from "../../../types/company";
import CompanyHeader from "./components/CompanyHeader";
import CompanyDescription from "./components/CompanyDescription";
import CompanyStats from "./components/CompanyStats";
import CompanyQuote from "./components/CompanyQuote";
import CompanyProducts from "./components/CompanyProducts";
import CompanyTeam from "./components/CompanyTeam";
import CompanyJobs from "./components/CompanyJobs";
import EditableWrapper from "./components/EditableWrapper";
import { Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import htmlToDraftBlocks from "../../../helpers/htmlToDraftJS";

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [editable, setEditable] = useState(false);
  const isCompanyEditor = useSelector((state) => canEditCompany(state, id));

  const { data, isLoading } = useQuery(["company", id], () =>
    getCompanyApi(id)
  );

  const COMPANY: CompanyDetailProps = useMemo(() => {
    if (!isLoading && data?.data) {
      return {
        ...data.data,
        desc:
          data.data.description ||
          "Découvrez notre histoire et notre engagement envers nos clients.",
        description: data.data.description
          ? htmlToDraftBlocks(data.data.description)
          : "",
        header_text:
          data.data.header_text || `Bienvenue chez ${data.data.name}`,
        quote_author: data.data.quote_author || `CEO de l'entreprise`,
        quote_text:
          data.data.quote_text ||
          "L'excellence n'est pas une action, mais une habitude.",
        team_text:
          data.data.team_text ||
          "Rencontrez l'équipe dévouée qui rend tout cela possible.",
        email: data.data.email || "placeholder@example.com",
      };
    }
    return null;
  }, [data, isLoading]);

  const { control, watch, handleSubmit, setValue, reset, resetField } = useForm(
    {
      defaultValues: COMPANY,
    }
  );

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (data: FormData) => {
      return await updateCompanyApi(data);
    },
  });

  const handleUpdate = async (data: CompanyDetailProps) => {
    const formdata = new FormData();
    typeof data?.logo !== "string" && formdata.append("logo", data.logo);
    data.header_image &&
      typeof data?.header_image !== "string" &&
      formdata.append("header_image", data.header_image);
    formdata.append("name", data.name);
    formdata.append("legal_status", data.legal_status);
    formdata.append("address", data.address);
    formdata.append("email", data.email);
    formdata.append("header_text", data.header_text);
    formdata.append("description", data.desc);
    formdata.append("quote_author", data.quote_author);
    data.quote_text && formdata.append("quote_text", data.quote_text);
    data?.team_text && formdata.append("team_text", data.team_text);
    data?.country_id && formdata.append("country_id", data.country_id);
    data?.wilaya_id && formdata.append("wilaya_id", data.wilaya_id);
    data?.commune_id && formdata.append("commune_id", data.commune_id);
    formdata.append("phone_1", data.phone_1);
    formdata.append("company_id", id);

    mutate(formdata, {
      onSuccess() {
        setEditable(false);
        toast.success("L'entreprise a été mise à jour avec succès");
      },
      onError(error) {
        toast?.error("Erreur lors de la mise à jour de l'entreprise");
      },
    });
  };

  useEffect(() => {
    if (reset && COMPANY) {
      reset(COMPANY);
    }
  }, [COMPANY?.id, reset, id]);

  const companyBreadCrumbs = [
    {
      title: "Exposants",
      path: "/companies",
      isSeparator: false,
      isActive: false,
    },
    {
      title: COMPANY?.name,
      path: "",
      isSeparator: true,
      isActive: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="card-body p-lg-17 w-100 h-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="card" id="company-detail-wrapper">
      <PageTitle breadcrumbs={companyBreadCrumbs}>{COMPANY?.name}</PageTitle>
      <div className="card-body p-lg-17 position-relative">
        <EditableWrapper
          isCompanyEditor={isCompanyEditor}
          editable={editable}
          setEditable={setEditable}
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
          isUpdating={isUpdating}
          resetFields={() => {
            resetField("address");
            resetField("description");
            resetField("email");
            resetField("header_image");
            resetField("header_text");
            resetField("logo");
            resetField("name");
            resetField("phone_1");
            resetField("quote_author");
            resetField("quote_text");
            resetField("team_text");
          }}
          id={id}
        >
          <CompanyHeader
            company={COMPANY}
            editable={editable}
            watch={watch}
            setValue={setValue}
          />
          <CompanyDescription
            company={COMPANY}
            editable={editable}
            watch={watch}
            control={control}
            setValue={setValue}
          />
          <CompanyStats company={COMPANY} />
          <CompanyQuote
            company={COMPANY}
            editable={editable}
            watch={watch}
            setValue={setValue}
          />
          <CompanyProducts companyId={id} />
          <CompanyTeam companyId={id} />
          <CompanyJobs
            companyId={id}
            companyName={COMPANY?.name}
            logo_image={typeof COMPANY?.logo === "string" ? COMPANY.logo : ""}
          />
        </EditableWrapper>
      </div>
    </div>
  );
};

export { CompanyDetail };
