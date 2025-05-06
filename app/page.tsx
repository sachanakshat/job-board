'use client';

import { useState } from 'react';

export default function Home() {
  const [board, setBoard] = useState('remoteok');
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board, title, limit }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Job Board Scraper</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4 mb-8">
        <div>
          <label htmlFor="board" className="block mb-2">Job Board</label>
          <select
            id="board"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="remoteok">RemoteOK</option>
            <option value="weworkremotely">We Work Remotely</option>
            <option value="wellfound">WellFound</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block mb-2">Job Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., DevOps Engineer"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="limit" className="block mb-2">Number of Results</label>
          <input
            type="number"
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            min="1"
            max="10"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Results</h2>
          {results.map((job) => (
            <div key={job.jobId} className="border p-4 rounded">
              <h3 className="text-xl font-semibold">{job.position}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              {job.salary && <p className="text-green-600">{job.salary}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {job.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Job
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 