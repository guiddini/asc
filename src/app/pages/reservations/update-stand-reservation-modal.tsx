import { Modal, Button, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { SelectComponent } from "../../components";
import {
  getSpaceOptionObjectByValue,
  getStandTypeObject,
  spaceOptions,
  StandsTypes,
} from "../../utils/standsData";

interface UpdateStandReservationModalProps {
  show: boolean;
  onHide: () => void;
  currentStandType: string;
  currentSpaceSize: string;
}

interface FormData {
  standType: { value: string; label: string };
  spaceSize: { value: string; label: string };
}

export const UpdateStandReservationModal: React.FC<
  UpdateStandReservationModalProps
> = ({ show, onHide, currentStandType, currentSpaceSize }) => {
  const standType = getStandTypeObject(currentStandType);
  const spaceSize = getSpaceOptionObjectByValue(currentSpaceSize);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      standType,
      spaceSize,
    },
  });

  const watchStandType = watch("standType");

  const handleFormSubmit = (data: FormData) => {
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mettre à jour la réservation du stand</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Row>
            <SelectComponent
              name="standType"
              control={control}
              errors={errors}
              label="Type de stand"
              data={StandsTypes}
              placeholder="Sélectionnez un type de stand"
              required={true}
              colXS={12}
              colMD={12}
              defaultValue={standType}
            />

            <SelectComponent
              name="spaceSize"
              control={control}
              errors={errors}
              key={watchStandType?.label}
              label="Espace d'exposition souhaité"
              disabled={!watchStandType}
              data={
                watchStandType
                  ? spaceOptions[
                      watchStandType.value as keyof typeof spaceOptions
                    ]
                  : []
              }
              placeholder="Sélectionnez une taille d'espace"
              required={true}
              colXS={12}
              colMD={12}
              defaultValue={spaceSize}
            />
          </Row>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit(handleFormSubmit)}>
          Mettre à jour
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
