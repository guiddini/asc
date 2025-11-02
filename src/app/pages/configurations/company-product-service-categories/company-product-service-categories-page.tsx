import { useState } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Card, Row, Spinner } from "react-bootstrap";
import { InputComponent, TableComponent } from "../../../components";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { KTIcon } from "../../../../_metronic/helpers";
import useProductsCategories, {
  CreateProductsServicesCategoryProps,
} from "./hooks";
import clsx from "clsx";
import { Can } from "../../../utils/ability-context";

export const CompanyProductServiceCategoriesPage = () => {
  const [updateRowID, setUpdateRowID] = useState<number | string | boolean>(
    false
  );

  const columns = [
    {
      name: "Arabic Name",
      selector: (row) => row.name_ar,
      sortable: true,
    },
    {
      name: "French Name",
      selector: (row) => row.name_fr,
      sortable: true,
    },
    {
      name: "English Name",
      selector: (row) => row.name_en,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <Can I="update" a="companyproductsservicecategories">
          <div
            className="cursor-pointer disabled "
            onClick={() => {
              setUpdateRowID(row?.id);
              setValue("name_ar", row.name_ar);
              setValue("name_en", row.name_en);
              setValue("name_fr", row.name_fr);
            }}
          >
            <KTIcon
              iconName="pencil"
              className={`fs-1 cursor-pointer m-0 text-primary disabled `}
            />
          </div>
        </Can>
      ),
    },
  ];

  const {
    createCategory,
    data,
    isCreating,
    loadingCategories,
    refetch,
    isUpdating,
    updateCategory,
    PRODUCTS_CATEGORIES,
  } = useProductsCategories();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateProductsServicesCategoryProps>();

  const handleCreate = async (data: CreateProductsServicesCategoryProps) => {
    createCategory(data, {
      onSuccess: () => {
        refetch();
        toast.success("Category has been created successfully !");
      },
      onError: (error) => {
        toast.error("Error while creating category");
      },
    });
  };

  const handleUpdate = async (data: CreateProductsServicesCategoryProps) => {
    if (typeof updateRowID === "number" || typeof updateRowID === "string") {
      updateCategory(
        {
          ...data,
          category_id: updateRowID,
        },
        {
          onSuccess(data, variables, context) {
            toast.success("Category has been updated successfully");
            setUpdateRowID(false);
            setValue("name_ar", "");
            setValue("name_en", "");
            setValue("name_fr", "");
            refetch();
          },
          onError(error, variables, context) {
            toast.error("Error while updating category");
          },
        }
      );
    }
  };

  return (
    <>
      <PageTitle>Exposants Products/Services Categories</PageTitle>

      <Row xs={12} md={12} lg={12}>
        <Can I="list" a="companyproductsservicecategories">
          <Card className="border col-lg-3 col-md-5 col-12 me-2">
            <Card.Header>
              <Card.Title className="fs-3">
                - {updateRowID ? "Update" : "Add"} Category :
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <InputComponent
                  control={control as any}
                  errors={errors}
                  label="Arabic Name"
                  name="name_ar"
                  type="text"
                  colXS={12}
                  colMD={12}
                />
                <InputComponent
                  control={control as any}
                  errors={errors}
                  label="French Name"
                  name="name_fr"
                  type="text"
                  colXS={12}
                  colMD={12}
                />
                <InputComponent
                  control={control as any}
                  errors={errors}
                  label="English Name"
                  name="name_en"
                  type="text"
                  colXS={12}
                  colMD={12}
                />
              </Row>
            </Card.Body>
            <Card.Footer
              className={clsx("mt-3 w-100 d-flex", {
                "align-items-end": updateRowID === null,
                "flex-row align-items-center justify-content-between":
                  updateRowID,
              })}
            >
              {updateRowID ? (
                <>
                  <button
                    className="btn btn-custom-blue-dark text-white"
                    onClick={() => {
                      setUpdateRowID(false);
                      setValue("name_ar", "");
                      setValue("name_en", "");
                      setValue("name_fr", "");
                    }}
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-custom-purple-dark text-white"
                    onClick={handleSubmit(handleUpdate)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Update"
                    )}
                  </button>
                </>
              ) : (
                <button
                  className="ms-auto btn btn-success"
                  onClick={handleSubmit(handleCreate)}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Add"
                  )}
                </button>
              )}
            </Card.Footer>
          </Card>
        </Can>
        <Can I="list" a="companyproductsservicecategories">
          <TableComponent
            cardClassName="border col-lg-8 col-md-6 col-12"
            columns={columns as any}
            data={PRODUCTS_CATEGORIES}
            placeholder="category"
            onAddClick={() => {}}
            tableClassName="mh-500px overflow-scroll"
            isLoading={loadingCategories}
            showCreate={false}
            showExport={false}
          />
        </Can>
      </Row>
    </>
  );
};
