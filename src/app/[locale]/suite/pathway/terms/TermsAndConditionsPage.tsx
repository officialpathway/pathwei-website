"use client";

import React from "react";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BigTitle } from "@/components/client/common/BigTitle";

const TermsAndConditionsPage = () => {
  const t = useTranslations("Pathway.Terms");

  return (
    <div className="bg-white text-gray-800">
      <BigTitle 
        text={`${t("page-title")}`} 
        subtitle={`${t("last-updated", { date: t("update-date") })}`} 
        highlightWords={[`${t("page-title")}`]}
        highlightColor={"neon-pink"} 
        className='bg-green-500 py-50' 
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
          <p className="mb-4">{t("acceptance-paragraph")}</p>
        </section>

        {/* Newsletter Description */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("newsletter-section-title")}</h2>
          <p className="mb-4">{t("newsletter-description")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{t("newsletter-purpose-commercial")}</li>
            <li>{t("newsletter-purpose-beta")}</li>
            <li>{t("newsletter-purpose-features")}</li>
            <li>{t("newsletter-purpose-announcements")}</li>
          </ul>
        </section>

        {/* Subscription Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("subscription-section-title")}</h2>
          <p className="mb-4">{t("subscription-paragraph-1")}</p>
          <p className="mb-4">{t("subscription-paragraph-2")}</p>
        </section>

        {/* Privacy & Data Usage */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("privacy-section-title")}</h2>
          <p className="mb-4">{t("privacy-paragraph-1")}</p>
          <p className="mb-4">{t("privacy-paragraph-2")}</p>
          <p className="mb-4">{t("privacy-paragraph-3")}</p>
        </section>

        {/* Unsubscribe */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("unsubscribe-section-title")}</h2>
          <p className="mb-4">{t("unsubscribe-paragraph")}</p>
        </section>

        {/* Content */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t("content-section-title")}</h2>
          <p className="mb-4">{t("content-paragraph-1")}</p>
          <p className="mb-4">{t("content-paragraph-2")}</p>
        </section>

        {/* Changes to Terms */}
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

export default TermsAndConditionsPage;