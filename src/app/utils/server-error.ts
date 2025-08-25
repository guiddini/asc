export interface BackendError {
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export const getServerErrorResponseMessage = (error: BackendError): string => {
  if (error.error) {
    return error.error;
  }
  if (error.message) {
    return error.message;
  }
  if (error.errors) {
    return Object.values(error.errors).flat().join(". ");
  }
  return "Une erreur s'est produite";
};
