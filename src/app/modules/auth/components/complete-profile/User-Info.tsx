import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../../../../hooks";
import {
  CommuneSelect,
  CountriesSelect,
  InputComponent,
  SelectComponent,
  WillayasSelect,
} from "../../../../components";
import { CompleteProfile } from "../../../../types/user";
import { Col, Row } from "react-bootstrap";
import { useAuth } from "../..";
import StudentInfo from "./student-info";
import InstitutionInfo from "./institution-info";
import { userInfoSchema } from "../../../../validations";
import backendErrorHandler from "../../../../utils/backend-error-handler";
import { errorMessage } from "../../../../helpers/errorMessage";
import toast from "react-hot-toast";
import { errorResponse } from "../../../../types/responses";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../../types/reducers";

const UserInfo = ({ next, type }: { next: () => void; type: string }) => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    setError,
  } = useForm<CompleteProfile>({
    resolver: yupResolver(userInfoSchema) as any,
    defaultValues: {
      fname: user?.fname,
      lname: user?.lname,
      type: type,
    },
  });

  const {
    loadingActivities,
    loadingOccupations,
    completeProfile,
    loadingCompleteProfile,
    MEMORIZED_ACTIVITIES,
    MEMORIZED_OCCUPATIONS,
  } = useUser();

  const is_other_occupation = watch("occupation_id") === 0;

  const is_algeria = watch("country")?.label === "Algérie" ? true : false;
  const willaya_id = watch("wilaya")?.value || null;
  const is_student = type === "student";
  const avatar = watch("avatar");

  const completeFunc = async (data: CompleteProfile) => {
    is_other_occupation && delete data["occupation_id"];
    !is_algeria && delete data["wilaya"];
    !is_algeria && delete data["commune"];

    // const compresedAvatar = await compressImage(data?.avatar);

    const req = {
      avatar: data?.avatar,
      phone: data?.phone,
      fname: data?.fname,
      lname: data?.lname,
      occupation_id: data?.occupation_id,
      activity_area_ids: data?.activity_area_ids,

      // user address

      country_id: data?.country?.value,
      wilaya_id: data?.wilaya?.value,
      commune_id: data?.commune?.value,
      address: data?.address,
      type: type,

      //
      occupation: data?.occupation,
      university_id: data?.university_id,
      foreign_university: data?.foreign_university,

      //
      institution_type: data?.institution_type,
      institution_name: data?.institution_name,
    };

    data?.university_id === 0 && delete req["university_id"];

    completeProfile(req, {
      onSuccess(data) {
        next();
      },
      onError(error: errorResponse) {
        toast.error(`Erreur lors de la mise à jour des infos `);
        backendErrorHandler(setError, error);
      },
    });
  };

  const displayContent = () => {
    switch (type) {
      case "institution":
        return <InstitutionInfo control={control as any} errors={errors} />;

      case "student":
        return <StudentInfo control={control as any} errors={errors} />;

      case "corporate":
        return (
          <>
            <SelectComponent
              control={control as any}
              data={MEMORIZED_OCCUPATIONS}
              errors={errors}
              label="Occupation"
              name="occupation_id"
              colXS={12}
              colMD={6}
              isLoading={loadingOccupations}
              noOptionMessage="Aucune occupation disponible"
              saveOnlyValue
              required
            />
          </>
        );

      case "independant":
        return (
          <>
            <SelectComponent
              control={control as any}
              data={MEMORIZED_OCCUPATIONS}
              errors={errors}
              label="Occupation"
              name="occupation_id"
              colXS={12}
              colMD={6}
              isLoading={loadingOccupations}
              noOptionMessage="Aucune occupation disponible"
              saveOnlyValue
              required
            />
          </>
        );

      default:
        break;
    }
  };

  return (
    <div className="w-100 bg-transparent">
      <div className="pb-10 pb-lg-12">
        <h2 className="fw-bold text-dark">Saisissez vos informations</h2>
      </div>
      <Row xs={12} md={12}>
        <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
          <span className={`fw-bold fs-3 my-3`}>
            Informations sur l'utilisateur
          </span>
        </label>

        <Col className="my-4" xs={12} md={12}>
          <label className="d-flex align-items-center fs-5 fw-semibold">
            <span className={`fw-bold required`}>Photo de profil</span>
          </label>
          <input
            type="file"
            name="file"
            id="file"
            accept="image/png, image/jpg, image/jpeg"
            className="avatar-inputfile"
            onChange={(e) => setValue("avatar", e.target.files[0])}
          />

          {avatar === undefined || avatar === null ? (
            <label htmlFor="file">
              <span className="text-white m-auto text-center fs-7">
                Sélectionnez un fichier
              </span>
            </label>
          ) : (
            <div id="avatar-image" className="position-relative">
              <img
                src={URL?.createObjectURL(avatar)}
                className="w-100 h-100"
                id="avatar-image-preview"
              />
              <i
                className={`ki-duotone ki-trash fs-1 me-5 position-absolute text-danger bg-light rounded-3 top-0 end-0  cursor-pointer`}
                onClick={() => {
                  setValue("avatar", undefined);
                }}
              >
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
              </i>
            </div>
          )}
          {errorMessage(errors, "avatar")}
        </Col>

        <InputComponent
          control={control as any}
          errors={errors}
          label="Prénom"
          name="fname"
          type="text"
          required={true}
          colXS={12}
          colMD={6}
        />
        <InputComponent
          control={control as any}
          errors={errors}
          label="Nom"
          name="lname"
          type="text"
          required={true}
          colXS={12}
          colMD={6}
        />
        <InputComponent
          control={control as any}
          errors={errors}
          label="Téléphone"
          name="phone"
          type="number"
          required={true}
          colXS={12}
          colMD={6}
        />
      </Row>

      <Row xs={12} md={12}>
        <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
          <span className={`fw-bold fs-3 my-3`}>Adresse de l'utilisateur</span>
        </label>
        <div className="separator mb-2"></div>

        <CountriesSelect
          control={control as any}
          errors={errors}
          colXS={12}
          colMD={6}
        />

        {is_algeria ? (
          <>
            <WillayasSelect
              control={control as any}
              errors={errors}
              colXS={12}
              colMD={6}
            />

            <CommuneSelect
              willaya_id={willaya_id}
              control={control as any}
              errors={errors}
              colXS={12}
              colMD={6}
              key={willaya_id}
            />

            <InputComponent
              control={control as any}
              errors={errors}
              label="Adresse"
              name="address"
              type="text"
              required
              colXS={12}
              colMD={6}
            />
          </>
        ) : (
          <>
            <InputComponent
              control={control as any}
              errors={errors}
              label="Adresse complète"
              name="address"
              type="text"
              required
              colXS={12}
              colMD={6}
            />
          </>
        )}

        {is_student === null ? <></> : displayContent()}

        <SelectComponent
          control={control as any}
          data={MEMORIZED_ACTIVITIES}
          errors={errors}
          label="Centre d'intérêt"
          name="activity_area_ids"
          colXS={12}
          colMD={6}
          isLoading={loadingActivities}
          noOptionMessage="Aucune activité disponible"
          saveOnlyValue
          required
          isMulti
        />

        {is_other_occupation && (
          <InputComponent
            control={control as any}
            name="occupation"
            errors={errors}
            label="Nom de l'occupation"
            type="text"
            colXS={12}
            colMD={6}
            required
          />
        )}
      </Row>

      {/* begin::Action */}
      <div className="d-flex flex-row align-items-center justify-content-end mt-6">
        <button
          type="button"
          id="kt_sign_in_submit"
          className="btn btn-custom-purple-dark text-white"
          disabled={loadingCompleteProfile}
          onClick={handleSubmit(completeFunc)}
        >
          {!loadingCompleteProfile && (
            <span className="indicator-label">Continuer</span>
          )}
          {loadingCompleteProfile && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Veuillez patienter...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>

      {/* end::Action */}
    </div>
  );
};

export default UserInfo;
