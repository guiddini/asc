import {
  Dropzone,
  InputComponent,
  SelectComponent,
  TextEditor,
} from "../../../components";
import { useForm } from "react-hook-form";
import { PageTitle } from "../../../../_metronic/layout/core";
import { servicesBreadcrumbs } from "./services-page";
import { Col, Row, Spinner } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import useProductsCategories from "../../configurations/company-product-service-categories/hooks";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { uploadMediaResponseType } from "../../../types/posts";
import { createProductServiceApi, uploadImageApi } from "../../../apis";
import SelectedMediaList from "../../home/components/selected-media-list";
import { useMutation } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { createServiceSchema } from "./validation/serviceValidation";
import { errorMessage } from "../../../helpers/errorMessage";
import { useCompanyRedirect } from "../../../hooks/useCompanyRedirect";

type createServiceType = {
  media: {
    file: File;
    id: number;
  }[];
  name: string;
  description: string;
  desc: string;
  category_id: string | number;
  email: string;
  external_link: string;
  phone_1: string;
  featured_image: File;
  is_promoted: boolean;
  type: string;
  yt_link: string;
};

export const CreateService = () => {
  const { id } = useParams();
  useCompanyRedirect({
    companyId: id,
    restrictForStaff: true,
  });

  const navigate = useNavigate();

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    resetField,
    handleSubmit,
  } = useForm<createServiceType>({
    defaultValues: {
      name: "",
      description: "",
      category_id: null,
      media: [],
      featured_image: null,
      is_promoted: false,
      type: null,
      email: "",
      external_link: "",
      phone_1: "",
      yt_link: "",
    },
    resetOptions: {
      keepIsSubmitted: false,
    },
    resolver: yupResolver(createServiceSchema) as any,
  });

  const { PRODUCTS_CATEGORIES, loadingCategories } = useProductsCategories();

  const CATEGORIES = useMemo(
    () =>
      PRODUCTS_CATEGORIES?.map((cat) => {
        return {
          label: cat.name_fr,

          value: cat.id,
        };
      }),
    [PRODUCTS_CATEGORIES]
  );

  const productsMedia = watch("media") || [];

  const featured_image = useMemo(
    () =>
      watch("featured_image") instanceof Blob ? watch("featured_image") : null,
    [watch("featured_image")]
  );

  const bg_image =
    featured_image !== null
      ? `url('${URL?.createObjectURL(featured_image)}')`
      : `url('${toAbsoluteUrl("/media/svg/files/blank-image.svg")}')`;

  const PRODUCT_IMAGE = useMemo(
    () => (
      <div
        className="image-input image-input-empty image-input-outline image-input-placeholder mb-3"
        data-kt-image-input="true"
        style={{
          backgroundImage: bg_image,
        }}
      >
        <div className="image-input-wrapper w-150px h-150px"></div>
        <label
          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
          data-kt-image-input-action="change"
          data-bs-toggle="tooltip"
          title="Change avatar"
        >
          <i className="ki-duotone ki-pencil fs-7">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <input
            type="file"
            name="avatar"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => {
              setValue("featured_image", e.target.files[0]);
            }}
          />
          <input
            type="hidden"
            name="avatar_remove"
            onClick={() => {
              resetField("featured_image");
            }}
          />
        </label>
        <span
          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
          data-kt-image-input-action="cancel"
          data-bs-toggle="tooltip"
          title="Cancel avatar"
        >
          <i className="ki-duotone ki-cross fs-2">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </span>
        <span
          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
          data-kt-image-input-action="remove"
          data-bs-toggle="tooltip"
          title="Remove avatar"
        >
          <i className="ki-duotone ki-cross fs-2">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </span>
      </div>
    ),
    [featured_image]
  );

  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [uploadCounter, setUploadCounter] = useState<number>(0);

  const selectMedia = ({ file, id }: { file: File; id: number | null }) => {
    setValue("media", [
      ...productsMedia,
      {
        file: file,
        id: id,
      },
    ]);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    let mediaArray = [];
    acceptedFiles?.forEach(async (file) => {
      selectMedia({
        file: file,
        id: null,
      });
      if (!uploadedMedia.includes(file.name)) {
        await uploadImageApi(file)
          .then(({ data }: { data: uploadMediaResponseType }) => {
            setUploadedMedia((prev) => [...prev, file.name]);
            mediaArray.push({
              file: file,
              id: data.mediaTemp?.id,
            });
            setValue("media", [...productsMedia, ...mediaArray]);
            setUploadCounter((prevCounter) => prevCounter + 1);
          })
          .catch((error) => {});
      } else {
      }
    });
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["create-service"],
    mutationFn: (data: FormData) => createProductServiceApi(data),
  });

  const handleCreateService = async (data: createServiceType) => {
    const formdata = new FormData();
    formdata.append("name", data?.name);
    formdata.append("description", data?.desc);
    formdata.append("category_id", String(data?.category_id));
    formdata.append("featured_image", data?.featured_image);
    formdata.append("phone_1", data?.phone_1);
    formdata.append("external_link", data?.external_link);
    formdata.append("email", data?.email);
    formdata.append("company_id", id);
    formdata.append("type", data?.type);
    formdata.append("yt_link", data?.yt_link);
    formdata.append(
      "promotion_flag",
      data?.is_promoted ? "Pending" : "Not Promoted"
    );

    data?.media?.forEach(({ id }, index) =>
      formdata.append(`mediaTempIds[${index}]`, String(id))
    );

    mutate(formdata, {
      onSuccess() {
        toast.success(`Le produit a été créé avec succès !`);
        navigate(`/company/${id}/products`);
      },
      onError(error, variables, context) {
        toast.error(`Erreur lors de la création d'un produit`);
      },
    });
  };

  return (
    <>
      <PageTitle breadcrumbs={servicesBreadcrumbs}>Create Product</PageTitle>
      <form
        id="kt_ecommerce_add_product_form"
        className="form d-flex flex-column flex-lg-row"
        data-kt-redirect="apps/ecommerce/catalog/products.html"
      >
        <div className="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Image en vedette</h2>
              </div>
            </div>
            <div className="card-body text-center pt-0">
              {PRODUCT_IMAGE}
              {errorMessage(errors, "featured_image")}
              <div className="text-muted fs-7">
                Définir l'image du produit/service. Seules les images *.png,
                *.jpg et *.jpeg sont acceptées.
              </div>
            </div>
          </div>
          <div className="card card-flush py-4">
            <div className="card-body">
              <SelectComponent
                colMD={12}
                colXS={12}
                control={control as any}
                data={CATEGORIES}
                errors={errors}
                label="Catégorie"
                name="category_id"
                noOptionMessage=""
                isLoading={loadingCategories}
                saveOnlyValue
              />
            </div>
          </div>
          <div className="card card-flush py-4">
            <div className="card-body">
              <SelectComponent
                colMD={12}
                colXS={12}
                control={control as any}
                data={[
                  {
                    label: "Produit",
                    value: "Product",
                  },
                  {
                    label: "Service",
                    value: "Service",
                  },
                ]}
                errors={errors}
                label="Type"
                name="type"
                noOptionMessage=""
                saveOnlyValue
              />
            </div>
          </div>
        </div>
        <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="kt_ecommerce_add_product_general"
              role="tab-panel"
            >
              <div className="d-flex flex-column gap-7 gap-lg-10">
                <div className="card card-flush py-4">
                  <div className="card-header">
                    <div className="card-title">
                      <h2>Général</h2>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <InputComponent
                      control={control as any}
                      errors={errors}
                      label="Nom"
                      name="name"
                      type="text"
                      required
                      description="Nom du produit/service"
                      className="mb-10 fv-row"
                      colMD={12}
                      colXS={12}
                    />
                    <div>
                      <label className="form-label">Description</label>
                      <TextEditor
                        control={control as any}
                        name="description"
                        setValue={setValue}
                        withPreview={false}
                        // withPreview={false}
                      />
                      {errorMessage(errors, "desc")}
                    </div>
                  </div>
                </div>
                <div className="card card-flush py-4">
                  <div className="card-header">
                    <div className="card-title">
                      <h2>Galerie photos</h2>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="fv-row mb-2">
                      <Dropzone
                        dropzone={{
                          accept: {
                            "image/*": [],
                            "video/*": [],
                          },
                          multiple: true,
                          onDrop: onDrop,
                          onError(err) {},
                          onDropRejected(fileRejections, event) {
                            fileRejections?.forEach((file) => {
                              toast.error(`The selected file is not supported`);
                            });
                          },
                        }}
                        description="Seules les images, les vidéos et les documents sont acceptés"
                      />
                      {errorMessage(errors, "media")}

                      <SelectedMediaList
                        setUploadedMedia={setUploadedMedia}
                        control={control as any}
                        setValue={setValue}
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="card card-flush py-4">
                  <div className="card-header">
                    <div className="card-title">
                      <h2>Documents (pdf)</h2>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="fv-row mb-2">
                      <Dropzone
                        dropzone={{
                          accept: {
                            "image/*": [],
                            "video/*": [],
                          },
                          multiple: true,
                          onDrop: onDrop,
                          onError(err) {
                            
                          },
                          onDropRejected(fileRejections, event) {
                            fileRejections?.forEach((file) => {
                              toast.error(`The selected file is not supported`);
                            });
                          },
                        }}
                        description="Seules les images, les vidéos et les documents sont acceptés"
                      />

                      <SelectedMediaList
                        setUploadedMedia={setUploadedMedia}
                        control={control as any}
                        setValue={setValue}
                      />
                    </div>
                  </div>
                </div> */}

                <div className="card card-flush py-4">
                  <div className="card-body">
                    <InputComponent
                      colXS={12}
                      colMD={12}
                      name="yt_link"
                      control={control as any}
                      errors={errors}
                      label="Vidéo (lien youtube)"
                      type="text"
                    />
                  </div>
                </div>
                <div className="card card-flush py-4">
                  <div className="card-header">
                    <div className="card-title">
                      <h2>Appel à l'action</h2>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="fv-row">
                      <Row xs={12} md={12} className="mt-5">
                        <InputComponent
                          colXS={12}
                          colMD={6}
                          name="email"
                          control={control as any}
                          errors={errors}
                          label="Adresse Email"
                          type="email"
                        />
                        <InputComponent
                          colXS={12}
                          colMD={6}
                          name="phone_1"
                          control={control as any}
                          errors={errors}
                          label="Numéro de téléphone"
                          type="number"
                        />
                        <InputComponent
                          colXS={12}
                          colMD={12}
                          name="external_link"
                          control={control as any}
                          errors={errors}
                          label="Lien externe"
                          type="text"
                        />
                      </Row>

                      <Row xs={12} md={12}>
                        <Col xs={12} md={12}>
                          <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-12 p-6 my-6">
                            <div className="d-flex flex-stack flex-grow-1 ">
                              <div className=" fw-semibold">
                                <h4 className="text-gray-900 fw-bold">
                                  Nous avons besoin de votre attention !
                                </h4>

                                <div className="fs-6 text-gray-700 ">
                                  Si vous souhaitez promouvoir cette{" "}
                                  {watch("type")} cochez cette case (le tarif
                                  sera inclus){" "}
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={(e) =>
                                      setValue("is_promoted", e.target.checked)
                                    }
                                  />
                                  {/* <Checkbox
                                    colMD={4}
                                    colXS={12}
                                    control={control as any}
                                    name="is_promoted"
                                    errors={errors}
                                  >
                                    <span className="fs-4 no-wrap mx-3">
                                      Promouvoir ce service/produit
                                    </span>
                                  </Checkbox> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Link
              to={`/company/${id}/services`}
              id="kt_ecommerce_add_product_cancel"
              className="btn btn-light me-5"
            >
              Annuler
            </Link>
            <button
              onClick={handleSubmit(handleCreateService)}
              className="btn btn-primary"
            >
              {isLoading ? (
                <Spinner animation="border" color="#fff" size="sm" />
              ) : (
                <span className="indicator-label">Créer</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
