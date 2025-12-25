import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Fraud Detection System</h1>

      <p className="text-gray-600 max-w-xl mb-6">
        This application uses Machine Learning to analyze transaction data and
        predict whether a transaction is fraudulent or not.
      </p>

      <Link
        href="/predict"
        className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
      >
        Start Fraud Detection
      </Link>
    </main>
  );
}
