import { Col, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { SelectComponent } from "../../../components";
import Flatpickr from "react-flatpickr";

type MeetingModal = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const MeetingModal = (props: MeetingModal) => {
  const closeModal = () => props?.setIsOpen(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      time: new Date(),
    },
  });

  const time = watch("time");

  return (
    <Modal
      show={props.isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
    >
      <div className="modal-content">
        <div className="modal-header py-7 d-flex justify-content-between">
          <h2>Offer a Deal</h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            data-bs-dismiss="modal"
          >
            <i className="ki-duotone ki-cross fs-1">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </div>
        </div>

        <div className="modal-body">
          <Row xs={12} md={12} lg={12}>
            <SelectComponent
              control={control as any}
              data={[
                {
                  label: "17 Février",
                  value: 17,
                },
                {
                  label: "18 Février",
                  value: 18,
                },
              ]}
              errors={errors}
              label="Select day"
              name="day"
              noOptionMessage=""
              colMD={6}
              colXS={12}
            />
            <SelectComponent
              control={control as any}
              data={[]}
              errors={errors}
              label="Select location"
              name="location"
              noOptionMessage=""
              colMD={6}
              colXS={12}
            />

            <Col xs={12} md={6}>
              <div className="mb-0">
                <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
                  <span className={`fw-bold`}>Select time:</span>
                </label>

                <div
                  className="input-group"
                  id="kt_td_picker_time_only"
                  data-td-target-input="nearest"
                  data-td-target-toggle="nearest"
                >
                  <Flatpickr
                    value={time}
                    onChange={([time]) => {
                      setValue("time", time);
                    }}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: "H:i",
                    }}
                    className="form-control"
                    id="kt_td_picker_time_only_input"
                    placeholder="Pick date"
                  />
                  <span
                    className="input-group-text"
                    data-td-target="#kt_td_picker_time_only"
                    data-td-toggle="datetimepicker"
                  >
                    <i className="ki-duotone ki-calendar fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>{" "}
                  </span>
                </div>
              </div>
            </Col>
            <SelectComponent
              control={control as any}
              data={[
                {
                  label: "10 Minutes",
                  value: 10,
                },
                {
                  label: "15 Minutes",
                  value: 15,
                },
                {
                  label: "20 Minutes",
                  value: 20,
                },
                {
                  label: "30 Minutes",
                  value: 30,
                },
              ]}
              errors={errors}
              label="Select duration"
              name="duration"
              noOptionMessage=""
              colMD={6}
              colXS={12}
            />
          </Row>
        </div>
        <div className="modal-footer d-flex flex-row flex-wrap align-items-center justify-content-between">
          <button className="btn btn-primary">Cancel</button>
          <button className="btn btn-success">Request</button>
        </div>
      </div>
    </Modal>
  );
};

export default MeetingModal;
