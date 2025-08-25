import { Col, Spinner } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";

interface SelectedMediaProps {
  file: File;
  remove: (any) => void;
  id?: string | number | null;
}

const SelectedMedia = ({ file, remove, id }: SelectedMediaProps) => {
  const isUploading = id === null;
  return (
    <Col
      xs={2}
      md={2}
      style={{
        overflow: "hidden",
        width: "120px",
        height: "120px",
        position: "relative",
        display: "block",
      }}
      // className="h-75px mb-4 d-flex align-items-center justify-content-center position-relative overflow-hidden my-4"
    >
      <>
        <button
          className="border-0 bg-transparent position-absolute top-0 end-0"
          onClick={remove}
          disabled={isUploading}
        >
          <i className="fa-solid fa-trash text-danger"></i>
        </button>
        {isUploading ? (
          <div
            className="position-absolute top-0 end-0 start-0 bottom-0 d-flex justify-content-center z-2"
            style={{
              background: "rgb(1, 1, 1,0.5)",
              width: "120px",
              height: "120px",
            }}
          >
            <Spinner
              animation="border"
              color="#fff"
              className="z-3 text-light m-auto"
            />
          </div>
        ) : (
          <></>
        )}
        <div
          style={{
            width: "120px",
            height: "120px",
          }}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          {file !== null && (
            <>
              {file?.type === "application/pdf" ? (
                <>
                  <img
                    src={toAbsoluteUrl("/media/svg/files/pdf.svg")}
                    className="object-fit-cover"
                    style={{
                      width: "auto",
                      height: "120px",
                    }}
                  />
                  <span className="text-muted text-center">{file.name}</span>
                </>
              ) : (
                <img
                  src={URL?.createObjectURL(file)}
                  className="object-fit-cover"
                  style={{
                    width: "auto",
                    height: "120px",
                  }}
                />
              )}
            </>
          )}
        </div>
      </>
    </Col>
  );
};

export default SelectedMedia;
