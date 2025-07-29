// src/app/cookies/CookiePolicyPage.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import CurvedBorder from "@/components/client/pathway/CurvedBorder";

const CookiePolicyPage = () => {
  const t = useTranslations("Pathway.legal.cookies");

  // Para manejar arrays en next-intl, necesitamos acceder a cada elemento individualmente
  const technicalCookiesData = [
    t("sections.technical.data.0"),
    t("sections.technical.data.1"),
    t("sections.technical.data.2"),
  ];

  const analyticalCookiesData = [
    t("sections.analytical.data.0"),
    t("sections.analytical.data.1"),
    t("sections.analytical.data.2"),
  ];

  const notUsedCookies = [
    t("sections.not_used.items.0"),
    t("sections.not_used.items.1"),
    t("sections.not_used.items.2"),
    t("sections.not_used.items.3"),
  ];

  const consentOptions = [
    t("sections.consent.options.0"),
    t("sections.consent.options.1"),
    t("sections.consent.options.2"),
  ];

  const withdrawalMethods = [
    t("sections.withdrawal.methods.0"),
    t("sections.withdrawal.methods.1"),
    t("sections.withdrawal.methods.2"),
  ];

  const browserInstructions = [
    {
      name: t("sections.browser_config.browsers.chrome.name"),
      instruction: t("sections.browser_config.browsers.chrome.instruction"),
      url: t("sections.browser_config.browsers.chrome.url"),
    },
    {
      name: t("sections.browser_config.browsers.firefox.name"),
      instruction: t("sections.browser_config.browsers.firefox.instruction"),
      url: t("sections.browser_config.browsers.firefox.url"),
    },
    {
      name: t("sections.browser_config.browsers.safari.name"),
      instruction: t("sections.browser_config.browsers.safari.instruction"),
      url: t("sections.browser_config.browsers.safari.url"),
    },
    {
      name: t("sections.browser_config.browsers.edge.name"),
      instruction: t("sections.browser_config.browsers.edge.instruction"),
      url: t("sections.browser_config.browsers.edge.url"),
    },
  ];

  const dntTools = [
    t("sections.dnt_tools.tools.0"),
    t("sections.dnt_tools.tools.1"),
    t("sections.dnt_tools.tools.2"),
  ];

  const acceptingConsequences = [
    t("sections.consequences.accepting.items.0"),
    t("sections.consequences.accepting.items.1"),
    t("sections.consequences.accepting.items.2"),
  ];

  const rejectingConsequences = [
    t("sections.consequences.rejecting.items.0"),
    t("sections.consequences.rejecting.items.1"),
  ];

  const thirdPartyServices = [
    {
      name: t("sections.third_party.services.google_play.name"),
      description: t("sections.third_party.services.google_play.description"),
    },
    {
      name: t("sections.third_party.services.apple_store.name"),
      description: t("sections.third_party.services.apple_store.description"),
    },
    {
      name: t("sections.third_party.services.analytics.name"),
      description: t("sections.third_party.services.analytics.description"),
    },
  ];

  const durations = [
    t("sections.duration.items.0"),
    t("sections.duration.items.1"),
    t("sections.duration.items.2"),
  ];

  const updateMethods = [
    t("sections.updates.methods.0"),
    t("sections.updates.methods.1"),
    t("sections.updates.methods.2"),
  ];

  const regulations = [
    t("sections.regulations.items.0"),
    t("sections.regulations.items.1"),
    t("sections.regulations.items.2"),
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

        {/* What are Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.what_are.title")}
          </h2>
          <p className="mb-4">{t("sections.what_are.paragraph1")}</p>
          <p className="mb-4">{t("sections.what_are.paragraph2")}</p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="font-semibold text-blue-800">
              {t("sections.what_are.important_note")}
            </p>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.types.title")}
          </h2>
          <p className="mb-6">{t("sections.types.intro")}</p>

          {/* Technical Cookies */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.technical.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>{t("sections.technical.purpose_label")}</strong>{" "}
                {t("sections.technical.purpose")}
              </li>
              <li>
                <strong>{t("sections.technical.duration_label")}</strong>{" "}
                {t("sections.technical.duration")}
              </li>
              <li>
                <strong>{t("sections.technical.data_label")}</strong>
                {technicalCookiesData.map((item, index) => (
                  <div key={index} className="ml-6 mt-2">
                    {item}
                  </div>
                ))}
              </li>
              <li>
                <strong>{t("sections.technical.legal_basis_label")}</strong>{" "}
                {t("sections.technical.legal_basis")}
              </li>
            </ul>
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-green-800">{t("sections.technical.note")}</p>
            </div>
          </div>

          {/* Analytical Cookies */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.analytical.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>{t("sections.analytical.purpose_label")}</strong>{" "}
                {t("sections.analytical.purpose")}
              </li>
              <li>
                <strong>{t("sections.analytical.duration_label")}</strong>{" "}
                {t("sections.analytical.duration")}
              </li>
              <li>
                <strong>{t("sections.analytical.data_label")}</strong>
                {analyticalCookiesData.map((item, index) => (
                  <div key={index} className="ml-6 mt-2">
                    {item}
                  </div>
                ))}
              </li>
              <li>
                <strong>{t("sections.analytical.legal_basis_label")}</strong>{" "}
                {t("sections.analytical.legal_basis")}
              </li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-800">{t("sections.analytical.note")}</p>
            </div>
          </div>
        </section>

        {/* Cookies We Don't Use */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.not_used.title")}
          </h2>
          <p className="mb-4">{t("sections.not_used.intro")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {notUsedCookies.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Consent Management */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.consent.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.consent.subtitle")}
            </h3>
            <p className="mb-4">{t("sections.consent.description")}</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {consentOptions.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.withdrawal.title")}
            </h3>
            <p className="mb-4">{t("sections.withdrawal.description")}</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {withdrawalMethods.map((method, index) => (
                <li key={index}>{method}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Browser Configuration */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.browser_config.title")}
          </h2>
          <p className="mb-6">{t("sections.browser_config.intro")}</p>

          {browserInstructions.map((browser, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-200 rounded-lg"
            >
              <h3 className="font-semibold mb-2">{browser.name}</h3>
              <p className="mb-2">{browser.instruction}</p>
              {browser.url && (
                <p className="text-sm text-blue-600">
                  {t("sections.browser_config.or_visit")} {browser.url}
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Do Not Track Tools */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.dnt_tools.title")}
          </h2>
          <p className="mb-4">{t("sections.dnt_tools.description")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {dntTools.map((tool, index) => (
              <li key={index}>{tool}</li>
            ))}
          </ul>
        </section>

        {/* Consequences of Rejecting Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.consequences.title")}
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.consequences.accepting.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {acceptingConsequences.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t("sections.consequences.rejecting.title")}
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {rejectingConsequences.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="font-semibold text-blue-800">
              {t("sections.consequences.important_note")}
            </p>
          </div>
        </section>

        {/* Third Party Cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.third_party.title")}
          </h2>

          {thirdPartyServices.map((service, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
              <p className="mb-4">{service.description}</p>
            </div>
          ))}
        </section>

        {/* Duration and Conservation */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.duration.title")}
          </h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {durations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Policy Updates */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.updates.title")}
          </h2>
          <p className="mb-4">{t("sections.updates.description")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {updateMethods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.contact.title")}
          </h2>
          <p className="mb-4">{t("sections.contact.description")}</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">
              <strong>{t("sections.contact.email_label")}</strong>{" "}
              {t("sections.contact.email")}
            </p>
            <p className="mb-4">
              <strong>{t("sections.contact.subject_label")}</strong>{" "}
              {t("sections.contact.subject")}
            </p>
            <p>{t("sections.contact.response_time")}</p>
          </div>
        </section>

        {/* Applicable Regulations */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t("sections.regulations.title")}
          </h2>
          <p className="mb-4">{t("sections.regulations.description")}</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            {regulations.map((regulation, index) => (
              <li key={index}>{regulation}</li>
            ))}
          </ul>
        </section>

        {/* Final Note */}
        <section className="mb-10">
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <p className="text-green-800">{t("sections.final_note")}</p>
          </div>
        </section>
      </div>

      <CurvedBorder fillColor="fill-black" />
    </div>
  );
};

export default CookiePolicyPage;
