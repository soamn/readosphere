import { Card } from "@/app/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RecommendationPage() {
  const recommendations = await prisma.recommendation.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h2 className="text-4xl md:text-8xl px-4 sm:px-10 md:px-20  md:mt-32 mt-16 ">
        Categories
      </h2>

      <div className="grid gap-y-10 gap-x-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-10 md:px-20 mt-20 ">
        {recommendations.map((rec) => (
          <Link href={rec.link || "#"} key={rec.id} target="_blank">
            <h2 className="font-semibold text-2xl  tracking-widest">
              {rec.name}
            </h2>
            <Card className="relative overflow-hidden shadow-none border-0 group w-full h-[400px] md:h-[600px] mt-5">
              {/* Image */}
              <img
                src={rec.imageUrl || ""}
                alt={rec.name}
                width={600}
                height={600}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out lg:group-hover:rounded-full group-hover:scale-0  group-hover:w-20 group-hover:h-20 group-hover:top-1/2 group-hover:left-1/2 group-hover:translate-x-[-50%] group-hover:translate-y-[-50%]"
              />

              {/* Description text (initially hidden) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                <h3 className="text-white text-base sm:text-lg md:text-xl text-center px-4">
                  {rec.description}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
