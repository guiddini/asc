import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { Dropzone } from "../../../components";
import { uploadMediaResponseType } from "../../../types/posts";
import SelectedMediaList from "./selected-media-list";
import toast from "react-hot-toast";
import { uploadImageApi } from "../../../apis";

interface SelectMediaModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  control: Control;
  setValue: UseFormSetValue<any>;
  setUploadedMedia: React.Dispatch<React.SetStateAction<string[]>>;
  uploadedMedia: string[];
}

const SelectMediaModal: React.FC<SelectMediaModalProps> = (props) => {
  const closeModal = () => props.setIsOpen(false);

  const formdata = useWatch({
    control: props.control,
  });

  const media = formdata?.media || [];

  const selectMedia = ({ file, id }: { file: File; id: number | null }) => {
    props.setValue("media", [
      ...media,
      {
        file: file,
        id: id,
      },
    ]);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    let mediaArray: { file: File; id: number | null }[] = [];

    for (const file of acceptedFiles) {
      selectMedia({ file, id: null });

      try {
        const { data }: { data: uploadMediaResponseType } =
          await uploadImageApi(file);

        props.setUploadedMedia((prev) => [...prev, file.name]);

        mediaArray.push({
          file: file,
          id: data.mediaTemp?.id,
        });

        props.setValue("media", [...(media || []), ...mediaArray]);
      } catch (error) {}
    }
  };

  return (
    <Modal
      show={props.isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <Modal.Header>
        <Modal.Title>Sélectionner des fichiers (Images/Videos)</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Dropzone
          dropzone={{
            accept: {
              "video/*": [],
              "image/jpeg": [],
              "image/png": [],
              "image/jpg": [],
            },
            multiple: true,
            onDrop: onDrop,
            onError(err) {},
            onDropRejected(fileRejections) {
              fileRejections?.forEach(() => {
                toast.error(`Le fichier sélectionné n'est pas supporté`);
              });
            },
          }}
        />

        <SelectedMediaList
          control={props.control}
          setValue={props.setValue}
          setUploadedMedia={props.setUploadedMedia}
        />
      </Modal.Body>

      <Modal.Footer className="d-flex flex-row align-items-center justify-content-end">
        <Button variant="custom-purple-dark text-white" onClick={closeModal}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectMediaModal;
