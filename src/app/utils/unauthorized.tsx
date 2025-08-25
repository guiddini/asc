import { toAbsoluteUrl } from "../../_metronic/helpers";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="card">
      <div className="card-body d-flex flex-column align-items-center justify-content-center">
        {/* begin::Title */}
        <h1 className="fw-bolder fs-5xl text-gray-900 mb-4">Oops!</h1>
        {/* end::Title */}

        {/* begin::Text */}
        <div className="fw-semibold fs-6 text-gray-500 mb-7">
          Nous ne trouvons pas cette page.
        </div>
        {/* end::Text */}

        {/* begin::Illustration */}
        <div className="mb-3">
          <img
            src={toAbsoluteUrl("/media/auth/404-error.png")}
            className="mw-100 mh-300px"
            alt=""
          />
        </div>
        {/* end::Illustration */}

        {/* begin::Link */}
        <div className="mb-0">
          <Link to="/home" className="btn btn-sm btn-primary">
            Revenir à la page d'accueil
          </Link>
        </div>
      </div>
      {/* end::Link */}
    </div>
  );
};

export default Unauthorized;
