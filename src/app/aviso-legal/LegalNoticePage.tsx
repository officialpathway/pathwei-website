// src/app/aviso-legal/LegalNoticePage.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import CurvedBorder from "@/components/client/pathway/CurvedBorder";

const LegalNoticePage = () => {
  const t = useTranslations("Pathway.legal.notice");

  // Para manejar arrays en next-intl, necesitamos acceder a cada elemento individualmente
  const websiteElements = [
    t("sections.general_terms.website_elements.0"),
    t("sections.general_terms.website_elements.1"),
    t("sections.general_terms.website_elements.2"),
    t("sections.general_terms.website_elements.3"),
    t("sections.general_terms.website_elements.4"),
  ];

  const accessFeatures = [
    t("sections.general_terms.access.features.0"),
    t("sections.general_terms.access.features.1"),
    t("sections.general_terms.access.features.2"),
    t("sections.general_terms.access.features.3"),
  ];

  const userResponsibilities = [
    t("sections.user.responsibilities.items.0"),
    t("sections.user.responsibilities.items.1"),
    t("sections.user.responsibilities.items.2"),
    t("sections.user.responsibilities.items.3"),
  ];

  const targetAudience = [
    t("sections.user.target_audience.items.0"),
    t("sections.user.target_audience.items.1"),
    t("sections.user.target_audience.items.2"),
  ];

  const noGuarantees = [
    t("sections.access_guarantees.no_guarantees.items.0"),
    t("sections.access_guarantees.no_guarantees.items.1"),
    t("sections.access_guarantees.no_guarantees.items.2"),
  ];

  const notResponsibleFor = [
    t("sections.access_guarantees.not_responsible.items.0"),
    t("sections.access_guarantees.not_responsible.items.1"),
    t("sections.access_guarantees.not_responsible.items.2"),
    t("sections.access_guarantees.not_responsible.items.3"),
  ];

  const limitationItems = [
    t("sections.access_guarantees.limitation.items.0"),
    t("sections.access_guarantees.limitation.items.1"),
    t("sections.access_guarantees.limitation.items.2"),
  ];

  const outgoingLinks = [
    t("sections.links.outgoing.items.0"),
    t("sections.links.outgoing.items.1"),
    t("sections.links.outgoing.items.2"),
  ];

  const externalResponsibility = [
    t("sections.links.external_responsibility.items.0"),
    t("sections.links.external_responsibility.items.1"),
    t("sections.links.external_responsibility.items.2"),
    t("sections.links.external_responsibility.items.3"),
  ];

  const incomingAllowed = [
    t("sections.links.incoming.allowed.items.0"),
    t("sections.links.incoming.allowed.items.1"),
    t("sections.links.incoming.allowed.items.2"),
  ];

  const incomingProhibited = [
    t("sections.links.incoming.prohibited.items.0"),
    t("sections.links.incoming.prohibited.items.1"),
    t("sections.links.incoming.prohibited.items.2"),
    t("sections.links.incoming.prohibited.items.3"),
  ];

  const pathwayRights = [
    t("sections.intellectual_property.pathway_rights.items.0"),
    t("sections.intellectual_property.pathway_rights.items.1"),
    t("sections.intellectual_property.pathway_rights.items.2"),
    t("sections.intellectual_property.pathway_rights.items.3"),
    t("sections.intellectual_property.pathway_rights.items.4"),
    t("sections.intellectual_property.pathway_rights.items.5"),
  ];

  const allowedUse = [
    t("sections.intellectual_property.allowed_use.items.0"),
    t("sections.intellectual_property.allowed_use.items.1"),
    t("sections.intellectual_property.allowed_use.items.2"),
  ];

  const prohibitedUse = [
    t("sections.intellectual_property.prohibited_use.items.0"),
    t("sections.intellectual_property.prohibited_use.items.1"),
    t("sections.intellectual_property.prohibited_use.items.2"),
    t("sections.intellectual_property.prohibited_use.items.3"),
  ];

  const legalProtection = [
    t("sections.intellectual_property.legal_protection.items.0"),
    t("sections.intellectual_property.legal_protection.items.1"),
    t("sections.intellectual_property.legal_protection.items.2"),
  ];

  const modificationsItems = [
    t("sections.modifications.items.0"),
    t("sections.modifications.items.1"),
    t("sections.modifications.items.2"),
  ];

  const notificationMethods = [
    t("sections.modifications.notification_methods.0"),
    t("sections.modifications.notification_methods.1"),
    t("sections.modifications.notification_methods.2"),
  ];

  const applicableLaws = [
    t("sections.legislation.applicable_laws.0"),
    t("sections.legislation.applicable_laws.1"),
    t("sections.legislation.applicable_laws.2"),
    t("sections.legislation.applicable_laws.3"),
  ];

  const jurisdictionItems = [
    t("sections.legislation.jurisdiction.items.0"),
    t("sections.legislation.jurisdiction.items.1"),
    t("sections.legislation.jurisdiction.items.2"),
  ];

  const specializedContacts = [
    {
      type: t("sections.contact.specialized.data_protection.type"),
      email: t("sections.contact.specialized.data_protection.email"),
      subject: t("sections.contact.specialized.data_protection.subject"),
    },
    {
      type: t("sections.contact.specialized.intellectual_property.type"),
      email: t("sections.contact.specialized.intellectual_property.email"),
      subject: t("sections.contact.specialized.intellectual_property.subject"),
    },
    {
      type: t("sections.contact.specialized.technical_support.type"),
      email: t("sections.contact.specialized.technical_support.email"),
      subject: t("sections.contact.specialized.technical_support.subject"),
    },
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

        {/* I. General Information */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.general_info.title")}
          </h2>
          <p className="mb-4">{t("sections.general_info.intro")}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="mb-2">
              <strong>{t("sections.general_info.website_owner_label")}</strong>{" "}
              {t("sections.general_info.website_owner")}
            </p>
            <p className="mb-2">
              <strong>{t("sections.general_info.email_label")}</strong>{" "}
              {t("sections.general_info.email")}
            </p>
            <p className="mb-2">
              <strong>{t("sections.general_info.website_label")}</strong>{" "}
              {t("sections.general_info.website")}
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="font-semibold text-blue-800">
              {t("sections.general_info.note")}
            </p>
          </div>
        </section>

        {/* II. General Terms and Conditions */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.general_terms.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.general_terms.object.title")}
            </h3>
            <p className="mb-4">
              {t("sections.general_terms.object.description")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {websiteElements.map((element, index) => (
                <li key={index}>{element}</li>
              ))}
            </ul>
            <p className="mb-4">
              {t("sections.general_terms.object.modification_rights")}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.general_terms.access.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {accessFeatures.map((feature, index) => (
                <li key={index}>
                  <strong>{feature.split(":")[0]}:</strong>{" "}
                  {feature.split(":")[1]}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* III. The User */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.user.title")}
          </h2>
          <p className="mb-6">{t("sections.user.intro")}</p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.user.responsibilities.title")}
            </h3>
            <p className="mb-4">{t("sections.user.responsibilities.intro")}</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {userResponsibilities.map((responsibility, index) => (
                <li key={index}>
                  <strong>{responsibility.split(":")[0]}:</strong>{" "}
                  {responsibility.split(":")[1]}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.user.target_audience.title")}
            </h3>
            <p className="mb-4">{t("sections.user.target_audience.intro")}</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {targetAudience.map((audience, index) => (
                <li key={index}>{audience}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* IV. Access and Navigation: Exclusion of Guarantees */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.access_guarantees.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.access_guarantees.availability.title")}
            </h3>
            <p className="mb-4">
              {t("sections.access_guarantees.availability.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {noGuarantees.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mb-4">
              {t("sections.access_guarantees.availability.efforts")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {notResponsibleFor.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.access_guarantees.limitation.title")}
            </h3>
            <p className="mb-4">
              {t("sections.access_guarantees.limitation.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {limitationItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* V. Links Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.links.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.links.outgoing.title")}
            </h3>
            <p className="mb-4">{t("sections.links.outgoing.intro")}</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {outgoingLinks.map((link, index) => (
                <li key={index}>
                  <strong>{link.split(":")[0]}:</strong> {link.split(":")[1]}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.links.external_responsibility.title")}
            </h3>
            <p className="mb-4">
              {t("sections.links.external_responsibility.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {externalResponsibility.map((item, index) => (
                <li key={index}>
                  <strong>
                    {t("sections.links.external_responsibility.pathway_prefix")}
                    :
                  </strong>{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.links.incoming.title")}
            </h3>
            <p className="mb-4">{t("sections.links.incoming.intro")}</p>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-green-700">
                {t("sections.links.incoming.allowed.title")}
              </h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {incomingAllowed.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-red-700">
                {t("sections.links.incoming.prohibited.title")}
              </h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {incomingProhibited.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* VI. Intellectual and Industrial Property */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.intellectual_property.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.intellectual_property.pathway_rights.title")}
            </h3>
            <p className="mb-4">
              {t("sections.intellectual_property.pathway_rights.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {pathwayRights.map((right, index) => (
                <li key={index}>{right}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.intellectual_property.user_use.title")}
            </h3>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-green-700">
                {t("sections.intellectual_property.allowed_use.title")}
              </h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {allowedUse.map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-red-700">
                {t("sections.intellectual_property.prohibited_use.title")}
              </h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {prohibitedUse.map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.intellectual_property.legal_protection.title")}
            </h3>
            <p className="mb-4">
              {t("sections.intellectual_property.legal_protection.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {legalProtection.map((protection, index) => (
                <li key={index}>{protection}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* VII. Modifications */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.modifications.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.modifications.changes.title")}
            </h3>
            <p className="mb-4">{t("sections.modifications.changes.intro")}</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {modificationsItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.modifications.notification.title")}
            </h3>
            <p className="mb-4">
              {t("sections.modifications.notification.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {notificationMethods.map((method, index) => (
                <li key={index}>{method}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* VIII. Applicable Legislation and Jurisdiction */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.legislation.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.legislation.applicable_regulations.title")}
            </h3>
            <p className="mb-4">
              {t("sections.legislation.applicable_regulations.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {applicableLaws.map((law, index) => (
                <li key={index}>{law}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.legislation.jurisdiction.title")}
            </h3>
            <p className="mb-4">
              {t("sections.legislation.jurisdiction.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {jurisdictionItems.map((item, index) => (
                <li key={index}>
                  <strong>{item.split(":")[0]}:</strong> {item.split(":")[1]}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* IX. Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.contact.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.contact.general.title")}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="mb-2">
                <strong>{t("sections.contact.general.email_label")}</strong>{" "}
                {t("sections.contact.general.email")}
              </p>
              <p>
                <strong>{t("sections.contact.general.subject_label")}</strong>{" "}
                {t("sections.contact.general.subject")}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.contact.specialized.title")}
            </h3>
            {specializedContacts.map((contact, index) => (
              <div
                key={index}
                className="mb-3 p-3 border border-gray-200 rounded-lg"
              >
                <p className="mb-1">
                  <strong>{contact.type}:</strong> {contact.email}
                </p>
                <p className="text-sm text-gray-600">({contact.subject})</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CurvedBorder fillColor="fill-black" />
    </div>
  );
};

export default LegalNoticePage;
