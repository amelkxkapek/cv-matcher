import { useState } from 'react';
import axios from 'axios';

export default function CVMatchTool() {
  const [jobDesc, setJobDesc] = useState('');
  const [cvText, setCvText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/match', {
        job_description: jobDesc,
        candidate_cv: cvText,
      });
      setResult(response.data);
    } catch (err) {
      setResult({ match_score: 'Error', explanation: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">CV vs Job Description Matcher</h1>

      <div>
        <label className="block font-medium mb-1">Job Description:</label>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full p-2 border rounded"
          rows={8}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Candidate CV:</label>
        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          className="w-full p-2 border rounded"
          rows={8}
        />
      </div>

      <button
        onClick={handleCompare}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Comparing...' : 'Compare'}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Match Result:</h2>
          <p className="mt-2"><strong>Match Score:</strong> {result.match_score}</p>
          <p className="mt-2"><strong>Explanation:</strong> {result.explanation}</p>
        </div>
      )}
    </div>
  );
}
