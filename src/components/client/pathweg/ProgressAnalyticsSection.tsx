"use client";
import React from "react";
import ContentSection from "@/components/client/pathweg/ContentSection";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";

const ProgressAnalyticsSection = () => {
  // Get the translations
  const t = useTranslations("Pathweg.ui.features.progress_analytics");

  // Define our hardcoded progress values as a fallback
  const progressValues = [40, 65, 45, 80, 60, 75, 90];

  // Create weekly data array using weeks from translations and hardcoded progress values
  const weeklyData = Array.from({ length: 7 }, (_, i) => ({
    week: t(`weeks.${i}`),
    progress: progressValues[i],
  }));

  // Get metrics array
  const metrics = [0, 1, 2].map((index) => t(`metrics.${index}`));

  return (
    <ContentSection
      title={t("title")}
      descriptions={[t("descriptions.0"), t("descriptions.1")]}
      textSide="left"
      bgGradient="from-emerald-50 to-teal-50"
      animationVariant="stagger"
      visual={
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="p-3 bg-emerald-50 rounded-lg mb-4">
            <h4 className="font-medium text-emerald-800 mb-3">
              {t("weekly_progress")}
            </h4>
            <div className="h-48 bg-white rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="week" axisLine={false} tickLine={false} />
                  <YAxis hide={true} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => [`${value}%`, t("progress_label")]}
                  />
                  <Bar
                    dataKey="progress"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="py-2 px-4 bg-emerald-100 text-emerald-800 rounded-full text-sm"
              >
                {metric}
              </div>
            ))}
          </div>
        </div>
      }
      additionalContent={
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg mt-6">
          <h4 className="font-medium text-emerald-800 mb-2">
            {t("key_insight.title")}
          </h4>
          <p className="text-emerald-700 text-sm">
            {t("key_insight.description")}
          </p>
        </div>
      }
    />
  );
};

export default ProgressAnalyticsSection;
