import React from "react";
import { Button } from "react-bootstrap";
import { Check, Copy, Unlink } from "lucide-react";
import toast from "react-hot-toast";

interface UpdateShareLinkSuccessProps {
  link: string;
}

const UpdateShareLinkSuccess: React.FC<UpdateShareLinkSuccessProps> = ({
  link,
}) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
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

      <h3 id="share-success-heading">Votre Lien A Été Mis à Jour !</h3>
      <p id="share-success-description">
        Copiez-le et partagez-le avec votre public.
      </p>

      <div id="share-success-link-display">
        <Unlink size={20} />
        <span>{link}</span>
      </div>

      <Button
        onClick={handleCopyLink}
        id="share-success-copy-button"
        variant="success"
      >
        <Copy size={20} />
        Copier Le Lien
      </Button>
    </div>
  );
};

export default UpdateShareLinkSuccess;
