import React from "react";
import { Loader } from "lucide-react";

interface PageLoadingProps {
  message?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({
  message = "Loading...",
}) => {
  return (
    <div id="page-loading">
      <div id="page-loading-content">
        <Loader id="page-loading-spinner" size={48} />
        {message && <p id="page-loading-message">{message}</p>}
      </div>
    </div>
  );
};

export default PageLoading;
