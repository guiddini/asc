import { Col, Modal, Row } from "react-bootstrap";
import StadeSelect from "../components/stade-select";
import { useForm } from "react-hook-form";
import { Dropzone, InputComponent, SelectComponent } from "../../../components";
import toast from "react-hot-toast";
import { errorMessage } from "../../../helpers/errorMessage";
import SelectedMediaList from "../../home/components/selected-media-list";
import { uploadImageApi } from "../../../apis";
import { uploadMediaResponseType } from "../../../types/posts";
import { useState } from "react";

const DevTalentModal = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const productsMedia = watch("media") || [];

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
        setUploadedMedia((prev) => [...prev, file.name]);
        mediaArray.push({
          file: file,
          id: Math.random(),
        });
        setValue("media", [...productsMedia, ...mediaArray]);
        setUploadCounter((prevCounter) => prevCounter + 1);
        // await uploadImageApi(file)
        //   .then(({ data }: { data: uploadMediaResponseType }) => {
        //
        //   })
        //   .catch((error) => {
        //
        //   });
      } else {
      }
    });
  };

  return (
    <>
      <Modal.Body className="p-10">
        <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
          <span className={`fw-bold required`}>
            Préférence de participation à l'Événement ?
          </span>
        </label>
        <Row>
          <StadeSelect
            className=" mb-6"
            inputName="stade"
            control={control}
            name="idéation"
            // icon="question"
            title="Ateliers Techniques"
            // desc="Vous êtes au stade de la réflexion et de la génération d'idées. Vous explorez des solutions créatives pour répondre à un besoin ou une opportunité."
            colMD={12}
            colXS={12}
            colLG={12}
          />
          <StadeSelect
            className=" mb-6"
            inputName="stade"
            control={control}
            name="planification"
            // icon="questionnaire-tablet"
            title="Sessions de Débats"
            // desc=" Vous êtes à l'étape de la planification stratégique. Vous définissez vos objectifs, allouez des ressources et établissez un plan d'action détaillé."
            colMD={12}
            colXS={12}
            colLG={12}
          />
          <StadeSelect
            className=""
            inputName="stade"
            control={control}
            name="développement"
            // icon="devices-2"
            title="Découverte des Opportunités Professionnelles"
            // desc="Vous êtes en plein dans la mise en œuvre de votre idée. Vous construisez des prototypes, développez des produits ou des solutions, et travaillez à les améliorer continuellement."
            colMD={12}
            colXS={12}
            colLG={12}
          />
          <SelectComponent
            control={control as any}
            data={[
              {
                label: "Junior",
                value: "junior",
              },
              {
                label: "Intermédiaire",
                value: "intermédiaire",
              },
              {
                label: "Senior",
                value: "senior",
              },
            ]}
            label="Niveau d'expérience en développement "
            errors={errors}
            name="type"
            colMD={12}
            colXS={12}
            className="mt-7"
            isMulti={false}
          />

          <div className="separator mt-2 mb-6"></div>

          <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
            <span className={`fw-bold`}>
              Si vous désirez postuler à des offres d'emploi ou de stage
              proposées par les exposants, veuillez bien vouloir soumettre votre
              CV.
            </span>
          </label>

          <Dropzone
            dropzone={{
              accept: {
                "application/pdf": [".pdf"],
                "application/msword": [".doc", ".docx"],
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
            description="Uniquement les documents et fichiers PDF"
          />
          {errorMessage(errors, "cv")}

          <SelectedMediaList
            setUploadedMedia={setUploadedMedia}
            control={control as any}
            setValue={setValue}
          />

          <InputComponent
            control={control as any}
            errors={errors}
            label="Présentez votre portfolio"
            name="portfolio"
            type="text"
            placeholder="www.portfolio.com"
            colMD={12}
            colXS={12}
          />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn mb-3 order-last order-md-first text-light"
          style={{
            backgroundColor: "#00c4c4",
          }}
          // onClick={() => setShowModal(true)}
        >
          Participer
        </button>
      </Modal.Footer>
    </>
  );
};

export default DevTalentModal;
