"use client";

import React from "react";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BigTitle } from "@/components/client/common/BigTitle";

const PrivacyPolicyPage = () => {
  const t = useTranslations("Pathway.Privacy");

  return (
    <div className="bg-white text-gray-800">
      <BigTitle 
        text={`${t("page-title")}`} 
        subtitle={`${t("last-updated", { date: t("update-date") })}`} 
        highlightWords={[`${t("page-title")}`]}
        highlightColor={"neon-blue"} 
        className='bg-purple-500 py-50' 
      />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("page-title")}</h1>
          <p className="text-lg text-gray-600">{t("last-updated", { date: t("update-date") })}</p>
        </div>

        {/* Introduction */}
        <section className="mb-10">
          <p className="mb-4">{t("intro-paragraph")}</p>
          <p className="mb-4">{t("scope-paragraph")}</p>
        </section>

        {/* Information Collection */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("collection-section-title")}</h2>
          <p className="mb-4">{t("collection-paragraph")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("collection-email")}</li>
            <li>{t("collection-usage")}</li>
            <li>{t("collection-feedback")}</li>
          </ul>
        </section>

        {/* AI Usage */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("ai-section-title")}</h2>
          <p className="mb-4">{t("ai-paragraph-1")}</p>
          <p className="mb-4">{t("ai-paragraph-2")}</p>
          <p className="mb-4">{t("ai-paragraph-3")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("ai-use-recommendations")}</li>
            <li>{t("ai-use-content")}</li>
            <li>{t("ai-use-support")}</li>
          </ul>
        </section>

        {/* No Personal Data Collection */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("no-personal-data-title")}</h2>
          <p className="mb-4">{t("no-personal-data-paragraph-1")}</p>
          <p className="mb-4">{t("no-personal-data-paragraph-2")}</p>
        </section>

        {/* Cookies and Tracking */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("cookies-section-title")}</h2>
          <p className="mb-4">{t("cookies-paragraph-1")}</p>
          <p className="mb-4">{t("cookies-paragraph-2")}</p>
        </section>

        {/* Data Security */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("security-section-title")}</h2>
          <p className="mb-4">{t("security-paragraph")}</p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("third-party-section-title")}</h2>
          <p className="mb-4">{t("third-party-paragraph")}</p>
        </section>

        {/* User Rights */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("rights-section-title")}</h2>
          <p className="mb-4">{t("rights-paragraph")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("rights-access")}</li>
            <li>{t("rights-delete")}</li>
            <li>{t("rights-object")}</li>
          </ul>
        </section>

        {/* Policy Changes */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("changes-section-title")}</h2>
          <p className="mb-4">{t("changes-paragraph")}</p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("contact-section-title")}</h2>
          <p className="mb-4">{t("contact-paragraph")}</p>
        </section>

        {/* Back to home link */}
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            {t("back-to-home")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;