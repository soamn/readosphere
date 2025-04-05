import React from "react";

const Hero = () => {
  return (
    <section className="max-w-3xl mx-auto px-4">
      <h1 className="text-5xl font-bold leading-tight">
        <span>Mindful Reading</span> <br />A Guide Toward Awareness & Focus
      </h1>
      <div className="p-4 font-bold text-secondary">
        <span>Updated On | </span>
        <time dateTime="2025-04-01">April 1, 2025</time>
      </div>
      <article className="text-xl leading-relaxed">
        <p className="mb-5">
          In today's fast-paced digital world, we consume endless streams of
          content but often forget to truly *absorb* and *reflect*.{" "}
          <strong>Mindful reading</strong> is a powerful practice that brings us
          back to the present, allowing us to engage with the material in a
          deeper and more meaningful way.
        </p>
        <p className="mb-5">
          Here's how to get started:
          <br />
          <a href="#create-space" className="text-highlight underline">
            Create a quiet space
          </a>
          , set an intention before reading, and take regular pauses to reflect
          on what you've read. Journaling after a reading session can help
          deepen your understanding and track your growth.
        </p>

        <p>
          Mindful reading isn't just about consuming information—it's about
          building a relationship with what you read. As you begin to read with
          more awareness, you'll find that even a few pages a day can become a
          powerful tool for self-discovery, learning, and inner peace.
        </p>
      </article>
    </section>
  );
};

export default Hero;
