import React, { useState } from "react";
import { useQuery } from "react-query";
import { Spinner, Alert, Button } from "react-bootstrap";
import { ConferencesResponse } from "../../../types/conference";
import { getAllPublishedConferences } from "../../../apis/conference";
import getMediaUrl from "../../../helpers/getMediaUrl";
import AttendConferenceModal from "./attend-conference-modal";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

const MAX_SPEAKER_SHOW = 5;

const ConferenceSection: React.FC = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const isAuthenticated = user?.id;
  const { data, isLoading, isError } = useQuery<ConferencesResponse>(
    "conferences",
    getAllPublishedConferences
  );

  const [modalConferenceId, setModalConferenceId] = useState<string | null>(
    null
  );

  const selectedConference = modalConferenceId
    ? data?.data.find((c) => c.id === modalConferenceId) || null
    : null;

  if (isLoading) {
    return (
      <div id="conference-section-spinner" className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="danger" id="conference-section-error">
        Erreur lors du chargement des conférences.
      </Alert>
    );
  }

  return (
    <section id="conference-section" className="container py-4">
      <div className="w-100 text-center mb-5">
        <h2 className="fw-bold display-4 mb-3">Nos Conférences à l’Affiche</h2>
        <p className="lead text-secondary">
          Découvrez les conférences publiées, leurs thématiques et les experts
          qui y participent
        </p>
      </div>

      <div className="row gx-4 gy-4 justify-content-center">
        {data.data.map((conf) => (
          <div
            key={conf.id}
            className="col-xl-5 col-lg-6 col-md-8 col-sm-12 d-flex"
          >
            <div
              id={`conference-card-${conf.id}`}
              className="shadow-lg rounded-4 p-4 d-flex flex-column justify-content-between w-100"
              tabIndex={0}
              role="button"
              aria-label={`Voir les détails pour ${conf.title}`}
            >
              <div>
                <div className="d-flex align-items-center gap-3 mb-1 flex-wrap">
                  <span
                    id={`date-label-${conf.id}`}
                    className="text-danger fw-bold"
                  >
                    {new Date(conf.start_time).toLocaleString("fr-FR", {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    id={`time-label-${conf.id}`}
                    className="text-muted small"
                  >
                    {new Date(conf.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(conf.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" GMT+1"}
                  </span>
                </div>
                <h4 id={`conf-title-${conf.id}`} className="fw-bold mb-2">
                  {conf.title}
                </h4>
                <p id={`conf-desc-${conf.id}`} className="text-muted mb-3">
                  {conf.description}
                </p>
                <div className="row mb-3 gx-2 gy-2">
                  {conf.speakers.slice(0, MAX_SPEAKER_SHOW).map((speaker) => (
                    <div
                      key={speaker.id}
                      className="col-auto d-flex align-items-center"
                    >
                      <img
                        src={getMediaUrl(speaker?.avatar)}
                        alt={`${speaker.fname} ${speaker.lname}`}
                        id={`speaker-avatar-${speaker.id}`}
                        className="rounded-circle img-fluid me-2"
                      />
                      <div>
                        <span
                          id={`speaker-name-${speaker.id}`}
                          className="fw-semibold"
                        >
                          {speaker.fname}
                        </span>
                        <br />
                        <span
                          id={`speaker-org-${speaker.id}`}
                          className="text-muted small"
                        >
                          {speaker.lname}
                        </span>
                      </div>
                    </div>
                  ))}
                  {conf.speakers.length > MAX_SPEAKER_SHOW && (
                    <div className="col-auto align-self-center">
                      <span
                        id={`additional-speakers-${conf.id}`}
                        className="text-secondary small fw-bold"
                      >
                        +{conf.speakers.length - MAX_SPEAKER_SHOW} intervenants
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                  <span
                    id={`location-badge-${conf.id}`}
                    className="badge bg-light text-dark px-3 py-2 fw-medium"
                  >
                    {conf.location}
                  </span>
                  <span
                    id={`attendee-badge-${conf.id}`}
                    className="badge bg-secondary text-light px-3 py-2"
                  >
                    {conf.attendees.length} Participants
                  </span>
                  {isAuthenticated ? (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setModalConferenceId(conf.id)}
                      className="ms-auto"
                    >
                      Rejoindre la conférence
                    </Button>
                  ) : (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="ms-auto"
                      onClick={() =>
                        alert(
                          "Veuillez vous connecter pour rejoindre la conférence"
                        )
                      }
                    >
                      S’inscrire pour participer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedConference && (
        <AttendConferenceModal
          show={true}
          onHide={() => setModalConferenceId(null)}
          conferenceTitle={selectedConference.title}
          conferenceId={selectedConference.id}
        />
      )}
    </section>
  );
};

export default ConferenceSection;
