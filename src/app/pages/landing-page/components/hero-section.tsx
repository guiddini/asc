import React, { useState, useEffect } from "react";
import bg01 from "../../../../../public/hero.mp4";
import { Link } from "react-router-dom";
import UserTypeComponent from "../layout/type-user-component";

type Item = {
  id: number;
  image: string;
  subtitle: string;
  price?: string;
  title: string;
  desc: string;
};

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTypeComponent, setShowTypeComponent] = useState(false);
  const handleType = () => setShowTypeComponent(true);
  const handleCloseType = () => setShowTypeComponent(false);

  const item: Item = {
    id: 1,
    image: bg01,
    subtitle: "Raising African Champions",
    price: "$19",
    title: "Raising African Champions",
    desc: "Rejoignez le plus grand rassemblement des champions africains de l'innovation et de l'entrepreneuriat.",
  };

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  const renderAction = (id: number) => {
    if (id === 1) {
      return (
        <div className="mt-4 pt-2">
          <Link
            to="#"
            className="btn"
            style={{
              background: "linear-gradient(90deg, #0090C7, #57C1DC)",
              border: "none",
              color: "#fff",
              padding: "14px 32px", // plus grand
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "1.1rem", // texte plus grand
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              minWidth: "350px", // largeur mini
              minHeight: "50px", // hauteur mini
              justifyContent: "center",
            }}
            onClick={handleType}
          >
            <i className="uil uil-envelope" style={{ fontSize: "1.3rem" }}></i>
            Rejoignez-nous
          </Link>
        </div>
      );
    } else if (id === 2) {
      return (
        <div className="mt-4 pt-2">
          <form className="d-flex justify-content-center">
            <input
              type="email"
              id="email"
              name="email"
              className="form-control w-auto me-2 rounded"
              placeholder="E-mail"
              required
            />
            <button type="submit" className="btn btn-primary">
              Book Space
            </button>
          </form>
        </div>
      );
    } else {
      return (
        <div className="mt-4 pt-2">
          <Link
            to="#"
            id="playbtn"
            className="btn btn-primary btn-lg rounded-circle"
          >
            ▶
          </Link>
          <span className="fw-bold text-uppercase small text-light ms-2">
            Watch Now
          </span>
        </div>
      );
    }
  };

  return (
    <section
      className="side-events-section vh-100 position-relative d-flex align-items-center justify-content-center text-center"
      style={{
        width: "100vw",
        margin: "0 calc(-50vw + 50%)",
        padding: "5rem 0",
        overflow: "hidden",
      }}
    >
      {/* Background Video */}
      <video
        className="position-absolute top-0 start-0 w-100 h-100"
        src={item.image}
        autoPlay
        muted
        loop
        playsInline
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      ></video>

      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "#3c4858b3",
        }}
      ></div>

      {/* Animated diagonal lines - Left side */}
      <div className="diagonal-lines left-diagonals">
        <div className="diagonal-line red"></div>
        <div className="diagonal-line blue"></div>
        <div className="diagonal-line green"></div>
        <div className="diagonal-line yellow"></div>
      </div>

      {/* Animated diagonal lines - Right side */}
      <div className="diagonal-lines right-diagonals">
        <div className="diagonal-line red"></div>
        <div className="diagonal-line blue"></div>
        <div className="diagonal-line green"></div>
        <div className="diagonal-line yellow"></div>
      </div>

      {/* Content */}
      <div
        className={`container position-relative content-box ${
          isVisible ? "show" : ""
        }`}
      >
        <img
          src="/media/eventili/logos/logo.svg"
          alt="Event Logo"
          className="logo-image mb-4"
          height="100"
        />
        <p className="display-5 fw-bold mb-4 text-white text-uppercase" style={{fontSize:"35px"}}>
          {item.title}
        </p>
        <p
          className="lead text-white-50 mx-auto fs-4"
          style={{ maxWidth: "500px", fontWeight: "bold" }}
        >
          {item.desc}
        </p>
        <h5 className="mt-4 text-white fw-semibold">
          Du <span style={{ color: "#64B45C", fontWeight: "bold" }}>06</span> au{" "}
          <span style={{ color: "#64B45C", fontWeight: "bold" }}>
            08 Decembre 2025
          </span>
        </h5>
        <h6 className="text-white-50 mt-2">
          Centre International de Conference Abdeelatif Rahal, Alger, Algérie
        </h6>
        {renderAction(item.id)}
      </div>
      <UserTypeComponent show={showTypeComponent} onHide={handleCloseType} />

      {/* Styles */}
      <style>{`
        /* Content animation */
        .content-box {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1.2s ease-in-out;
        }
        .content-box.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* Diagonal lines container */
        .diagonal-lines {
          position: absolute;
          top: 0;
          height: 100%;
          width: 70px;
          z-index: 2;
          overflow: hidden;
        }
        .left-diagonals {
          left: 0;
        }
        .right-diagonals {
          right: 0;
        }

        /* Lines */
        .diagonal-line {
          position: absolute;
          width: 6px;
          height: 180px;
          transform-origin: center;
          opacity: 1; /* Toujours visibles */
          border-radius: 4px;
        }

        /* Left side diagonals */
        .left-diagonals .diagonal-line {
          left: 20px;
          transform: rotate(45deg);
        }
        .left-diagonals .diagonal-line:nth-child(1) {
          top: -100px;
          animation: leftDiagonalMove 12s infinite linear;
        }
        .left-diagonals .diagonal-line:nth-child(2) {
          top: 150px;
          animation: leftDiagonalMove 10s infinite linear;
          animation-delay: 2s;
        }
        .left-diagonals .diagonal-line:nth-child(3) {
          top: 300px;
          animation: leftDiagonalMove 14s infinite linear;
          animation-delay: 4s;
        }
        .left-diagonals .diagonal-line:nth-child(4) {
          top: 450px;
          animation: leftDiagonalMove 16s infinite linear;
          animation-delay: 6s;
        }

        /* Right side diagonals */
        .right-diagonals .diagonal-line {
          right: 20px;
          transform: rotate(-45deg);
        }
        .right-diagonals .diagonal-line:nth-child(1) {
          top: -100px;
          animation: rightDiagonalMove 12s infinite linear;
        }
        .right-diagonals .diagonal-line:nth-child(2) {
          top: 150px;
          animation: rightDiagonalMove 10s infinite linear;
          animation-delay: 3s;
        }
        .right-diagonals .diagonal-line:nth-child(3) {
          top: 300px;
          animation: rightDiagonalMove 14s infinite linear;
          animation-delay: 5s;
        }
        .right-diagonals .diagonal-line:nth-child(4) {
          top: 450px;
          animation: rightDiagonalMove 16s infinite linear;
          animation-delay: 7s;
        }

        /* Neon gradient colors */
        .diagonal-line.red {
          background: linear-gradient(to bottom, #64B45C, #37B294, #64B45C);
          box-shadow: 0 0 15px #64B45C, 0 0 30px #f37B294;
        }
        .diagonal-line.blue {
          background: linear-gradient(to bottom, #3072B7, #37B294, #2196F3);
          box-shadow: 0 0 15px #3072B7, 0 0 30px #64B5F6;
        }
        .diagonal-line.green {
          background: linear-gradient(to bottom, #009BB7, #81C784, #009BB7);
          box-shadow: 0 0 15px #009BB7, 0 0 30px #009BB7;
        }
        .diagonal-line.yellow {
          background: linear-gradient(to bottom, #002040, #0090C7, #002040);
          box-shadow: 0 0 15px #002040, 0 0 30px #0090C7;
        }

        /* Animations */
        @keyframes leftDiagonalMove {
          0% { transform: rotate(45deg) translateY(-200px); }
          100% { transform: rotate(45deg) translateY(110vh); }
        }
        @keyframes rightDiagonalMove {
          0% { transform: rotate(-45deg) translateY(-200px); }
          100% { transform: rotate(-45deg) translateY(110vh); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
