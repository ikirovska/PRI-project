import Hero from "./_components/Hero";

export default async function Home() {
  return (
    <main className="bg relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Hero />
    </main>
  );
}
