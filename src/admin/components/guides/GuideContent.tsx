// src/admin/components/guides/GuideContent.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface GuideContentProps {
  guide: {
    slug: string;
    frontmatter: {
      title?: string;
      description?: string;
      lastUpdated?: string;
      [key: string]: unknown;
    };
    content: string;
  };
}

export default function GuideContent({ guide }: GuideContentProps) {
  const { content } = guide;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-4 text-center">
        {/* Back Button */}
        <Link href="/admin/guides">
          <button
            title="Back to guides"
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm cursor-pointer bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </button>
        </Link>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={
              {
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
                code: ({ className, children }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  const isInline = !match;

                  if (!isInline && match) {
                    return (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                        <code className={className}>{codeString}</code>
                      </pre>
                    );
                  }

                  return (
                    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4 bg-blue-50 py-2">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full border border-gray-300">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left text-gray-900 font-medium">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {children}
                  </td>
                ),
              } as Components
            }
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
