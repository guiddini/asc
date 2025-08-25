import { useDropzone, DropzoneOptions } from "react-dropzone";

export const Dropzone = ({
  dropzone,
  description,
}: {
  dropzone?: DropzoneOptions;
  description?: string;
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    ...dropzone,
  });
  return (
    <>
      <div
        className="dropzone "
        id="kt_ecommerce_add_product_media"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="dz-message needsclick">
          <i className="ki-duotone ki-file-up text-primary fs-3x">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <div className="ms-4">
            <h3 className="fs-5 fw-bold text-gray-900 mb-1">
              Déposez les fichiers ici ou cliquez pour les télécharger.
            </h3>

            {description ? (
              <span className="fs-7 fw-semibold text-gray-500">
                {description}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
