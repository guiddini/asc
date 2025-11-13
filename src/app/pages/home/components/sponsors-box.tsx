import React, { useMemo } from "react";
import { Carousel } from "react-bootstrap";
import { useQuery } from "react-query";
import { clickAdsApi, getAllActiveAdsApi } from "../../../apis";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

interface Ad {
  id: number;
  name: string;
  image_path: string;
  company_id: string;
  link: string;
  status: "Published" | null; // Use a union type for "Published" or null
  status_reason: string | null; // Can be null, so use union with string
  clicks: number | null; // Can be null, so use union with number
  start_date: string; // Dates are typically strings
  end_date: string;
  created_at: string; // Dates are typically strings
  updated_at: string; // Dates are typically strings
}

export const SponsorsBox = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryFn: getAllActiveAdsApi,
    queryKey: ["get-all-active-ads"],
  });
  const ADS: Ad[] = data?.data;

  const clickAdView = async (id: string | number, link: string) => {
    try {
      await clickAdsApi(id).then((res) => {
        window.open(link, "_blank");
      });
    } catch (error) {}
  };

  return (
    <div className="w-lg-325px h-lg-325px w-md-100 h-md-100 mb-3 overflow-hidden rounded">
      {ADS?.length > 0 ? (
        <Carousel
          indicators={false}
          style={{
            height: "100%",
          }}
        >
          {ADS?.map((ad) => (
            <Carousel.Item id="carousel-item" key={ad?.id}>
              <div className="overlay">
                <img
                  src={getMediaUrl(ad?.image_path)}
                  alt={ad?.name}
                  id="carousel-img"
                  className="rounded-2"
                />

                <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                  <button
                    // href={ad?.link}
                    // target="_blank"
                    onClick={() => {
                      clickAdView(ad?.id, ad?.link);
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Visiter le site
                  </button>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div className="bg-white w-100 h-lg-325px d-flex flex-column align-items-center justify-content-center">
          <img
            src={toAbsoluteUrl("/media/svg/illustrations/sigma/volume-1.svg")}
            alt="no featured product found"
          />
          <span className="text-muted mt-1 fw-semibold fs-4">No ads found</span>
        </div>
      )}
    </div>
  );
};
