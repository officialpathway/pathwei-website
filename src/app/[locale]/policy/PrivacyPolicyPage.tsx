"use client";

import React from "react";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  const t = useTranslations("Pathway.legal.privacy");

  // Para manejar arrays en next-intl, necesitamos acceder a cada elemento individualmente
  const collectionItems = [
    t("sections.collection.items.0"),
    t("sections.collection.items.1"),
    t("sections.collection.items.2")
  ];

  const aiUses = [
    t("sections.ai.uses.0"),
    t("sections.ai.uses.1"),
    t("sections.ai.uses.2")
  ];

  const rightsItems = [
    t("sections.rights.items.0"),
    t("sections.rights.items.1"),
    t("sections.rights.items.2")
  ];

  // Para párrafos en secciones, manejamos cada párrafo individualmente
  const aiParagraphs = [
    t("sections.ai.paragraphs.0"),
    t("sections.ai.paragraphs.1"),
    t("sections.ai.paragraphs.2")
  ];

  const noPersonalDataParagraphs = [
    t("sections.no_personal_data.paragraphs.0"),
    t("sections.no_personal_data.paragraphs.1")
  ];

  const cookiesParagraphs = [
    t("sections.cookies.paragraphs.0"),
    t("sections.cookies.paragraphs.1")
  ];

  return (
    <div className="bg-white text-gray-800">
      <div className="container mx-auto px-4 pt-30 pb-16 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("page_title")}</h1>
          <p className="text-lg text-gray-600">{t("last_updated", { date: t("update_date") })}</p>
        </div>

        {/* Introduction */}
        <section className="mb-10">
          <p className="mb-4">{t("intro_paragraph")}</p>
          <p className="mb-4">{t("scope_paragraph")}</p>
        </section>

        {/* Information Collection */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.collection.title")}</h2>
          <p className="mb-4">{t("sections.collection.paragraph")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {collectionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* AI Usage */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.ai.title")}</h2>
          {aiParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {aiUses.map((use, index) => (
              <li key={index}>{use}</li>
            ))}
          </ul>
        </section>

        {/* No Personal Data Collection */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.no_personal_data.title")}</h2>
          {noPersonalDataParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </section>

        {/* Cookies and Tracking */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.cookies.title")}</h2>
          {cookiesParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </section>

        {/* Data Security */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.security.title")}</h2>
          <p className="mb-4">{t("sections.security.paragraph")}</p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.third_party.title")}</h2>
          <p className="mb-4">{t("sections.third_party.paragraph")}</p>
        </section>

        {/* User Rights */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.rights.title")}</h2>
          <p className="mb-4">{t("sections.rights.paragraph")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {rightsItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Policy Changes */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.changes.title")}</h2>
          <p className="mb-4">{t("sections.changes.paragraph")}</p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.contact.title")}</h2>
          <p className="mb-4">{t("sections.contact.paragraph")}</p>
        </section>

        {/* Back to home link */}
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            {t("back_to_home")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;