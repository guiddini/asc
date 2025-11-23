import { useState, useCallback } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { PitchDeckWithRelations } from "../../../types/pitch-deck";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { downloadPitchDeck } from "../../../apis/pitch-deck";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactCountryFlag from "react-country-flag";
import { useMutation } from "react-query";
import RoleGuard from "../../../components/role-guard";
import {
  createInvestorConnection,
  deleteInvestorConnection,
} from "../../../apis/investor-connection";
import { Download, MessageCircle, Heart, HeartOff } from "lucide-react";

function PitchDeckCard({ deck }: { deck: PitchDeckWithRelations }) {
  const [downloading, setDownloading] = useState(false);
  const [isFav, setIsFav] = useState<boolean>(!!deck?.is_favorite);

  const addFavoriteMut = useMutation(createInvestorConnection, {
    onSuccess: () => {
      setIsFav(true);
      toast.success("Added to favorites");
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to add to favorites";
      toast.error(msg);
    },
  });

  const removeFavoriteMut = useMutation(deleteInvestorConnection, {
    onSuccess: () => {
      setIsFav(false);
      toast.success("Removed from favorites");
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to remove from favorites";
      toast.error(msg);
    },
  });

  const handleFavoriteToggle = useCallback(() => {
    if (!deck?.id) {
      toast.error("Missing pitch deck identifier");
      return;
    }
    if (isFav) {
      removeFavoriteMut.mutate(deck.id);
    } else {
      addFavoriteMut.mutate({ pitch_deck_id: deck.id });
    }
  }, [deck?.id, isFav, addFavoriteMut, removeFavoriteMut]);

  const handleDownload = useCallback(async () => {
    try {
      setDownloading(true);
      if (!deck?.id) {
        toast.error("Missing pitch deck identifier");
        return;
      }
      const blob = await downloadPitchDeck(deck.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = deck?.file_path?.match(/\.[a-z0-9]+$/i)?.[0] || "";
      const name = (deck?.title?.trim() || "pitch-deck") + ext || "pitch-deck";
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Download started");
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to download pitch deck";
      toast.error(msg);
    } finally {
      setDownloading(false);
    }
  }, [deck?.id, deck?.file_path, deck?.title]);

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex align-items-start">
          {deck?.company?.logo ? (
            <img
              src={getMediaUrl(deck.company.logo)}
              alt={deck?.company?.name || "Company"}
              className="rounded me-3"
              style={{ width: 48, height: 48, objectFit: "cover" }}
            />
          ) : null}
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-1">{deck?.title || "(Untitled)"}</h5>
            </div>
            <div className="text-muted">
              {deck?.company?.id ? (
                <Link
                  to={`/company/${deck.company.id}`}
                  className="text-primary text-decoration-underline fw-semibold d-inline-flex align-items-center"
                  title={deck?.company?.name || "Company"}
                >
                  {deck?.company?.name || "—"}
                  {deck?.company?.country?.code ? (
                    <span className="ms-2 d-inline-flex align-items-center">
                      <ReactCountryFlag
                        svg
                        countryCode={deck.company.country.code}
                        style={{ width: "1.25em", height: "1.25em" }}
                        aria-label={
                          deck?.company?.country?.name_en || "Country"
                        }
                      />
                      <span className="ms-1 fs-8 text-muted">
                        {deck?.company?.country?.name_en || ""}
                      </span>
                    </span>
                  ) : null}
                </Link>
              ) : (
                <span className="text-muted">—</span>
              )}
            </div>
            <div className="text-muted fs-7">
              Uploaded{" "}
              {deck?.created_at
                ? new Date(deck.created_at).toLocaleString()
                : "—"}
            </div>
            {deck?.uploader?.id ? (
              <Link
                to={`/profile/${deck.uploader.id}`}
                className="mt-2 d-inline-flex align-items-center text-primary text-decoration-underline"
                title={
                  `${deck?.uploader?.fname || ""} ${
                    deck?.uploader?.lname || ""
                  }`.trim() || "Uploader"
                }
              >
                {deck?.uploader?.avatar ? (
                  <img
                    src={getMediaUrl(deck.uploader.avatar)}
                    alt="avatar"
                    className="rounded-circle me-2"
                    style={{ width: 24, height: 24, objectFit: "cover" }}
                  />
                ) : (
                  <div className="symbol symbol-circle symbol-24px overflow-hidden me-2">
                    <div className="symbol-label fs-8 bg-light-primary text-primary">
                      {deck?.uploader?.fname?.slice(0, 1) || "U"}
                    </div>
                  </div>
                )}
                <span className="text-gray-700">
                  {(deck?.uploader?.fname || "") +
                    " " +
                    (deck?.uploader?.lname || "")}
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end gap-2">
        {/* Download button */}
        <Button
          size="sm"
          variant="primary"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="me-2" size={18} />
              Download
            </>
          )}
        </Button>

        {/* Favorite button - danger color */}
        <RoleGuard allowedRoles={["investor"]}>
          <Button
            size="sm"
            variant="danger"
            onClick={handleFavoriteToggle}
            disabled={addFavoriteMut.isLoading || removeFavoriteMut.isLoading}
          >
            {addFavoriteMut.isLoading || removeFavoriteMut.isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {isFav ? "Removing..." : "Adding..."}
              </>
            ) : (
              <>
                {isFav ? (
                  <HeartOff className="me-2" size={18} />
                ) : (
                  <Heart className="me-2" size={18} />
                )}
                {isFav ? "Unfavorite" : "Favorite"}
              </>
            )}
          </Button>
        </RoleGuard>

        {/* Contact button */}
        {deck.uploader?.id ? (
          <Link
            to={`/chat?to=${deck.uploader.id}`}
            className="btn btn-success btn-sm"
          >
            <MessageCircle className="me-2" size={18} />
            Contact
          </Link>
        ) : (
          <Button size="sm" variant="success" disabled>
            <MessageCircle className="me-2" size={18} />
            Contact
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
}

export default PitchDeckCard;
