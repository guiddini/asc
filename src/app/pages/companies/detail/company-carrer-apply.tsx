import { Row } from "react-bootstrap";

const CompanyCarrerApply = () => {
  return (
    <div>
      <div className="text-center my-17">
        <h3 className="fs-2hx text-dark mb-5">Join Us</h3>
        <div className="fs-5 text-muted fw-semibold mw-50 mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel mollitia
          officia commodi architecto dolor atque soluta modi, quo maxime
          adipisci eaque quas fugit accusamus eligendi obcaecati similique,
          consectetur, sed aut.
        </div>
      </div>
      <div className="d-flex flex-column flex-lg-row " id="company-apply">
        <div className="flex-lg-row-fluid me-0 me-lg-20">
          <form
            action="m-0"
            className="form mb-15"
            method="post"
            id="kt_careers_form"
          >
            <Row className="mb-5">
              <div className="col-md-6 fv-row">
                <label className="required fs-5 fw-semibold mb-2">Prénom</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=""
                  name="first_name"
                />
              </div>
              <div className="col-md-6 fv-row">
                <label className="required fs-5 fw-semibold mb-2">Nom</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=""
                  name="last_name"
                />
              </div>
            </Row>
            <div className="row mb-5">
              <div className="col-md-6 fv-row">
                <label className="required fs-5 fw-semibold mb-2">Email</label>
                <input
                  className="form-control form-control-solid"
                  placeholder=""
                  name="email"
                />
              </div>
              <div className="col-md-6 fv-row">
                <label className="fs-5 fw-semibold mb-2">Mobile No</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=""
                  name="mobileno"
                />
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-md-6 fv-row">
                <label className="required fs-5 fw-semibold mb-2">Age</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=""
                  name="age"
                />
              </div>
              <div className="col-md-6 fv-row">
                <label className="required fs-5 fw-semibold mb-2">City</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=""
                  name="city"
                />
              </div>
            </div>
            <div className="d-flex flex-column mb-5 fv-row">
              <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                <span className="required">Position</span>
                <span
                  className="ms-1"
                  data-bs-toggle="tooltip"
                  title="Your payment statements may very based on selected position"
                >
                  <i className="ki-duotone ki-information fs-7">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
              <select
                name="position"
                data-control="select2"
                data-placeholder="Select a position..."
                className="form-select form-select-solid"
              >
                <option value="Web Developer">Web Developer</option>
                <option value="Web Designer">Web Designer</option>
                <option value="Art Director">Art Director</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Project Manager">Project Manager</option>
                <option value="System Administrator">
                  System Administrator
                </option>
              </select>
            </div>
            <div className="row mb-5">
              <div className="col-md-6 fv-row">
                <label className="required fs-5 fw-semibold mb-2">
                  Expected Salary
                </label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=""
                  name="salary"
                />
              </div>
              <div className="col-md-6 fv-row">
                <label className="required fs-5 fw-semibold mb-2">
                  Srart Date
                </label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder=""
                  name="start_date"
                />
              </div>
            </div>
            <div className="d-flex flex-column mb-5 fv-row">
              <label className="fs-5 fw-semibold mb-2">Website (If Any)</label>
              <input
                className="form-control form-control-solid"
                placeholder=""
                name="website"
              />
            </div>
            <div className="d-flex flex-column mb-5">
              <label className="fs-6 fw-semibold mb-2">
                Experience (Optional)
              </label>
              <textarea
                className="form-control form-control-solid"
                //   rows="2"
                name="experience"
                placeholder=""
              ></textarea>
            </div>
            <div className="d-flex flex-column mb-8">
              <label className="fs-6 fw-semibold mb-2">Application</label>
              <textarea
                className="form-control form-control-solid"
                //   rows="4"
                name="application"
                placeholder=""
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              id="kt_careers_submit_button"
            >
              <span className="indicator-label">Apply Now</span>
              <span className="indicator-progress">
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            </button>
          </form>
        </div>
        <div className="flex-lg-row-auto w-100 h-100 w-lg-275px w-xxl-350px">
          <div className="card bg-light">
            <div className="card-body">
              <div className="mb-7">
                <h2 className="fs-1 text-gray-800 w-bolder mb-6">About Us</h2>
                <p className="fw-semibold fs-6 text-gray-600">
                  First, a disclaimer – the entire process of writing a blog
                  post often takes more than a couple of hours, even if you can
                  type eighty words as per minute and your writing skills are
                  sharp.
                </p>
              </div>
              <div className="mb-8">
                <h4 className="text-gray-700 w-bolder mb-0">Requirements</h4>
                <div className="my-2">
                  <div className="d-flex align-items-center mb-3">
                    <span className="bullet me-3"></span>
                    <div className="text-gray-600 fw-semibold fs-6">
                      Experience with JavaScript
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span className="bullet me-3"></span>
                    <div className="text-gray-600 fw-semibold fs-6">
                      Good time-management skills
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span className="bullet me-3"></span>
                    <div className="text-gray-600 fw-semibold fs-6">
                      Experience with React
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="bullet me-3"></span>
                    <div className="text-gray-600 fw-semibold fs-6">
                      Experience with HTML / CSS
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="text-gray-700 w-bolder mb-0">
                  Our Achievements
                </h4>
                <div className="my-2">
                  <div className="d-flex align-items-center mb-3">
                    <span className="bullet me-3"></span>
                    <div className="text-gray-600 fw-semibold fs-6">
                      Experience with JavaScript
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span className="bullet me-3"></span>
                    <div className="text-gray-600 fw-semibold fs-6">
                      Good time-management skills
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span className="bullet me-3"></span>
                    <div className="text-gray-600 fw-semibold fs-6">
                      Experience with React
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="bullet me-3"></span>
                    <div className="text-gray-600 fw-semibold fs-6">
                      Experience with HTML / CSS
                    </div>
                  </div>
                </div>
              </div>
              <a
                href="pages/blog/post.html"
                className="link-primary fs-6 fw-semibold"
              >
                Explore More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCarrerApply;
