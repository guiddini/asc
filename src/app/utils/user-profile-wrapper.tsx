import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UserResponse } from "../types/reducers";
import { updateUserFnameApi } from "../apis";

interface UserProfileWrapperProps {
  children: React.ReactNode;
}

const schema = yup
  .object({
    fname: yup
      .string()
      .required("Le prénom est obligatoire")
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .matches(
        /^[a-zA-ZÀ-ÿ\s]*$/,
        "Le prénom ne doit contenir que des lettres"
      ),
    lname: yup
      .string()
      .required("Le nom est obligatoire")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .matches(/^[a-zA-ZÀ-ÿ\s]*$/, "Le nom ne doit contenir que des lettres"),
  })
  .required();

const UserProfileWrapper: React.FC<UserProfileWrapperProps> = ({
  children,
}) => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user && (!user.fname || !user.lname)) {
      setShowModal(true);
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fname: user?.fname || "",
      lname: user?.lname || "",
    },
  });

  const onSubmit = async (data: { fname: string; lname: string }) => {
    try {
      await updateUserFnameApi({
        fname: data.fname,
        lname: data.lname,
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      {children}
      <Modal
        show={showModal}
        backdrop="static"
        keyboard={false}
        centered
        dialogClassName="modal-dialog modal-dialog-centered mw-500px"
      >
        <Modal.Header>
          <Modal.Title>Complétez votre profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="profile-form">
            <div className="mb-3">
              <label htmlFor="fname" className="form-label">
                Prénom
              </label>
              <input
                type="text"
                id="fname"
                className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                {...register("fname")}
                placeholder="Entrez votre prénom"
              />
              {errors.fname && (
                <div className="invalid-feedback">{errors.fname.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="lname" className="form-label">
                Nom
              </label>
              <input
                type="text"
                id="lname"
                className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                {...register("lname")}
                placeholder="Entrez votre nom"
              />
              {errors.lname && (
                <div className="invalid-feedback">{errors.lname.message}</div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            form="profile-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserProfileWrapper;
