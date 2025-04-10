import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Privacy",
  },
  robots: {
    index: false,
    follow: true,
  },
};
export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        We value your privacy. This Privacy Policy outlines how we collect, use,
        and protect your personal data when you use our services.
      </p>
      <h2 className="text-xl font-semibold">1. Data Collection</h2>
      <p>
        We may collect personal information such as your name, email address,
        and usage data for analytics purposes.
      </p>
      <h2 className="text-xl font-semibold">2. Use of Data</h2>
      <p>
        Your data helps us improve our services, respond to inquiries, and
        provide a better user experience.
      </p>
      <h2 className="text-xl font-semibold">3. Data Protection</h2>
      <p>
        We implement industry-standard measures to ensure your data is secure
        and protected from unauthorized access.
      </p>
      <p>
        For questions or concerns about your data, contact us at{" "}
        <a href="mailto:privacy@readosphere.com" className=" text-highlight">
          privacy@readosphere.com
        </a>
        .
      </p>
    </main>
  );
}
