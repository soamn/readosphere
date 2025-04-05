import Footer from "./footer";
import Header from "./header";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="w-full mt-42 max-w-4xl mx-auto   items-center  p-5 min-h-screen flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
