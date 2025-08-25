import { Carousel, Col, Container, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { KTIcon } from "../../../../_metronic/helpers";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  findMediaApi,
  getCompanyApi,
  getOneProductServiceApi,
} from "../../../apis";
import { ServiceProductCardType } from "../..";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { MediaPostProps } from "../../home/components/post-box";
import { Company } from "../../../types/user";

export const ProductdetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryFn: () => getOneProductServiceApi(id),
    queryKey: ["get-one-product-service-detail", id],
  });

  const DATA: ServiceProductCardType = useMemo(() => data?.data, [data]);

  const {
    data: media,
    mutate,
    error,
    isLoading: loadingMedia,
  } = useMutation({
    mutationFn: async () => {
      return await findMediaApi(id);
    },
    mutationKey: ["get-one-product-media"],
  });

  useEffect(() => {
    if (DATA?.id) {
      mutate();
    }
  }, [DATA?.id]);

  const PRODUCT_MEDIA: MediaPostProps[] = useMemo(
    () => media?.data,
    [DATA, media]
  );

  const [productCompany, setProductCompany] = useState<Company | null>(null);

  useEffect(() => {
    const getProductCompany = async () => {
      try {
        const res = await getCompanyApi(DATA?.company_id);
        setProductCompany(res.data);
      } catch (error) {}
    };

    if (DATA?.company_id) {
      getProductCompany();
    }
  }, [id, DATA?.company_id]);

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
    <>
      {isLoading ? (
        <div
          style={{
            height: "70vh",
          }}
          className="w-100 d-flex justify-content-center align-items-center bg-white"
        >
          <Spinner animation="border" color="#000" />
        </div>
      ) : (
        <Container fluid>
          <Row xs={12} md={12} className="gap-3">
            <Col xs={12} md={4} className="h-auto d-flex flex-column">
              {/* featured image view */}
              <div className="card w-100">
                <div className="card-body w-100 mh-md-500px overflow-hidden p-3">
                  <img
                    src={getMediaUrl(DATA?.featured_image)}
                    className="w-100 rounded-2"
                  />
                </div>
              </div>
              {/* company view */}
              <div className="card mt-4">
                <div className="card-body">
                  <div className="w-100 d-flex align-items-center">
                    {/*  */}

                    <div
                      className="d-flex flex-row align-items-center my-4 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/company/${productCompany?.id}`);
                      }}
                    >
                      <div className="symbol symbol-35px symbol-fixed position-relative">
                        <img
                          src={getMediaUrl(productCompany?.logo)}
                          alt=""
                          className="rounded-3"
                        />
                      </div>
                      <div className="ms-4">
                        <h4 className="text-gray-700 text-hover-primary my-1 fs-5">
                          Entreprise {productCompany?.legal_status}{" "}
                          {productCompany?.name}
                        </h4>
                        <h6 className="text-gray-500 text-hover-primary fs-6">
                          {productCompany?.email}
                        </h6>
                      </div>
                    </div>
                    <li
                      className="nav-item ms-auto"
                      style={{
                        listStyle: "none",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/company/${productCompany?.id}`);
                      }}
                    >
                      <span className="d-none d-md-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600  btn-custom-purple-light text-white fw-bold px-4 me-1 collapsible ">
                        <KTIcon iconName="eye" className="text-white" />
                        <span>Voir</span>
                      </span>
                    </li>
                    {/*  */}
                  </div>
                  <div className="w-100 d-flex flex-row flex-wrap align-items-center gap-5">
                    {DATA?.email && (
                      <button
                        className="btn btn-sm btn-warning h-40px w-40px w-md-auto h-md-auto d-flex align-items-center justify-content-center  text-nowrap"
                        onClick={() => window.open(`mailto:${DATA?.phone_1}`)}
                      >
                        <i className="fa-solid fa-envelope fs-7 me-0 me-md-1 m-0 p-0"></i>
                        <span className="d-none d-xxl-flex">
                          Envoyer un e-mail
                        </span>
                      </button>
                    )}
                    {DATA?.phone_1 && (
                      <button
                        className="btn btn-sm btn-success h-40px w-40px w-md-auto h-md-auto d-flex align-items-center justify-content-center text-nowrap"
                        onClick={() => window.open(`tel:${DATA?.phone_1}`)}
                      >
                        <i className="fa-solid fa-phone-volume fs-7 me-md-1 m-0 p-0"></i>
                        <span className="d-none d-xxl-flex">
                          Appel {DATA?.phone_1}
                        </span>
                      </button>
                    )}
                    {DATA?.external_link && (
                      <a
                        href={
                          DATA?.external_link
                            ? DATA.external_link.startsWith("http")
                              ? DATA.external_link
                              : `http://${DATA.external_link}`
                            : ""
                        }
                        target="_blank"
                        className="btn btn-sm btn-info h-40px w-40px w-md-auto h-md-auto d-flex align-items-center justify-content-center  text-nowrap"
                      >
                        {" "}
                        <i className="fa-solid fa-globe fs-7 me-0 me-md-1 m-0 p-0"></i>
                        <span className="d-none d-xxl-flex">
                          Voir le site Web
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* images carousel */}
              {PRODUCT_MEDIA?.length > 0 && (
                <div className="card mt-4">
                  <div className="card-body">
                    <h3 className="mb-4">Images du produit :</h3>
                    <Carousel
                      // id="carousel-wrapper"
                      indicators={true}
                      className="rounded-2"
                      interval={null}
                    >
                      {PRODUCT_MEDIA?.map((media) => (
                        <Carousel.Item key={media?.id} className="overlay">
                          {/* <ExampleCarouselImage text="First slide" /> */}
                          <img
                            src={getMediaUrl(media?.path)}
                            alt=""
                            id="carousel-img"
                            style={{
                              maxHeight: "50vh",
                            }}
                          />

                          <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                            <button
                              // href={ad?.link}
                              // target="_blank"
                              onClick={() => {
                                window.open(getMediaUrl(media?.path), "_blank");
                              }}
                              className="btn btn-sm btn-primary"
                            >
                              Voir l'image
                            </button>
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                </div>
              )}
            </Col>
            <Col
              xs={12}
              md={7}
              className="card ps-4 py-3 d-flex ms-3 order-first"
            >
              <div className="card-body">
                <div className="w-100 d-flex align-items-center justify-content-between mb-6">
                  <h1 className="">{DATA?.name}</h1>
                </div>

                <div
                  className="cursor-pointer"
                  dangerouslySetInnerHTML={{
                    __html: DATA?.description,
                  }}
                />

                {DATA?.yt_link && (
                  <iframe
                    className="min-h-350px w-100 d-flex flex-grow-1 rounded-2 mt-8"
                    src={parseYouTubeLink(DATA?.yt_link)}
                  ></iframe>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};
