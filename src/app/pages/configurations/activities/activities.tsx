import { useMemo, useState } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { InputComponent, TableComponent } from "../../../components";
import { useUser } from "../../../hooks";
import { Can } from "../../../utils/ability-context";
import { KTIcon } from "../../../../_metronic/helpers";
import { useMutation } from "react-query";
import { createActivityApi, updateActivityApi } from "../../../apis";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Card, Row, Spinner } from "react-bootstrap";
import clsx from "clsx";

type ActivityProps = {
  label_fr: string;
  label_en: string;
};

export const Activities = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ActivityProps>();

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
        <Can I="update" a="activities">
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
  const { activities, loadingActivities, refetchActivities } = useUser();
  const [updateRowID, setUpdateRowID] = useState<number | string | boolean>(
    false
  );
  const ACTIVITIES = useMemo(() => activities?.data, [activities]);

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: async (data: { label_fr: string; label_en: string }) =>
      await createActivityApi(data),
    mutationKey: ["create-activity"],
  });

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: async (data: {
      label_fr: string;
      label_en: string;
      activity_area_id: string;
    }) => await updateActivityApi(data),
    mutationKey: ["update-activity"],
  });

  const handleCreate = (data: ActivityProps) => {
    mutate(data, {
      onSuccess(data, variables, context) {
        toast.success("Activity has been created successfully");
        setUpdateRowID(false);
        setValue("label_en", "");
        setValue("label_fr", "");
      },
      onError(error, variables, context) {
        toast.error("Activity has been created successfully");
      },
    });
  };

  const handleUpdate = (data: ActivityProps) => {
    if (typeof updateRowID === "number" || typeof updateRowID === "string") {
      updateMutate(
        {
          ...data,
          activity_area_id: String(updateRowID),
        },
        {
          onSuccess(data, variables, context) {
            toast.success("Activity has been updated successfully");
            setUpdateRowID(false);
            setValue("label_fr", "");
            setValue("label_en", "");

            refetchActivities();
          },
          onError(error, variables, context) {
            toast.error("Error while updating Activity");
          },
        }
      );
    }
  };
  return (
    <div>
      <PageTitle>Activities</PageTitle>
      <Row xs={12} md={12} lg={12}>
        <Can I="create" a="activities">
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
        <Can I="list" a="activities">
          <TableComponent
            columns={columns as any}
            data={ACTIVITIES}
            showCreate={false}
            placeholder="activity"
            isLoading={loadingActivities}
            tableClassName="mh-500px overflow-scroll"
            cardClassName="border col-lg-8 col-md-6 col-12"
          />
        </Can>
      </Row>
    </div>
  );
};
