import { useMemo, useState } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { InputComponent, TableComponent } from "../../../components";
import { useUser } from "../../../hooks";
import { Card, Row, Spinner } from "react-bootstrap";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { KTIcon } from "../../../../_metronic/helpers";
import { createOccupationApi, updateOccupationApi } from "../../../apis";
import toast from "react-hot-toast";
import useSearch from "../../../hooks/useSearch";
import { Can } from "../../../utils/ability-context";

type occupationProps = {
  label_fr: string;
  label_en: string;
};

export const Occupations = () => {
  const { occupations, loadingOccupations, refetchOccupations } = useUser();

  const columns = [
    {
      name: "Name en",
      selector: (row) => row.label_en,
      sortable: true,
    },
    {
      name: "Name fr",
      selector: (row) => row.label_fr,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <Can I="update" a="occupations">
          <div
            className="cursor-pointer disabled"
            onClick={() => {
              setUpdateRowID(row?.id);
              setValue("label_en", row.label_en);
              setValue("label_fr", row.label_fr);
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

  const OCUUPATIONS = useMemo(() => occupations?.data, [occupations]);
  const [updateRowID, setUpdateRowID] = useState<number | string | boolean>(
    false
  );

  const { search } = useSearch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<occupationProps>();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: async (data: { label_fr: string; label_en: string }) =>
      await createOccupationApi(data),
    mutationKey: ["create-occupations"],
  });

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (data: {
      label_fr: string;
      label_en: string;
      occupation_id: string;
    }) => await updateOccupationApi(data),
    mutationKey: ["update-occupations"],
  });

  const handleCreate = (data: occupationProps) => {
    mutate(data, {
      onSuccess(data, variables, context) {
        toast.success("Occupation has been created successfully");
        setUpdateRowID(false);
        setValue("label_en", "");
        setValue("label_fr", "");
      },
      onError(error, variables, context) {
        toast.error("Occupation has been created successfully");
      },
    });
  };

  const handleUpdate = (data: occupationProps) => {
    if (typeof updateRowID === "number" || typeof updateRowID === "string") {
      updateMutate(
        {
          ...data,
          occupation_id: String(updateRowID),
        },
        {
          onSuccess(data, variables, context) {
            toast.success("Occupation has been updated successfully");
            setUpdateRowID(false);
            setValue("label_fr", "");
            setValue("label_en", "");

            refetchOccupations();
          },
          onError(error, variables, context) {
            toast.error("Error while updating occupation");
          },
        }
      );
    }
  };

  return (
    <div>
      <PageTitle>Occupations</PageTitle>
      <Row xs={12} md={12} lg={12}>
        <Can I="create" a="occupations">
          <Card className="border col-lg-3 col-md-5 col-12 me-2">
            <Card.Header>
              <Card.Title className="fs-3">
                - {updateRowID ? "Update" : "Add"} Occupation :
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <InputComponent
                  control={control as any}
                  errors={errors}
                  label="French Name"
                  name="label_fr"
                  type="text"
                  colXS={12}
                  colMD={12}
                />
                <InputComponent
                  control={control as any}
                  errors={errors}
                  label="English Name"
                  name="label_en"
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
                    className="btn btn-danger"
                    onClick={() => {
                      setUpdateRowID(false);
                      setValue("label_en", "");
                      setValue("label_fr", "");
                    }}
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    className="ms-auto btn btn-success"
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
                  className="ms-auto btn btn-custom-purple-dark text-white"
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
        <Can I="list" a="occupations">
          <TableComponent
            columns={columns as any}
            placeholder="occupation"
            isLoading={loadingOccupations}
            tableClassName="mh-500px overflow-scroll"
            cardClassName="border col-lg-8 col-md-6 col-12"
            data={OCUUPATIONS}
            showSearch={true}
            searchKeys={["label_en", "label_fr"]}
            showCreate={false}
            pagination
          />
        </Can>
      </Row>
    </div>
  );
};
