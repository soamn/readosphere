import { Card } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RecommendationPage() {
  const recommendations = await prisma.recommendation.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h2 className="text-4xl md:text-8xl px-4 sm:px-10 md:px-20  md:mt-32 sm:mt-16 ">
        Categories
      </h2>

      <div className="grid gap-y-10 gap-x-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4 sm:px-10 md:px-20 mt-20 ">
        {recommendations.map((rec) => (
          <Link href={rec.link || "#"} key={rec.id}>
            <h2 className="font-semibold  text-2xl p-2 tracking-widest">
              {rec.name}
            </h2>
            <Card className="relative overflow-hidden  shadow-none border-0">
              <img
                src={rec.imageUrl || ""}
                alt={rec.name}
                width={600}
                height={600}
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover  transition-transform"
              />
            </Card>
            <div className="w-full flex justify-between items-start text-gray-500 text-base sm:text-lg md:text-xl p-2 sm:p-4">
              <h3 className="w-20 h-20 overflow-clip text-right">
                {rec.description}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
