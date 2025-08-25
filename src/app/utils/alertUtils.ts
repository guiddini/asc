import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type AlertType = "success" | "error" | "warning" | "info";

export const showAlert = (type: AlertType, title: string, text: string) => {
  return MySwal.fire({
    icon: type,
    title: title,
    text: text,
    confirmButtonColor: "#2e1065",
  });
};
