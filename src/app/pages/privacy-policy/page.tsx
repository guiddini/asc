import React from "react";
import { Helmet } from "react-helmet";
import LandingNavbar from "../landing/_components/landing-navbar";

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="bg-black">
      <div id="landing-hero-overlay"></div>
      <Helmet>
        <title>Conditions d'utilisation | Eventili</title>
        <meta
          name="description"
          content="Conditions d'utilisation pour Eventili, votre solution globale pour la gestion d'événements."
        />
      </Helmet>
      <LandingNavbar />
      <div id="privacypolicy-page-container">
        <h1 id="privacypolicy-page-title">Conditions d'utilisation</h1>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">ORGANISATEUR :</h2>
          <p id="privacypolicy-page-text">
            Eventili est une plateforme spécialisée dans la gestion et
            l'organisation d'événements de toutes tailles, proposant des
            services de planification, d'inscription en ligne, et de promotion
            numérique pour maximiser la portée et l'impact de vos événements.
          </p>
        </section>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">
            INFORMATIONS GÉNÉRALES :
          </h2>
          <p id="privacypolicy-page-text">
            Le présent contrat ne sera considéré comme conclu entre vous et
            Eventili que si nous reconnaissons votre inscription en vous
            envoyant un e-mail de confirmation. Dans ce contexte, l'acceptation
            sera réputée valide à tous égards à partir de la réception du
            courriel de confirmation envoyé par Eventili.
          </p>
        </section>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">INSCRIPTION ET BADGES :</h2>
          <p id="privacypolicy-page-text">
            Les visiteurs doivent s'inscrire en ligne à l'événement via Eventili
            avant d'entrer. Chaque visiteur recevra un badge qu'il devra porter
            et rendre visible en tout temps sur le site. Les badges visiteurs ne
            sont pas transférables. Pour des raisons de sécurité, Eventili se
            réserve le droit de fouiller les visiteurs.
          </p>
        </section>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">
            PROTECTION DES DONNÉES :
          </h2>
          <p id="privacypolicy-page-text">
            Eventili se conforme à toutes les exigences en matière de protection
            de la vie privée conformément à la réglementation en vigueur. Nous
            veillons à ce que vos données personnelles soient sécurisées et
            utilisées uniquement dans le cadre de nos services.
          </p>
        </section>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">RESPONSABILITÉS :</h2>
          <p id="privacypolicy-page-text">
            Eventili ne peut être tenu responsable des erreurs et/ou omissions
            et se réserve le droit de modifier les informations, spécifications
            et descriptions des services proposés. Nous nous engageons à
            corriger toute erreur et/ou omission dans les plus brefs délais
            après en avoir été informés.
          </p>
        </section>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">
            ANNULATION OU CHANGEMENT DE BILLETS :
          </h2>
          <p id="privacypolicy-page-text">
            Eventili peut modifier la date et/ou le lieu d'un événement pour des
            raisons organisationnelles, techniques ou autres raisons
            justifiables. L'impossibilité d'assister à l'événement ou toute
            erreur commise lors de l'achat des billets ne donne pas droit à un
            remboursement du prix du billet.
          </p>
        </section>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">
            CESSION DES DROITS À L'IMAGE :
          </h2>
          <p id="privacypolicy-page-text">
            En visitant un événement organisé via Eventili, les visiteurs
            acceptent d'être photographiés, filmés ou enregistrés à des fins
            promotionnelles, et que ce matériel puisse être utilisé à des fins
            publicitaires.
          </p>
        </section>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">
            LIENS VERS DES SITES WEB :
          </h2>
          <p id="privacypolicy-page-text">
            Les pages web associées aux événements peuvent contenir des liens
            vers des sites de sociétés et d'entités tierces. Eventili ne peut
            être tenu responsable de la manière dont ces sociétés traitent la
            vie privée et la protection des données personnelles.
          </p>
        </section>

        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">MODIFICATIONS :</h2>
          <p id="privacypolicy-page-text">
            Eventili se réserve le droit de mettre à jour, modifier et/ou
            supprimer toute information figurant sur le site web ou dans les
            conditions d'utilisation. Toute modification entrera en vigueur au
            moment de sa publication sur notre site.
          </p>
        </section>

        {/* New Section: User Privacy Policy */}
        <section id="privacypolicy-page-section">
          <h2 id="privacypolicy-page-section-title">
            POLITIQUE DE CONFIDENTIALITÉ DES UTILISATEURS :
          </h2>
          <p id="privacypolicy-page-text">
            Eventili s'engage à protéger vos données personnelles et à les
            utiliser de manière responsable. Voici les principaux points de
            notre politique de confidentialité :
          </p>
          <ul className="list-disc ml-5 text-gray-300">
            <li>
              Collecte minimale : Nous collectons uniquement les informations
              nécessaires, telles que vos nom, adresse e-mail, numéro de
              téléphone et préférences, afin de fournir nos services.
            </li>
            <li>
              Sécurité renforcée : Vos données sont stockées de manière
              sécurisée et protégées contre tout accès non autorisé.
            </li>
            <li>
              Transparence : Nous vous informons sur la façon dont vos données
              sont collectées, utilisées et partagées.
            </li>
            <li>
              Contrôle utilisateur : Vous avez le droit de consulter, modifier
              ou supprimer vos informations personnelles à tout moment.
            </li>
            <li>
              Conformité : Nous respectons toutes les réglementations en matière
              de confidentialité, y compris les lois locales et internationales
              applicables.
            </li>
          </ul>
          <p id="privacypolicy-page-text">
            Pour toute question ou préoccupation concernant vos données
            personnelles, vous pouvez nous contacter via notre formulaire de
            contact disponible sur le site Eventili.
          </p>
        </section>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
