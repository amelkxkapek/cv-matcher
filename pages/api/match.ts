import type { NextApiRequest, NextApiResponse } from 'next';
import { TfIdf } from 'natural';

type MatchResult = {
  match_score: string;
  explanation: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<MatchResult>) {
  if (req.method !== 'POST') {
    res.status(405).json({ match_score: '0%', explanation: 'Only POST method is allowed.' });
    return;
  }

  const { job_description, candidate_cv } = req.body;

  if (!job_description || !candidate_cv) {
    res.status(400).json({ match_score: '0%', explanation: 'Missing job description or CV.' });
    return;
  }

  const tfidf = new TfIdf();
  tfidf.addDocument(job_description);
  tfidf.addDocument(candidate_cv);

  const vecA = tfidf.listTerms(0).map(t => t.tfidf);
  const vecB = tfidf.listTerms(1).map(t => t.tfidf);

  const minLen = Math.min(vecA.length, vecB.length);
  const dotProduct = vecA.slice(0, minLen).reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.slice(0, minLen).reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.slice(0, minLen).reduce((sum, b) => sum + b * b, 0));
  const similarity = (magnitudeA && magnitudeB) ? dotProduct / (magnitudeA * magnitudeB) : 0;

  const scorePercent = Math.round(similarity * 100);

  res.status(200).json({
    match_score: `${scorePercent}%`,
    explanation:
      scorePercent > 70
        ? 'CV is highly relevant to the job description.'
        : scorePercent > 40
        ? 'CV has partial relevance. Consider tailoring it more closely.'
        : 'CV does not closely match the job description. Consider significant updates.',
  });
}
