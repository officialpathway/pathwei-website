"use client";

import React from "react";
import ContentSection from "./ContentSection";
import { useTranslations } from "next-intl";

const CollegeLifeOrganizationSection = () => {
  const t = useTranslations("Pathweg.ui.features.college_organization");

  // Days of week array - create it manually from individual translations
  const daysOfWeek = [
    t("calendar.days_of_week_0"),
    t("calendar.days_of_week_1"),
    t("calendar.days_of_week_2"),
    t("calendar.days_of_week_3"),
    t("calendar.days_of_week_4"),
    t("calendar.days_of_week_5"),
    t("calendar.days_of_week_6"),
  ];

  // Calendar visual component - smaller but with same functionality
  const calendarVisual = (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm">{t("calendar.title")}</h3>
          <div className="flex space-x-1">
            <button
              title="not-usable"
              type="button"
              className="p-1 hover:bg-white/20 rounded"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <button
              title="not-usable"
              type="button"
              className="p-1 hover:bg-white/20 rounded"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Days of week - FIXED VERSION */}
        <div className="grid grid-cols-7 mt-2 text-center text-xs font-medium">
          {daysOfWeek.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>
      </div>

      {/* Calendar Grid - more compact */}
      <div className="p-2">
        <div className="grid grid-cols-7 gap-0.5">
          {/* Abbreviated calendar - just showing 3 weeks */}
          {/* First week */}
          {[28, 29, 30, 1, 2, 3, 4].map((day, i) => (
            <div
              key={`week1-${i}`}
              className={`aspect-square p-0.5 rounded ${
                i < 3 ? "text-gray-400" : ""
              }`}
            >
              <div className="h-full w-full flex flex-col">
                <span className="text-xs">{day}</span>
                {i >= 3 && i <= 5 && (
                  <div className="mt-auto mb-0.5">
                    <div className="h-1 w-full bg-blue-300 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Second week */}
          {[5, 6, 7, 8, 9, 10, 11].map((day, i) => (
            <div key={`week2-${i}`} className="aspect-square p-0.5 rounded">
              <div className="h-full w-full flex flex-col">
                <span className="text-xs">{day}</span>
                {[1, 3, 5].includes(i) && (
                  <div className="mt-auto mb-0.5">
                    <div
                      className={`h-1 w-full rounded-full ${
                        i === 1
                          ? "bg-amber-300"
                          : i === 3
                          ? "bg-green-300"
                          : "bg-purple-300"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Third week - with current day */}
          {[12, 13, 14, 15, 16, 17, 18].map((day, i) => (
            <div
              key={`week3-${i}`}
              className={`aspect-square p-0.5 rounded ${
                day === 13 ? "bg-blue-100 font-bold text-blue-800" : ""
              }`}
            >
              <div className="h-full w-full flex flex-col">
                <span className="text-xs">{day}</span>
                {i === 1 && (
                  <div className="mt-auto mb-0.5 space-y-0.5">
                    <div className="h-1 w-full bg-blue-400 rounded-full"></div>
                    <div className="h-1 w-full bg-green-400 rounded-full"></div>
                    <div className="h-1 w-full bg-amber-400 rounded-full"></div>
                    <div className="h-1 w-full bg-purple-400 rounded-full"></div>
                  </div>
                )}
                {[0, 4].includes(i) && (
                  <div className="mt-auto mb-0.5">
                    <div
                      className={`h-1 w-full rounded-full ${
                        i === 0 ? "bg-green-300" : "bg-red-300"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Schedule - more compact */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-800 text-sm">
            {t("calendar.today_label")}
          </h4>
          <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
            {t("calendar.activities_count")}
          </span>
        </div>

        <div className="space-y-1.5">
          {/* Activity 1 - Workout */}
          <div className="flex items-center p-1.5 bg-green-50 rounded border-l-3 border-green-500">
            <div className="w-10 flex-shrink-0">
              <span className="text-xs font-medium text-green-800">
                {t("daily_schedule.0.time")}
              </span>
            </div>
            <div className="flex-grow">
              <h5 className="text-xs font-medium text-gray-800">
                {t("daily_schedule.0.activity")}
              </h5>
            </div>
            <div className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Activity 2 - Class */}
          <div className="flex items-center p-1.5 bg-blue-50 rounded border-l-3 border-blue-500">
            <div className="w-10 flex-shrink-0">
              <span className="text-xs font-medium text-blue-800">
                {t("daily_schedule.1.time")}
              </span>
            </div>
            <div className="flex-grow">
              <h5 className="text-xs font-medium text-gray-800">
                {t("daily_schedule.1.activity")}
              </h5>
            </div>
            <div className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Activity 3 - Meal */}
          <div className="flex items-center p-1.5 bg-amber-50 rounded border-l-3 border-amber-500">
            <div className="w-10 flex-shrink-0">
              <span className="text-xs font-medium text-amber-800">
                {t("daily_schedule.2.time")}
              </span>
            </div>
            <div className="flex-grow">
              <h5 className="text-xs font-medium text-gray-800">
                {t("daily_schedule.2.activity")}
              </h5>
            </div>
            <div className="flex-shrink-0 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Activity 4 - Study */}
          <div className="flex items-center p-1.5 bg-purple-50 rounded border-l-3 border-purple-500">
            <div className="w-10 flex-shrink-0">
              <span className="text-xs font-medium text-purple-800">
                {t("daily_schedule.3.time")}
              </span>
            </div>
            <div className="flex-grow">
              <h5 className="text-xs font-medium text-gray-800">
                {t("daily_schedule.3.activity")}
              </h5>
            </div>
            <div className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Additional content - more concise with focus on college lifestyle
  const additionalContent = (
    <div className="space-y-3">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2">
          <svg
            className="w-3.5 h-3.5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 text-sm">
            {t("features.0.title")}
          </h4>
          <p className="text-xs text-gray-600">{t("features.0.description")}</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 flex items-center justify-center mr-2">
          <svg
            className="w-3.5 h-3.5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 text-sm">
            {t("features.1.title")}
          </h4>
          <p className="text-xs text-gray-600">{t("features.1.description")}</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center mr-2">
          <svg
            className="w-3.5 h-3.5 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 text-sm">
            {t("features.2.title")}
          </h4>
          <p className="text-xs text-gray-600">{t("features.2.description")}</p>
        </div>
      </div>
    </div>
  );

  return (
    <ContentSection
      title={t("title")}
      descriptions={[t("descriptions.0")]}
      textSide="left"
      bgGradient="from-blue-50 to-purple-50"
      animationVariant="slide"
      visual={calendarVisual}
      additionalContent={additionalContent}
    />
  );
};

export default CollegeLifeOrganizationSection;
