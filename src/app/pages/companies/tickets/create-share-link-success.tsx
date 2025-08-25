import React from "react";
import { Button } from "react-bootstrap";
import { Check, Copy, Link } from "lucide-react";
import toast from "react-hot-toast";

interface CreateShareLinkSuccessProps {
  link: string;
}

const CreateShareLinkSuccess: React.FC<CreateShareLinkSuccessProps> = ({
  link,
}) => {
  const baseURL = window.location.origin;
  const fullLink = baseURL + link;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      toast.success("Lien copié dans le presse-papiers!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div id="share-success-content">
      <div id="share-success-icon">
        <Check size={48} strokeWidth={3} />
      </div>

      <h3 id="share-success-heading">Votre lien a été créé !</h3>
      <p id="share-success-description">
        Copiez-le et partagez-le avec votre public.
      </p>

      <a href={fullLink} id="share-success-link-display">
        <Link size={20} />
        <span>{fullLink}</span>
      </a>

      <Button
        onClick={handleCopyLink}
        id="share-success-copy-button"
        variant="primary"
      >
        <span>Copier Le Lien</span>
        <Copy size={20} />
      </Button>
    </div>
  );
};

export default CreateShareLinkSuccess;
