import { useEffect, useMemo, useState } from "react";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import UpdateProductServiceData from "./components/update-product-service-data";
import UpdateProductServiceMedia from "./components/update-product-service-media";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getOneProductServiceApi,
  updateProductServiceApi,
} from "../../../../apis";
import htmlToDraftBlocks from "../../../../helpers/htmlToDraftJS";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateServiceSchema } from "../validation/serviceValidation";
import { useCompanyRedirect } from "../../../../hooks/useCompanyRedirect";

type updateProductServiceType = {
  name: string;
  description: string;
  desc: string;
  category_id: string | number;
  featured_image: File | string;
  is_promoted: boolean;
  type: string;
  category: {
    id: number;
    name_en: string;
    name_fr: string;
    name_ar: string;
  };
  company_id: string;
  external_link: string | null; // Assuming external_link can be null based on your data
  id: number;
  phone_1: string | null; // Assuming phone_1 can be null based on your data
  promotion_flag: string;
  status: string;
  status_reason: string;
};

export const UpdateProductServicePage = () => {
  const { id, productID } = useParams();

  useCompanyRedirect({
    companyId: id,
    restrictForStaff: true,
  });

  const [key, setKey] = useState<string>("overview");
  const queryClient = useQueryClient();
  const [didInit, setDidInit] = useState(false);

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationKey: ["update-product-service", productID],
    mutationFn: (data: FormData) => updateProductServiceApi(data),
  });

  const { data, isLoading, isFetched } = useQuery({
    queryFn: () => getOneProductServiceApi(productID),
    queryKey: ["get-one-product-service-detail", productID],
  });

  const DATA = useMemo(() => {
    if (isFetched) {
      return {
        ...data?.data,
        description: htmlToDraftBlocks(data?.data?.description),
        desc: data?.data?.description,
      };
    }
  }, [data]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
    reset,
  } = useForm<updateProductServiceType>({
    defaultValues: DATA,
    resolver: yupResolver(updateServiceSchema) as any,
  });

  useEffect(() => {
    // Initialize form once with fetched data; do not keep resetting after submit
    if (isFetched && DATA && !didInit) {
      reset(DATA);
      setDidInit(true);
    }
  }, [isFetched, DATA, reset, didInit]);

  const handleUpdate = (data: any) => {
    const formdata = new FormData();
    formdata.append("productservice_id", productID);
    formdata.append("name", data.name);
    formdata.append(
      "category_id",
      typeof data.category_id === "object"
        ? data.category_id?.value
        : data.category_id
    );
    if (typeof data?.featured_image !== "string") {
      formdata.append("featured_image", data.featured_image);
    }
    formdata.append("description", data.desc);
    formdata.append("email", data.email);
    formdata.append("phone_1", data.phone_1);
    formdata.append("type", data.type);
    formdata.append("yt_link", data.yt_link);
    formdata.append("external_link", data.external_link);
    formdata.append(
      "promotion_flag",
      data?.is_promoted !== undefined
        ? data?.is_promoted
          ? "Pending"
          : "Rejected"
        : data?.promotion_flag
    );

    data?.media?.forEach(({ id }, index) =>
      formdata.append(`mediaTempIds[${index}]`, String(id))
    );

    mutate(formdata, {
      onSuccess(updated, variables, context) {
        toast.success("Product updated successfully");
        // Refresh the product detail so DATA is up to date
        queryClient.invalidateQueries(["get-one-product-service-detail", productID]);
      },
      onError(error, variables, context) {
        toast.error("Error while updating product :");
      },
    });
  };

  return (
    <>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap bg-white p-3 mb-6 h-50px"
      >
        <Tab eventKey="overview" title="Overview">
          <UpdateProductServiceData
            setValue={setValue}
            DATA={DATA}
            id={id}
            isLoading={isLoading}
            control={control as any}
            errors={errors as any}
            resetField={resetField}
          />
        </Tab>
        <Tab eventKey="media" title="Media">
          <UpdateProductServiceMedia
            setValue={setValue}
            DATA={DATA}
            productID={productID}
            control={control as any}
            errors={errors as any}
            resetField={resetField}
          />
        </Tab>
      </Tabs>
      <div className="d-flex flex-row justify-content-end  w-100 my-8 py-5 pe-4 rounded-2">
        <Link
          to={`/company/${id}/services`}
          id="kt_ecommerce_add_product_cancel"
          className="btn btn-light me-5"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit(handleUpdate)}
          className="btn btn-primary"
        >
          {isLoading ? (
            <Spinner animation="border" color="#fff" size="sm" />
          ) : (
            <span className="indicator-label">Update</span>
          )}
        </button>
      </div>
    </>
  );
};
