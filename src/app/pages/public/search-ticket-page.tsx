import eventiliLogo from "/public/media/eventili/logo-long.svg";
import { Button } from "react-bootstrap";
import { Loader, ScanQrCode } from "lucide-react";
import { useMutation } from "react-query";
import { adjustTicketApi } from "../../apis";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

export const searchTicketSchema = yup.object({
  email: yup
    .string()
    .required("L'adresse e-mail est requise")
    .email("Veuillez entrer une adresse e-mail valide")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Format d'e-mail invalide"
    ),
});

export type SearchTicketFormData = yup.InferType<typeof searchTicketSchema>;

const SearchTicketPage = () => {
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: (email: string) => adjustTicketApi(email),
    mutationKey: ["adjust-ticket"],
  });

  const onsubmit = (data: SearchTicketFormData) => {
    mutate(data.email, {
      onSuccess(data, variables, context) {
        if (data?.data) {
          navigate(`/ticket/qrcode/${data?.data}`, {
            replace: true,
          });
        }
      },
    });
  };
  return (
    <div id="badge-page">
      <div id="badge-container">
        <div id="badge-header">
          <img
            src={eventiliLogo || "/placeholder.svg"}
            alt="Eventili"
            id="eventili-logo"
          />
        </div>

        <div id="badge-content">
          <h1 id="badge-title">
            Obtenez votre badge
            <br />
            instantanément
          </h1>

          <p id="badge-description">
            Accédez facilement à l'événement en générant votre badge QR Code en
            quelques secondes.
          </p>

          <div id="badge-form-container">
            <p id="badge-form-label">
              Entrez votre email pour récupérer votre badge !
            </p>

            <form
              id="search-ticket-badge-form"
              className="w-100"
              onSubmit={handleSubmit(onsubmit)}
            >
              <div id="d-flex flex-column flex-md-row w-100 justify-content-between">
                <input
                  type="email"
                  id="email-input"
                  placeholder="Entrez votre Email"
                  {...register("email")}
                />
                <Button type="submit">
                  {isLoading ? (
                    <Loader id="email-loader" size={20} />
                  ) : (
                    <>
                      <ScanQrCode className="fs-2x text-black" />
                      Verifier
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTicketPage;
