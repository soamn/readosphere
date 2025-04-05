import React from "react";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p>
        Welcome to our website! We are passionate about building great products
        and delivering meaningful content to our users.
      </p>
      <p>
        Our mission is to provide a platform that is simple, fast, and
        user-friendly for everyone.
      </p>
      <p>
        If you have any questions or feedback, feel free to reach out to us at{" "}
        <a href="mailto:support@readosphere.com" className="text-highlight ">
          support@readosphere.com
        </a>
        .
      </p>
    </main>
  );
}
