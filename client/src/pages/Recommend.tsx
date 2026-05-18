import { useState } from 'react';
import api from '../services/api';

interface JobResult {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  sourceUrl: string;
  sourcePlatform: string;
  matchScore: number;
  matchDetails?: { matchedSkills: string[]; userYears: number };
}

export default function Recommend() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<JobResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/job-search/search', {
        keyword: keyword.trim(),
        location: location.trim() || undefined,
        limit: 20,
      });
      setResults(data);
      setSaved(new Set());
    } catch (err: any) {
      setError(err.response?.data?.message || '搜索失败，请重试');
    }
    setLoading(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await api.post('/job-recommend/save', { jobs: results });
      setSaved(new Set(results.map((_, i) => i)));
    } catch (err: any) {
      setError('保存失败');
    }
    setSaving(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-gray-500 bg-gray-100';
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">岗位推荐</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="职位关键词，如：高级前端工程师"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="城市（可选）"
            className="w-full md:w-32 px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !keyword.trim()}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {loading ? '搜索中...' : '🔍 搜索岗位'}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
      </div>

      {results.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            共 {results.length} 个岗位，按匹配度排序
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving || saved.size === results.length}
            className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saved.size === results.length ? '已保存' : saving ? '保存中...' : '全部保存到推荐'}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {results.map((job, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-800">{job.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreColor(job.matchScore)}`}>
                    {job.matchScore}% 匹配
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {job.company} · {job.location} · {job.salary}
                </div>
                {job.description && (
                  <div className="text-sm text-gray-500 mb-2 line-clamp-2">{job.description}</div>
                )}
                {job.matchDetails && job.matchDetails.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.matchDetails.matchedSkills.map((s) => (
                      <span key={s} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline whitespace-nowrap"
                >
                  查看职位 →
                </a>
                <button
                  onClick={() => {
                    api.post('/job-recommend/save', { jobs: [job] });
                    setSaved(new Set([...saved, i]));
                  }}
                  disabled={saved.has(i)}
                  className={`text-xs px-2 py-1 rounded transition-colors whitespace-nowrap ${saved.has(i) ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-indigo-600'}`}
                >
                  {saved.has(i) ? '已收藏' : '收藏'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && results.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">搜索合适岗位</h3>
          <p className="text-gray-500 text-sm">
            输入职位关键词和你期望的城市，系统自动搜索并匹配你的经历
          </p>
        </div>
      )}
    </div>
  );
}
