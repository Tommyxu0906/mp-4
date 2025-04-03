import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">MP-4</h1>
      <p className="mb-4">
        This is a CS391 MP-4 using the Harvard Art Museums API via Next.js by Kanghuan Xu
      </p>

      <Link href="/harvard">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          View the Harvard API Data
        </button>
      </Link>
    </div>
  );
}
