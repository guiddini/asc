import { useNavigate } from "react-router-dom";
import { useAuth } from "../..";

const CompletedProfile = () => {
  const navigate = useNavigate();
  function parseYouTubeLink(originalLink) {
    // Extract the video ID from the original link
    const videoIdMatch = originalLink.match(
      /(?:\?v=|\/embed\/|\/\d\/|\/vi\/|\/e\/|https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1];

      // Construct the embeddable link
      const embedLink = `https://www.youtube.com/embed/${videoId}`;

      return embedLink;
    } else {
      // If the link format is not recognized, return null or handle it accordingly
      return null;
    }
  }
  return (
    <div className="w-100">
      <div className="pb-8 pb-lg-10">
        <h2 className="fw-bold text-dark">Bienvenue</h2>
        <div className="text-muted fw-semibold fs-6">
          Vous devez follow les étapes de cette vidéo pour mieux comprendre le
          fonctionnement de la plateforme.
        </div>
      </div>
      <iframe
        src={parseYouTubeLink("https://www.youtube.com/watch?v=XB1Ls2XNLAw")}
        className="w-100 h-350px rounded-3"
      ></iframe>
      <div className="d-flex flex-row align-items-center justify-content-end mt-6">
        <button
          type="button"
          id="kt_sign_in_submit"
          className="btn btn-custom-purple-dark text-white"
          onClick={() => {
            window.location.reload();
            navigate("/");
          }}
        >
          <span className="indicator-label">Continuer</span>
        </button>
      </div>
    </div>
  );
};

export default CompletedProfile;
