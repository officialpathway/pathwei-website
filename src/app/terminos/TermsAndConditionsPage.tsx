// src/app/terminos/TermsAndConditionsPage.tsx
"use client";
import React from "react";
import { useTranslations } from "next-intl";
import CurvedBorder from "@/components/client/pathway/CurvedBorder";

const TermsAndConditionsPage = () => {
  const t = useTranslations("Pathway.legal.terms");

  // Arrays for license restrictions and cancellation methods
  const licenseRestrictions = [
    t("sections.license.restrictions.0"),
    t("sections.license.restrictions.1"),
    t("sections.license.restrictions.2"),
    t("sections.license.restrictions.3"),
    t("sections.license.restrictions.4"),
  ];

  const cancellationMethods = [
    t("sections.subscriptions.cancellation_methods.0"),
    t("sections.subscriptions.cancellation_methods.1"),
    t("sections.subscriptions.cancellation_methods.2"),
  ];

  const cancellationTerms = [
    t("sections.subscriptions.cancellation_terms.0"),
    t("sections.subscriptions.cancellation_terms.1"),
    t("sections.subscriptions.cancellation_terms.2"),
    t("sections.subscriptions.cancellation_terms.3"),
  ];

  const userConfirmations = [
    t("sections.usage.confirmations.0"),
    t("sections.usage.confirmations.1"),
    t("sections.usage.confirmations.2"),
    t("sections.usage.confirmations.3"),
  ];

  const feedbackRights = [
    t("sections.feedback.rights.0"),
    t("sections.feedback.rights.1"),
    t("sections.feedback.rights.2"),
    t("sections.feedback.rights.3"),
  ];

  const terminationReasons = [
    t("sections.termination.reasons.0"),
    t("sections.termination.reasons.1"),
    t("sections.termination.reasons.2"),
    t("sections.termination.reasons.3"),
  ];

  const terminationEffects = [
    t("sections.termination.effects.0"),
    t("sections.termination.effects.1"),
    t("sections.termination.effects.2"),
  ];

  const liabilityExclusions = [
    t("sections.liability.exclusions.0"),
    t("sections.liability.exclusions.1"),
    t("sections.liability.exclusions.2"),
  ];

  return (
    <div className="bg-white text-gray-800 pt-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("page_title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("last_updated", { date: t("update_date") })}
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.intro.title")}
          </h2>
          <p className="mb-4">{t("sections.intro.welcome")}</p>
          <p className="mb-4">{t("sections.intro.purpose")}</p>
          <p className="mb-4">{t("sections.intro.support")}</p>
        </section>

        {/* Terms Agreement */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.agreement.title")}
          </h2>
          <p className="mb-4">{t("sections.agreement.acceptance")}</p>
          <p className="mb-4">{t("sections.agreement.services_definition")}</p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.changes.title")}
          </h2>
          <p className="mb-4">{t("sections.changes.intro")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("sections.changes.notifications.0")}</li>
            <li>{t("sections.changes.notifications.1")}</li>
            <li>{t("sections.changes.notifications.2")}</li>
            <li>{t("sections.changes.notifications.3")}</li>
          </ul>
          <p className="mb-4">{t("sections.changes.acceptance")}</p>
          <p className="mb-4">{t("sections.changes.disagreement")}</p>
        </section>

        {/* Who Can Use Services */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.usage.title")}
          </h2>
          <p className="mb-4">{t("sections.usage.age_requirement")}</p>
          <p className="mb-4">{t("sections.usage.minor_consent")}</p>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.usage.personal_use.title")}
          </h3>
          <p className="mb-4">{t("sections.usage.personal_use.description")}</p>
          <p className="mb-4">
            {t("sections.usage.personal_use.confirmation")}
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {userConfirmations.map((confirmation, index) => (
              <li key={index}>{confirmation}</li>
            ))}
          </ul>
          <p className="mb-4">{t("sections.usage.enforcement")}</p>
        </section>

        {/* User Process and Services */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.process.title")}
          </h2>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.process.registration.title")}
          </h3>
          <p className="mb-4">
            {t("sections.process.registration.description")}
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("sections.process.registration.steps.0")}</li>
            <li>{t("sections.process.registration.steps.1")}</li>
            <li>{t("sections.process.registration.steps.2")}</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.process.service_modes.title")}
          </h3>
          <h4 className="text-lg font-medium mb-2">
            {t("sections.process.service_modes.free.title")}
          </h4>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>{t("sections.process.service_modes.free.features.0")}</li>
            <li>{t("sections.process.service_modes.free.features.1")}</li>
            <li>{t("sections.process.service_modes.free.features.2")}</li>
          </ul>

          <h4 className="text-lg font-medium mb-2">
            {t("sections.process.service_modes.premium.title")}
          </h4>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>{t("sections.process.service_modes.premium.features.0")}</li>
            <li>{t("sections.process.service_modes.premium.features.1")}</li>
            <li>{t("sections.process.service_modes.premium.features.2")}</li>
            <li>{t("sections.process.service_modes.premium.features.3")}</li>
            <li>{t("sections.process.service_modes.premium.features.4")}</li>
          </ul>
          <p className="mb-4">{t("sections.process.upgrade_option")}</p>
        </section>

        {/* License Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.license.title")}
          </h2>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.license.grant.title")}
          </h3>
          <p className="mb-4">{t("sections.license.grant.description")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("sections.license.grant.rights.0")}</li>
            <li>{t("sections.license.grant.rights.1")}</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.license.restrictions_title")}
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {licenseRestrictions.map((restriction, index) => (
              <li key={index}>{restriction}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.license.intellectual_property.title")}
          </h3>
          <p className="mb-4">
            {t("sections.license.intellectual_property.description")}
          </p>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.license.app_store.title")}
          </h3>
          <p className="mb-4">{t("sections.license.app_store.description")}</p>
        </section>

        {/* Subscription Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.subscriptions.title")}
          </h2>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.subscriptions.monthly.title")}
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("sections.subscriptions.monthly.terms.0")}</li>
            <li>{t("sections.subscriptions.monthly.terms.1")}</li>
            <li>{t("sections.subscriptions.monthly.terms.2")}</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.subscriptions.cancellation_process.title")}
          </h3>
          <p className="mb-4">
            {t("sections.subscriptions.cancellation_process.description")}
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {cancellationMethods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.subscriptions.cancellation_terms_title")}
          </h3>
          <p className="mb-4">
            {t("sections.subscriptions.cancellation_terms_intro")}
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {cancellationTerms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.subscriptions.refunds.title")}
          </h3>
          <p className="mb-4">
            {t("sections.subscriptions.refunds.description")}
          </p>
        </section>

        {/* Feedback */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.feedback.title")}
          </h2>
          <p className="mb-4">{t("sections.feedback.intro")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {feedbackRights.map((right, index) => (
              <li key={index}>{right}</li>
            ))}
          </ul>
          <p className="mb-4">{t("sections.feedback.contact")}</p>
        </section>

        {/* Service Termination */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.termination.title")}
          </h2>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.termination.by_pathway.title")}
          </h3>
          <p className="mb-4">
            {t("sections.termination.by_pathway.description")}
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {terminationReasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.termination.by_user.title")}
          </h3>
          <p className="mb-4">
            {t("sections.termination.by_user.description")}
          </p>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.termination.effects_title")}
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {terminationEffects.map((effect, index) => (
              <li key={index}>{effect}</li>
            ))}
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.liability.title")}
          </h2>
          <p className="mb-4">{t("sections.liability.intro")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {liabilityExclusions.map((exclusion, index) => (
              <li key={index}>{exclusion}</li>
            ))}
          </ul>
        </section>

        {/* Jurisdiction */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.jurisdiction.title")}
          </h2>
          <p className="mb-4">{t("sections.jurisdiction.odr_intro")}</p>
          <p className="mb-4">{t("sections.jurisdiction.odr_description")}</p>
          <p className="mb-4">{t("sections.jurisdiction.odr_link")}</p>
          <p className="mb-4">{t("sections.jurisdiction.fallback")}</p>
        </section>

        {/* General Provisions */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.general.title")}
          </h2>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.general.severability.title")}
          </h3>
          <p className="mb-4">
            {t("sections.general.severability.description")}
          </p>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.general.complete_agreement.title")}
          </h3>
          <p className="mb-4">
            {t("sections.general.complete_agreement.description")}
          </p>

          <h3 className="text-xl font-semibold mb-3">
            {t("sections.general.waiver.title")}
          </h3>
          <p className="mb-4">{t("sections.general.waiver.description")}</p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.contact.title")}
          </h2>
          <p className="mb-4">{t("sections.contact.intro")}</p>
          <ul className="list-none mb-4 space-y-2">
            <li>
              <strong>Email:</strong> {t("sections.contact.email")}
            </li>
            <li>
              <strong>Asunto:</strong> {t("sections.contact.subject")}
            </li>
            <li>
              <strong>Dirección postal:</strong> {t("sections.contact.address")}
            </li>
          </ul>
          <p className="mb-4">{t("sections.contact.response_time")}</p>
        </section>

        {/* Final Confirmation */}
        <section className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-800">{t("final_confirmation")}</p>
        </section>
      </div>

      <CurvedBorder fillColor="fill-black" />
    </div>
  );
};

export default TermsAndConditionsPage;
