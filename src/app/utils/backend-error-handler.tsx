import { UseFormSetError, Path } from "react-hook-form";
import { errorResponse } from "../types/responses";

const backendErrorHandler = <T extends {}>(
  setError: UseFormSetError<T>,
  backendErrors: errorResponse
) => {
  const errors = backendErrors.response.data.error;
  const formErrors = {} as Record<keyof T, string>;

  for (const field in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, field)) {
      const path: Path<T> = field as Path<T>;
      setError(path, {
        type: "manual",
        message: errors[field][0], // Assuming there's only one error message per field
      });

      formErrors[field as keyof T] = errors[field][0];
    }
  }

  return formErrors;
};

export default backendErrorHandler;
