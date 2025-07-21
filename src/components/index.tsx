import Header from '@/components/Header'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <Header />
      <section className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to EduSpark</h1>
        <p className="text-xl max-w-xl">
          Your personalized hub for study, productivity, and growth.
        </p>
      </section>
    </main>
  )
}
