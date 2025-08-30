import React, { useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { GALLERY_IMAGES } from "../data/gallery-images";

const EventGallerySection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imagesPerSlide = 8;
  const totalSlides = Math.max(1, GALLERY_IMAGES.length - imagesPerSlide + 1);

  // Get current visible images based on slide index
  const getCurrentImages = () => {
    return GALLERY_IMAGES.slice(
      currentSlideIndex,
      currentSlideIndex + imagesPerSlide
    );
  };

  // Handle image click to open modal
  const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(currentSlideIndex + imageIndex);
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Navigation in modal
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1
    );
  };

  // Row navigation with animation
  const handlePrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
      setIsTransitioning(false);
    }, 150);
  };

  const handleNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <section
      className="event-gallery-section"
      style={{
        width: "100%",
        margin: "0 calc(-50vw + 50%)",

        padding: "5rem 0",
        backgroundColor: "var(--bs-light)",
      }}
    >
      <Container
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 15px",
        }}
      >
        {/* Section Header */}
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="display-5 fw-bold text-dark mb-3">
              ASC 2024 IN PICTURES
            </h2>
            <p className="lead text-muted">
              Relive the moments from our previous events
            </p>
          </Col>
        </Row>

        {/* Gallery with Centered Navigation */}
        <div className="gallery-with-navigation">
          {/* Left Arrow */}
          <div className="gallery-nav-container gallery-nav-left">
            <Button
              variant="light"
              className="gallery-nav-btn"
              onClick={handlePrevSlide}
              disabled={totalSlides <= 1 || isTransitioning}
            >
              <i className="bi bi-chevron-left"></i>
            </Button>
          </div>

          {/* Gallery Container */}
          <div className="gallery-container">
            <div
              className={`gallery-slider ${
                isTransitioning ? "transitioning" : ""
              }`}
            >
              <Row className="g-3">
                {getCurrentImages().map((image, index) => (
                  <Col
                    key={`${currentSlideIndex}-${index}`}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={3}
                    xl={1.5}
                    className="gallery-item-col"
                  >
                    <div
                      className="gallery-item"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={image}
                        alt={`Gallery image ${currentSlideIndex + index + 1}`}
                        className="gallery-image"
                      />
                      <div className="gallery-overlay">
                        <i className="bi bi-zoom-in"></i>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>

          {/* Right Arrow */}
          <div className="gallery-nav-container gallery-nav-right">
            <Button
              variant="light"
              className="gallery-nav-btn"
              onClick={handleNextSlide}
              disabled={totalSlides <= 1 || isTransitioning}
            >
              <i className="bi bi-chevron-right"></i>
            </Button>
          </div>
        </div>

        {/* Gallery Counter */}
        <div className="text-center mt-4">
          <span className="gallery-counter text-muted">
            Row {currentSlideIndex + 1} of {totalSlides}
          </span>
        </div>
      </Container>

      {/* Image Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="xl"
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            Image {currentImageIndex + 1} of {GALLERY_IMAGES.length}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 position-relative">
          <div className="modal-image-container">
            <img
              src={GALLERY_IMAGES[currentImageIndex]}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="modal-image"
            />

            {/* Modal Navigation */}
            <Button
              variant="light"
              className="modal-nav-btn modal-nav-prev"
              onClick={handlePrevImage}
            >
              <i className="bi bi-chevron-left"></i>
            </Button>

            <Button
              variant="light"
              className="modal-nav-btn modal-nav-next"
              onClick={handleNextImage}
            >
              <i className="bi bi-chevron-right"></i>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default EventGallerySection;
