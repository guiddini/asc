import React, { useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateConference, showConferenceById } from "../../../apis/conference";
import toast from "react-hot-toast";

interface UpdateConference {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
}

const schema = yup.object().shape({
  title: yup.string().required("Le titre est obligatoire"),
  description: yup
    .string()
    .required("La description est obligatoire")
    .max(250, "La description ne peut pas dépasser 250 caractères"),
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

const toDateTimeLocal = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

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
  conferenceId: string;
}

const UpdateConferenceModal: React.FC<Props> = ({
  show,
  onClose,
  conferenceId,
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ["conference", conferenceId],
    () => showConferenceById(conferenceId),
    { enabled: show, retry: false }
  );

  const mutation = useMutation(
    (data: UpdateConference) => updateConference(conferenceId, data),
    {
      onSuccess() {
        queryClient.invalidateQueries("conferences");
        toast.success("Conférence mise à jour avec succès");
        onClose();
      },
      onError() {
        toast.error("Échec de la mise à jour de la conférence");
      },
    }
  );

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data?.conference) {
      reset({
        title: data.conference.title,
        description: data.conference.description,
        start_time: toDateTimeLocal(data.conference.start_time),
        end_time: toDateTimeLocal(data.conference.end_time),
        location: data.conference.location,
        status: data.conference.status,
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: UpdateConference) => {
    const payload = {
      ...formData,
      start_time: formatForBackend(formData.start_time),
      end_time: formatForBackend(formData.end_time),
    };
    mutation.mutate(payload);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" backdrop="static" centered>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la conférence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center my-3">
              Impossible de charger les données de la conférence.
            </Alert>
          ) : (
            <>
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
                <Form.Select
                  isInvalid={!!errors.location}
                  {...register("location")}
                >
                  <option value="">Sélectionnez un lieu...</option>
                  {["1", "2"].map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.location?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Statut</Form.Label>
                <Form.Select
                  isInvalid={!!errors.status}
                  {...register("status")}
                >
                  <option value="">Sélectionnez un statut...</option>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.status?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={mutation.isLoading || isLoading}
          >
            {mutation.isLoading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateConferenceModal;
