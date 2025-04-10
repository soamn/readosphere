"use client";

import { Book, BookOpen } from "lucide-react";
import { useEffect, useRef } from "react";

const ROTATION_SPEED = 0.003;

const ICONS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  type: i % 2 === 0 ? "closed" : "open",
  offset: (2 * Math.PI * i) / 8,
}));

export default function BookOrbit() {
  const iconRefs = useRef<(SVGForeignObjectElement | null)[]>([]);

  useEffect(() => {
    const radius = 300;
    const centerX = 350;
    const centerY = 350;

    const angles = ICONS.map((icon) => icon.offset);

    const animate = () => {
      for (let i = 0; i < ICONS.length; i++) {
        angles[i] += ROTATION_SPEED;
        const x = centerX + radius * Math.cos(angles[i]);
        const y = centerY + radius * Math.sin(angles[i]);

        const el = iconRefs.current[i];
        if (el) {
          el.setAttribute("x", `${x - 25}`); // Adjusted for 50px size
          el.setAttribute("y", `${y - 25}`);
          el.setAttribute(
            "transform",
            `rotate(${angles[i] * (180 / Math.PI)}, ${x}, ${y})`
          );
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="w-[375px] h-[700px] overflow-hidden absolute right-0 -z-10 opacity-90 top-280 hidden md:block">
      <svg width="700" height="700" className="absolute right-0 top-0">
        <circle
          cx="350"
          cy="350"
          r="300"
          fill="none"
          stroke="#ccc"
          strokeWidth="2"
          strokeDasharray="10,10"
        />

        {/* Book Icons */}
        {ICONS.map((icon, index) => (
          <foreignObject
            key={icon.id}
            width="50"
            height="50"
            x="0"
            y="0"
            ref={(el) => {
              iconRefs.current[index] = el;
            }}
          >
            {icon.type === "open" ? (
              <BookOpen
                color="#f97316"
                width={50}
                height={50}
                className="bg-offWhite"
              />
            ) : (
              <Book
                color="#4f46e5"
                width={50}
                height={50}
                className="bg-offWhite"
              />
            )}
          </foreignObject>
        ))}
      </svg>
    </div>
  );
}
