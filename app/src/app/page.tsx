import Hero from "./_components/Hero";

export default async function Home() {
  return (
    <main className="bg relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-500 to-purple-950 text-white">
      <Hero />
    </main>
  );
}
