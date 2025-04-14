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
      <main className="min-h-screen flex flex-col ">{children}</main>
      <Footer />
    </>
  );
}
