import { Col, Modal, Row } from "react-bootstrap";
import StadeSelect from "../components/stade-select";
import { useForm } from "react-hook-form";
import {
  CountriesSelect,
  Dropzone,
  InputComponent,
  SelectComponent,
  TextAreaComponent,
} from "../../../components";
import toast from "react-hot-toast";
import { errorMessage } from "../../../helpers/errorMessage";
import SelectedMediaList from "../../home/components/selected-media-list";
import { uploadImageApi } from "../../../apis";
import { uploadMediaResponseType } from "../../../types/posts";
import { useState } from "react";

const FintechStrategyModal = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const avatar = watch("avatar");

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
        {/* <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
          <span className={`fw-bold required`}>
            Préférence de participation à l'Événement ?
          </span>
        </label> */}
        <Row>
          <Col className="mb-4" xs={12} md={12}>
            <label className="d-flex align-items-center fs-5 fw-semibold">
              <span className={`fw-bold required`}>Photo de profil</span>
            </label>
            <input
              type="file"
              name="file"
              id="file"
              accept="image/png, image/jpg, image/jpeg"
              className="avatar-inputfile"
              onChange={(e) => setValue("avatar", e.target.files[0])}
            />

            {avatar === undefined || avatar === null ? (
              <label htmlFor="file">
                <span className="text-white m-auto text-center fs-7">
                  Sélectionnez un fichier
                </span>
              </label>
            ) : (
              <div id="avatar-image" className="position-relative">
                <img
                  src={URL?.createObjectURL(avatar)}
                  className="w-100 h-100"
                  id="avatar-image-preview"
                />
                <i
                  className={`ki-duotone ki-trash fs-1 me-5 position-absolute text-danger bg-light rounded-3 top-0 end-0  cursor-pointer`}
                  onClick={() => {
                    setValue("avatar", undefined);
                  }}
                >
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                  <span className="path4"></span>
                  <span className="path5"></span>
                </i>
              </div>
            )}
            {errorMessage(errors, "avatar")}
          </Col>
          <InputComponent
            className=" mb-6"
            control={control}
            name="linkedin"
            label="Lien de votre compte LinkedIn"
            type="text"
            required
            errors={errors}
            // desc="Vous êtes au stade de la réflexion et de la génération d'idées. Vous explorez des solutions créatives pour répondre à un besoin ou une opportunité."
            colMD={6}
            colXS={12}
            placeholder="Exemple : https://www.linkedin.com/in/nom-prenom/"
          />
          <InputComponent
            className=" mb-6"
            control={control}
            name="fonction"
            label="Titre / Fonction"
            type="text"
            required
            errors={errors}
            // desc="Vous êtes au stade de la réflexion et de la génération d'idées. Vous explorez des solutions créatives pour répondre à un besoin ou une opportunité."
            colMD={6}
            colXS={12}
            placeholder="CEO"
          />
          <InputComponent
            className=" mb-6"
            control={control}
            name="type"
            label="Entreprise / Employeur / Freelance"
            type="text"
            required
            errors={errors}
            colMD={12}
            colXS={12}
            placeholder=".."
          />
          <CountriesSelect
            control={control}
            errors={errors}
            colMD={6}
            colXS={12}
            label="Pays de résidence"
          />

          <SelectComponent
            control={control as any}
            data={[
              { label: "Fintech", value: "fintech" },
              { label: "Monétique", value: "monétique" },
              { label: "Assurances", value: "assurances" },
              { label: "E-gouvernement", value: "e-gouvernement" },
              { label: "Cyber sécurité", value: "cyber sécurité" },
              { label: "Finance", value: "finance" },
              { label: "Numérisation", value: "numérisation" },
              { label: "Droit des affaires", value: "droit des affaires" },
              { label: "Ecosystème startup", value: "ecosystème startup" },
              { label: "Blockchain", value: "blockchain" },
              {
                label: "Système d'information",
                value: "système d'information",
              },
              {
                label: "Certification PCI/DSS",
                value: "certification pci/dss",
              },
              { label: "Mobile paiement", value: "mobile paiement" },
              {
                label: "Management de projets",
                value: "management de projets",
              },
              {
                label: "Elaboration des textes de loi",
                value: "elaboration des textes de loi",
              },
              { label: "Autre", value: "autre" },
            ]}
            label="Vous êtes expert en :"
            errors={errors}
            name="expert"
            colMD={6}
            colXS={12}
            isMulti={false}
          />

          <TextAreaComponent
            control={control}
            errors={errors}
            label="En quelques mots, expliquez comment vous envisagez de contribuer à l'élaboration de cette stratégie"
            name="description"
            colXS={12}
            colMD={12}
            className="mt-4"
          />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn mb-3 order-last order-md-first text-light"
          style={{
            backgroundColor: "#59efb2",
          }}
          // onClick={() => setShowModal(true)}
        >
          Participer
        </button>
      </Modal.Footer>
    </>
  );
};

export default FintechStrategyModal;
