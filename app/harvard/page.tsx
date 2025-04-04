"use client";
import { useState, FormEvent } from "react";

interface HarvardInfo {
  totalrecordsperquery: number;
  totalrecords: number;
  pages: number;
  page: number;
  next: string;
  prev: string;
  responsetime: string;
}

interface HarvardAggregations {
  [key: string]: unknown;
}

interface HarvardRecord {
  id: number;
  title?: string;
  [key: string]: unknown;
}

interface HarvardAPIResponse {
  info?: HarvardInfo;
  records?: HarvardRecord[];
  aggregations?: HarvardAggregations;
  error?: string;
}

export default function HarvardPage() {
  const [resource, setResource] = useState<string>("object");
  const [page, setPage] = useState<string>("1");
  const [size, setSize] = useState<string>("10");
  const [data, setData] = useState<HarvardAPIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/harvard?resource=${resource}&page=${page}&size=${size}`);
      const json: HarvardAPIResponse = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      setData(json);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Harvard Art Museums Browser</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <div>
          <label className="mb-1 text-sm text-gray-700">Resource:</label>
          <input
            className="border border-gray-300 rounded w-full"
            value={resource}
            onChange={(e) => setResource(e.target.value)}
            placeholder="object, exhibition, etc."
          />
        </div>
        <div>
          <label className="mb-1 text-sm text-gray-700">Page:</label>
          <input
            type="number"
            className="border border-gray-300 rounded w-full"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <label className="mb-1 text-sm text-gray-700">Size:</label>
          <input
            type="number"
            className="border border-gray-300 rounded w-full"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            min="1"
            max="100"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4"
        >
          Fetch
        </button>
      </form>

      {loading&&<p className="text-blue-600">Loading...</p>}
      {error&&<p className="text-red-600">{error}</p>}

      {data &&!error && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Results</h2>
          {data.records ? (
            <ul className="list-disc list-inside space-y-1">
              {data.records.map((record) => (
                <li key={record.id}>
                  {record.title ? record.title : "No Title"} (ID: {record.id})
                </li>
              ))}
            </ul>
          ):(
            <pre className="bg-gray-50 p-2 text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
