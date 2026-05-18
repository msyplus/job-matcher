import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { JobDescription } from '../types';

export default function JDMatch() {
  const [rawText, setRawText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<JobDescription | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setParsing(true);
    setError('');
    try {
      const { data: jd } = await api.post('/jd', { rawText });
      const { data: parsed } = await api.post(`/jd/${jd.id}/parse`);
      setResult(parsed);
    } catch (err: any) {
      setError(err.response?.data?.message || '解析失败');
    } finally {
      setParsing(false);
    }
  };

  const handleGenerate = () => {
    if (result) {
      navigate(`/resume/new?jdId=${result.id}`);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">JD 匹配</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">粘贴职位描述（JD）</h3>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="将招聘网站上的职位描述全文粘贴到这里..."
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y text-sm"
        />
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <button
          onClick={handleParse}
          disabled={parsing || !rawText.trim()}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {parsing ? 'AI 解析中...' : 'AI 解析 JD'}
        </button>
      </div>

      {result?.parsedResult && (
        <div className="space-y-4">
          {/* Parsed Result */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">解析结果</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="职位" value={result.parsedResult.position} />
              <Field label="公司" value={result.parsedResult.company} />
              <Field label="地点" value={result.parsedResult.location} />
              <Field label="薪资" value={result.parsedResult.salaryRange} />
              <Field label="学历要求" value={result.parsedResult.education} />
              <Field label="经验要求" value={result.parsedResult.yearsRequired} />
            </div>
            {result.parsedResult.keywords && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">关键词</div>
                <div className="flex flex-wrap gap-2">
                  {result.parsedResult.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handleGenerate}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              🪄 基于此 JD 生成定制简历
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-xs text-gray-400">{label}</span>
      <div className="text-sm text-gray-800 font-medium">{value}</div>
    </div>
  );
}
