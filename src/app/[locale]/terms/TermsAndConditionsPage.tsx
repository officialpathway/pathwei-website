"use client";
import React from "react";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const TermsAndConditionsPage = () => {
  const t = useTranslations("Pathway.legal.terms");

  // Para manejar arrays en next-intl, necesitamos acceder a cada elemento individualmente
  const newsletterPurposes = [
    t("sections.newsletter.purposes.0"),
    t("sections.newsletter.purposes.1"),
    t("sections.newsletter.purposes.2"),
    t("sections.newsletter.purposes.3")
  ];

  const subscriptionParagraphs = [
    t("sections.subscription.paragraphs.0"),
    t("sections.subscription.paragraphs.1")
  ];

  const privacyParagraphs = [
    t("sections.privacy.paragraphs.0"),
    t("sections.privacy.paragraphs.1"),
    t("sections.privacy.paragraphs.2")
  ];

  const contentParagraphs = [
    t("sections.content.paragraphs.0"),
    t("sections.content.paragraphs.1")
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
          <p className="mb-4">{t("acceptance_paragraph")}</p>
        </section>

        {/* Newsletter Description */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.newsletter.title")}</h2>
          <p className="mb-4">{t("sections.newsletter.description")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {newsletterPurposes.map((purpose, index) => (
              <li key={index}>{purpose}</li>
            ))}
          </ul>
        </section>

        {/* Subscription Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.subscription.title")}</h2>
          {subscriptionParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </section>

        {/* Privacy & Data Usage */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.privacy.title")}</h2>
          {privacyParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </section>

        {/* Unsubscribe */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.unsubscribe.title")}</h2>
          <p className="mb-4">{t("sections.unsubscribe.paragraph")}</p>
        </section>

        {/* Content */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("sections.content.title")}</h2>
          {contentParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </section>

        {/* Changes to Terms */}
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

export default TermsAndConditionsPage;