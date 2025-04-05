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
      <h2 className=" text-xl underline underline-offset-8 ">
        Recommendations
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-6">
        {recommendations.map((rec) => (
          <Link href={rec.link || "#"} key={rec.id}>
            <Card className="relative overflow-hidden rounded-2xl  group shadow-none border-0  ">
              <img
                src={rec.imageUrl || ""}
                alt={rec.name}
                width={600}
                height={300}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
              />
              <div className="absolute p-4 h-full w-full flex flex-col justify-end text-white rounded-2xl bg-black/40 hover:opacity-0">
                <h2>{rec.name}</h2>
                <p className="text-sm ">{rec.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
