const errorMessage = (errors: any, error: string) => {
  if (errors) {
    if (error) {
      return (
        <div className="fv-plugins-message-container my-2" key={errors}>
          <span role="alert" className="text-danger">
            {errors[error]?.message}
          </span>
        </div>
      );
    }
  }
};

const isError = (errors: any, error: string) => {
  if (errors) {
    if (error) {
      if (errors[error]?.message) return true;
      else return false;
    }
  }
};

export { errorMessage, isError };
