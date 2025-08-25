import React from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { HomePage } from "./HomePage";

const HomeWrapper = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Accueil</PageTitle>
      <HomePage />
    </>
  );
};

export { HomeWrapper };
