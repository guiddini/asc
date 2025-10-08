import React from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createConference } from "../../../apis/conference";
import toast from "react-hot-toast";
import { Conference } from "../../../types/conference";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  title: yup.string().required("Le titre est obligatoire"),
  description: yup.string().required("La description est obligatoire"),
  start_time: yup.string().required("L'heure de début est obligatoire"),
  end_time: yup
    .string()
    .required("L'heure de fin est obligatoire")
    .test(
      "is-after",
      "L'heure de fin doit être après l'heure de début",
      function (value) {
        const { start_time } = this.parent;
        return new Date(value) > new Date(start_time);
      }
    ),
  location: yup.string().required("Le lieu est obligatoire"),
  status: yup.string().required("Le statut est obligatoire"),
});

const formatForBackend = (dtLocal: string) => {
  const d = new Date(dtLocal);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
};

interface Props {
  show: boolean;
  onClose: () => void;
}

const CreateConferenceModal: React.FC<Props> = ({ show, onClose }) => {
  const queryClient = useQueryClient();
  const navigation = useNavigate();
  const mutation = useMutation(createConference, {
    onSuccess(data: Conference) {
      queryClient.invalidateQueries("conferences");
      toast.success("Conférence créée avec succès");
      onClose();
      navigation(`/conferences-management/${data?.id}`);
    },
    onError() {
      toast.error("Échec de la création de la conférence");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "draft",
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      start_time: formatForBackend(data.start_time),
      end_time: formatForBackend(data.end_time),
    };
    mutation.mutate(payload);
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" size="lg" centered>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Créer une conférence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Titre</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.title}
              {...register("title")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              isInvalid={!!errors.description}
              {...register("description")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Heure de début</Form.Label>
            <Form.Control
              type="datetime-local"
              isInvalid={!!errors.start_time}
              {...register("start_time")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.start_time?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Heure de fin</Form.Label>
            <Form.Control
              type="datetime-local"
              isInvalid={!!errors.end_time}
              {...register("end_time")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.end_time?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lieu</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.title}
              {...register("location")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.location?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Statut</Form.Label>
            <Form.Select isInvalid={!!errors.status} {...register("status")}>
              <option value="">Sélectionnez un statut...</option>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.status?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Création..." : "Créer la conférence"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateConferenceModal;
