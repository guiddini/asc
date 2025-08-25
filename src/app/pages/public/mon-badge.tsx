import eventiliLogo from "/public/media/eventili/logo-long.svg";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";

const MonBadge = () => {
  const { userId } = useParams();
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

        <div id="mon-badge-content">
          <h1 id="mon-badge-title">Votre Badge</h1>
          <p id="mon-badge-description">
            Scannez ce QR Code pour un accès rapide et sécurisé à l'événement.
          </p>

          <div id="mon-qrcode-container">
            <QRCode id="qrcode" value={userId} size={150} level="H" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonBadge;
