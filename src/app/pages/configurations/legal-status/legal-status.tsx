import React, { useMemo } from "react";
import { PageTitle } from "../../../../_metronic/layout/core";
import { TableComponent } from "../../../components";
import { useUser } from "../../../hooks";
import { Can } from "../../../utils/ability-context";

const columns = [
  {
    name: "Name",
    selector: (row) => row.label,
    sortable: true,
  },
  // {
  //   name: "Name fr",
  //   selector: (row) => row.label_fr,
  //   sortable: true,
  // },
  // {
  //   name: "Name ar",
  //   selector: (row) => row.label_ar,
  //   sortable: true,
  // },
  // {
  //   name: "",
  //   selector: (row) => (
  //     <ActionCollumn
  //       openEditModal={() => {
  //         if (row.status !== "Pending") {
  //           toast.error(
  //             "The guest has already accepted the invitation , you can't update"
  //           );
  //         } else {
  //           setUpdateGuest(row);
  //         }
  //       }}
  //       openViewModal={() => {
  //         setGuest(row);
  //       }}
  //       disableUpdate={row.status === "Pending" ? false : true}
  //     />
  //   ),
  //   sortable: true,
  // },
];

export const LegalStatus = () => {
  const { occupations, loadingOccupations } = useUser();

  const OCUUPATIONS = useMemo(
    () => [
      {
        label: "EURL",
        value: "EURL",
      },
      {
        label: "SARL",
        value: "SARL",
      },
      {
        label: "SPA",
        value: "SPA",
      },
      {
        label: "SNC",
        value: "SNC",
      },
      {
        label: "SCS",
        value: "SCS",
      },
      {
        label: "SCA",
        value: "SCA",
      },
      {
        label: "Personne physique",
        value: "Personne physique",
      },
      {
        label: "SPAS",
        value: "SPAS",
      },
      {
        label: "SPASU",
        value: "SPASU",
      },
      {
        label: "Association",
        value: "Association",
      },
      {
        label: "Banque",
        value: "Banque",
      },
      {
        label: "Assurance",
        value: "Assurance",
      },
      {
        label: "Projet innovant labélisé",
        value: "Projet innovant labélisé",
      },
      {
        label: "Institution publique",
        value: "Institution Publique",
      },
    ],
    [occupations]
  );

  return (
    <div>
      <PageTitle>Legal Status</PageTitle>
      <TableComponent
        columns={columns}
        data={OCUUPATIONS}
        placeholder="legal status"
        isLoading={loadingOccupations}
        canA="legalstatus"
        canI="create"
      />
      {/* <Can I="read" a="legalstatus">
      </Can> */}
    </div>
  );
};
