const HowItWorks = () => {
  return (
    <section id="how-it-works">
      <div id="how-it-works-container">
        <div id="how-it-works-header">
          <div id="how-it-works-title">
            <span id="how-it-works-tag">
              AFES 2025 : L'ÉVÉNEMENT À NE PAS MANQUER !
            </span>
            <h1>
              Rejoignez-nous{" "}
              <span className="text-black">
                pour une expérience inoubliable !
              </span>
            </h1>
          </div>
          <button id="how-it-works-cta">Réserver un ticket</button>
        </div>

        <div id="how-it-works-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/wCH8wIMwLT4?si=npfFEvNlpvd-pdo_"
            title="Comment participer à AFES 2025"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
