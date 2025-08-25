import { Route, Routes } from "react-router-dom";
import { Registration } from "./components/Registration";
import { ForgotPassword } from "./components/ForgotPassword";
import { Login } from "./components/Login";
import { AuthLayout } from "./AuthLayout";
import { InivitationAuth } from "./components/InivitationAuth";
import ResetPassword from "./components/reset-password";
import SignupPage from "./components/signup";
import ResetPasswordSuccess from "./components/reset-password-success";
import ConfirmInvitation from "./components/confirm-invitation";

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="invitation" element={<InivitationAuth />} />
      <Route path="registration/:token" element={<Registration />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="reset-password-success" element={<ResetPasswordSuccess />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route index element={<Login />} />
    </Route>
    <Route path="invitation/:code" element={<ConfirmInvitation />} />
  </Routes>
);

export { AuthPage };
