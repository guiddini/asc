import { useMemo } from "react";
import { Row, Spinner } from "react-bootstrap";
import { Control, useWatch } from "react-hook-form";
import {
  Checkbox,
  InputComponent,
  SelectComponent,
  TextEditor,
} from "../../../../../components";
import useProductsCategories from "../../../../configurations/company-product-service-categories/hooks";
import getMediaUrl from "../../../../../helpers/getMediaUrl";
import { PageTitle } from "../../../../../../_metronic/layout/core";

const UpdateProductServiceData = ({
  DATA,
  id,
  isLoading,
  control,
  errors,
  setValue,
  resetField,
}: {
  DATA: any;
  id: string;
  isLoading: boolean;
  control: Control;
  errors: any;
  setValue: any;
  resetField: any;
}) => {
  const formdata = useWatch({
    control: control,
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

  const featured_image = useMemo(() => {
    const watchedImage = formdata?.featured_image;

    switch (typeof watchedImage) {
      case "string":
        return getMediaUrl(DATA?.featured_image);
      case "object":
        return watchedImage;

      default:
        getMediaUrl(DATA?.featured_image);
    }
  }, [formdata?.featured_image, DATA, id]);

  const bg_image =
    typeof featured_image === "string"
      ? `url(${featured_image})`
      : featured_image instanceof File
      ? `url('${URL.createObjectURL(featured_image)}')`
      : "";

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
    [featured_image, bg_image, DATA]
  );

  return (
    <>
      {isLoading ? (
        <div
          style={{
            height: "70vh",
          }}
          className="w-100 d-flex justify-content-center align-items-center bg-white"
        >
          <Spinner animation="border" color="#000" />
        </div>
      ) : (
        <>
          <PageTitle>Update Product</PageTitle>
          {DATA && (
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
                    <div className="text-muted fs-7">
                      Définir l'image du produit/service. Seules les images
                      *.png, *.jpg et *.jpeg sont acceptées.
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
                      defaultValue={{
                        label: DATA?.category?.name_fr,
                        value: DATA?.category?.id,
                      }}
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
                      defaultValue={{
                        label: DATA?.type,
                        value: DATA?.type,
                      }}
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
                            defaultValue={DATA?.name}
                          />
                          <div>
                            <label className="form-label">Description</label>
                            <TextEditor
                              control={control as any}
                              name="description"
                              setValue={setValue}
                              withPreview={false}
                            />
                          </div>
                        </div>
                      </div>

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
                            defaultValue={DATA?.yt_link}
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
                              <Checkbox
                                colMD={4}
                                colXS={12}
                                control={control as any}
                                name="is_promoted"
                                errors={errors}
                                isChecked={DATA?.promotion_flag === "Promoted"}
                              >
                                <span className="fs-4 no-wrap mx-3">
                                  Promouvoir ce service/produit
                                </span>
                              </Checkbox>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </>
  );
};

export default UpdateProductServiceData;
